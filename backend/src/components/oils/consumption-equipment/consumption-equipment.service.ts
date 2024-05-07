import { Injectable } from '@nestjs/common';
import { OilEntity } from '../../../models/oil.entity';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from "typeorm";
import { Not } from "typeorm";

// Otras librerias. 
import * as bcrypt from 'bcrypt';
import { ROUNDS_BCRYPT } from '../../../config/bcrypt.config';
import { URL_Server } from '../../../config/server.config'

// Modelos.
import { UserEntity } from '../../../models/user.entity';
import { DummyPromise } from '../../../assets/promises.assets';
import { ConvertMMDDYYYToYYYYMMDD, GetDate } from '../../../assets/moment.assets';
import { ConsumptionEquipmentEntity } from 'src/models/consumptionEquipment.entity';
import { Mapping, searchKey } from 'src/assets/mappingKeys';

@Injectable()
export class ConsumptionEquipmentService {
    constructor(
        @InjectRepository(ConsumptionEquipmentEntity)
        private _ConsumptionEquipment: Repository<ConsumptionEquipmentEntity>,
    ) { }


    async Gets(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity[]> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {

                    return null
                    
                    //  return hthis.userRepository.query(
                    //
                    // `EXEC SP_BuscarUsuariosByFilter @userId =0,@nick = '${user.nick || ''}',@name = '${user.name || ''}',@role= '${user.role || ''}'
                    // `
                    // );

                } else {

                    return this._ConsumptionEquipment.find({
                        where: [
                            // name && surname && nick && email
                            {
                                id: (consumptionEquipment.id || Like('%' + '%')),
                                userId: (consumptionEquipment.userId || Like('%' + '%')),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: ConsumptionEquipmentEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }

    // Registra un nuevo grupo de aceite
    async Create(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity> {

        // Hacemos where por todos los campos de la entidad
        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._ConsumptionEquipment.query("SP_CheckTheLastRecordedTrip @userId='" + consumptionEquipment.userId + "', @year='");
                } else {
                    // No lo validamos por que puede llegar vacio.
                    return this._ConsumptionEquipment.save(consumptionEquipment);
                }

            }
        ).then(
            (resultSave: any) => {

                if (!resultSave) throw new Error('No se puedo registrar el consumo por equipo.');

                if (URL_Server.bd === 'MSSQL') {
                    // MSSQL
                    if (resultSave.length == 0) throw new Error('No se puedo registrar el consumo por equipo.');
                    return resultSave[0];
                } else {
                    // SLQITE
                    return resultSave;
                }
            }
        )

    }

 
    // Guarda una lista de aceite.
    async SaveList(MappingEquipmentOilCompatibility: Mapping[], consumptionsEquipment: ConsumptionEquipmentEntity[]): Promise<SaveListConsumptionEquipmentEntity> {


        let MappingConsumptionsEquipment: Mapping[] = [];

        // FIltramos los datos que faltan aggregar y actualizar.
        const addConsumptionEquipments = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'added');
        const updateConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'updated');
        const deleteConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'deleted');

        let listDeConsumosRegistrados = [];

        for await (const addConsumptionEquipment of addConsumptionEquipments) {

            let searchMappingEquipmentOilCompatibility = searchKey(MappingEquipmentOilCompatibility, addConsumptionEquipment.entityEquipmentOilCompatibilityId);

            // Armamos al nuevo tipo de aceite
            let newConsumptionEquipmentEntity = new ConsumptionEquipmentEntity();

            delete newConsumptionEquipmentEntity.id;
            newConsumptionEquipmentEntity.userId = addConsumptionEquipment.userId;
            newConsumptionEquipmentEntity.date = addConsumptionEquipment.date;
            newConsumptionEquipmentEntity.amount = addConsumptionEquipment.amount || 0;
            newConsumptionEquipmentEntity.hourConsumption = addConsumptionEquipment.hourConsumption || 0;
            newConsumptionEquipmentEntity.observation = addConsumptionEquipment.observation || '';
            newConsumptionEquipmentEntity.entityEquipmentOilCompatibilityId = addConsumptionEquipment.entityEquipmentOilCompatibilityId;
            if (searchMappingEquipmentOilCompatibility) { newConsumptionEquipmentEntity.entityEquipmentOilCompatibilityId = searchMappingEquipmentOilCompatibility.value }
 
            
            // AQUI VALIDAR MI SOBRE CONSUMO
            // SendMailHTMLLubricante  976873362

            // Auditoria.
            newConsumptionEquipmentEntity.userIdCreated = addConsumptionEquipment.userIdCreated;
            newConsumptionEquipmentEntity.dateCreated = GetDate();
            delete newConsumptionEquipmentEntity.userIdUpdated;
            delete newConsumptionEquipmentEntity.dateUpdated;
            newConsumptionEquipmentEntity.status = Boolean(addConsumptionEquipment.status);

            // Registramos grupo de aceite
            let registeredConsumptionEquipmentEntity  = await this.Create(newConsumptionEquipmentEntity);

            // solo si esta activo guardaremos su Id para proximas evaluaciones
            if(newConsumptionEquipmentEntity.status){
                listDeConsumosRegistrados.push(registeredConsumptionEquipmentEntity.id);
            }
            // Lo agregamos al mapping
            MappingConsumptionsEquipment.push(new Mapping(addConsumptionEquipment.id, registeredConsumptionEquipmentEntity.id))
        }

        for await (const updateEquipmentSystem of updateConsumptionEquipment) {

            let searchMappingEquipmentOilCompatibility = searchKey(MappingEquipmentOilCompatibility, updateEquipmentSystem.entityEquipmentOilCompatibilityId);

            let consumptionEquipmentEntity = new ConsumptionEquipmentEntity();

            consumptionEquipmentEntity.id = updateEquipmentSystem.id;
            consumptionEquipmentEntity.userId = updateEquipmentSystem.userId;
            consumptionEquipmentEntity.date = updateEquipmentSystem.date;
            consumptionEquipmentEntity.amount = updateEquipmentSystem.amount || 0;
            consumptionEquipmentEntity.hourConsumption = updateEquipmentSystem.hourConsumption || 0;
            consumptionEquipmentEntity.observation = updateEquipmentSystem.observation || '';
            
            consumptionEquipmentEntity.entityEquipmentOilCompatibilityId = updateEquipmentSystem.entityEquipmentOilCompatibilityId;
            if (searchMappingEquipmentOilCompatibility) { consumptionEquipmentEntity.entityEquipmentOilCompatibilityId = searchMappingEquipmentOilCompatibility.value }
 
            // Auditoria.
            consumptionEquipmentEntity.userIdCreated = updateEquipmentSystem.userIdCreated;
            consumptionEquipmentEntity.dateCreated = updateEquipmentSystem.dateCreated;
            consumptionEquipmentEntity.userIdUpdated = updateEquipmentSystem.userIdUpdated;
            consumptionEquipmentEntity.dateUpdated = updateEquipmentSystem.dateUpdated;
            consumptionEquipmentEntity.status = Boolean(updateEquipmentSystem.status);

            // solo si esta activo guardaremos su Id para proximas evaluaciones
            if(consumptionEquipmentEntity.status){
                listDeConsumosRegistrados.push(consumptionEquipmentEntity.id);
            }
            await this._ConsumptionEquipment.save(consumptionEquipmentEntity);
        }

        for await (let deletConsumptionEquipment of deleteConsumptionEquipment) {
         

            let searchMappingEquipmentOilCompatibility = searchKey(MappingEquipmentOilCompatibility, deletConsumptionEquipment.entityEquipmentOilCompatibilityId);

            let consumptionEquipmentEntity = new ConsumptionEquipmentEntity();

            consumptionEquipmentEntity.id = deletConsumptionEquipment.id;
            consumptionEquipmentEntity.userId = deletConsumptionEquipment.userId;
            consumptionEquipmentEntity.date = deletConsumptionEquipment.date;
            consumptionEquipmentEntity.amount = deletConsumptionEquipment.amount  || 0;
            consumptionEquipmentEntity.hourConsumption = deletConsumptionEquipment.hourConsumption || 0;
            consumptionEquipmentEntity.observation = deletConsumptionEquipment.observation || '';
            
            consumptionEquipmentEntity.entityEquipmentOilCompatibilityId = deletConsumptionEquipment.entityEquipmentOilCompatibilityId;
            if (searchMappingEquipmentOilCompatibility) { consumptionEquipmentEntity.entityEquipmentOilCompatibilityId = searchMappingEquipmentOilCompatibility.value }
 
            // Auditoria.
            consumptionEquipmentEntity.userIdCreated = deletConsumptionEquipment.userIdCreated;
            consumptionEquipmentEntity.dateCreated = deletConsumptionEquipment.dateCreated;
            consumptionEquipmentEntity.userIdUpdated = deletConsumptionEquipment.userIdUpdated;
            consumptionEquipmentEntity.dateUpdated = deletConsumptionEquipment.dateUpdated;
            consumptionEquipmentEntity.status = Boolean(deletConsumptionEquipment.status);
 
            await this._ConsumptionEquipment.save(deletConsumptionEquipment);
        }


            // AQUI VALIDAR MI SOBRE CONSUMO
            // SendMailHTMLLubricante  976873362


        return {
            MappingConsumptionsEquipment:MappingConsumptionsEquipment,
            listConsumosValidarSendMail:listDeConsumosRegistrados
         } 
    }

    
  async getOilConsumptionPerMonth(userId: number): Promise<getOilConsumptionPerMonth[]> {
    
    const query = `
    SELECT
        EOC.id AS compatibilityId,
        strftime('%Y-%m', CE.date) AS year_month,
        ES.id AS equipmentId,
        ES.equipment AS equipmentName,
        ES.rate AS rateSystems, -- Agregar la columna del rate del sistema
        ES.entityGroupId AS subgroupId, -- Agregar la columna del subgrupo
        SUM(CE.amount) AS total_amount,
        SUM(CE.hourConsumption) AS total_hourConsumption,
        (
            SELECT O.name
            FROM oil O
            INNER JOIN (
                SELECT entityOilId
                FROM consumptionEquipment
                WHERE entityEquipmentOilCompatibilityId = EOC.id
                ORDER BY date DESC
                LIMIT 1
            ) AS LastConsumption ON O.id = LastConsumption.entityOilId
        ) AS lastOilName
    FROM
        consumptionEquipment CE
        INNER JOIN equipmentOilCompatibility EOC ON CE.entityEquipmentOilCompatibilityId = EOC.id
        INNER JOIN equipmentSystem ES ON EOC.entityEquipmentId = ES.id
    WHERE
        CE.userId = ? AND
        CE.status = 1
    GROUP BY
        year_month,
        EOC.id,
        SubgroupId; -- Agregar el subgrupo a la lista de columnas de agrupación
    `;

    return this._ConsumptionEquipment.query(query,  [userId ]);
  }


  
  
  async consultEquipmentConsumptionByMonthUser(userId : number, entityEquipmentId: number, DateYEAR_MONTH:string): Promise<consultEquipmentConsumptionByMonthUser[]>  {
    const query = `               
        SELECT
            EOC.id AS compatibilityId,
            strftime('%Y-%m', CE.date) AS year_month,
            strftime('%Y-%m-%d', CE.date) AS consumption_date, -- Agregar la fecha de consumo
            ES.id AS equipmentId,
            ES.equipment AS equipmentName,
            ES.rate AS rateSystems,
            ES.entityGroupId AS subgroupId,
            SUM(CE.amount) AS total_amount,
            SUM(CE.hourConsumption) AS total_hourConsumption,
            (
                SELECT O.name
                FROM oil O
                INNER JOIN (
                    SELECT entityOilId
                    FROM consumptionEquipment
                    WHERE entityEquipmentOilCompatibilityId = EOC.id
                    ORDER BY date DESC
                    LIMIT 1
                ) AS LastConsumption ON O.id = LastConsumption.entityOilId
            ) AS lastOilName,
            GROUP_CONCAT(CE.id) AS consumptionIds, -- Lista de IDs de consumo
            CASE 
                WHEN COALESCE(SUM(CE.hourConsumption), 0) > 0 THEN ROUND(CAST(SUM(CE.amount) AS REAL) / SUM(CE.hourConsumption), 2) 
                ELSE 0 
            END AS rate
        FROM
            consumptionEquipment CE
            INNER JOIN equipmentOilCompatibility EOC ON CE.entityEquipmentOilCompatibilityId = EOC.id
            INNER JOIN equipmentSystem ES ON EOC.entityEquipmentId = ES.id
        WHERE
            CE.userId =  ${userId}
            AND CE.status = 1
            AND strftime('%Y-%m', CE.date) = '${DateYEAR_MONTH}' -- Filtrar por mes específico
            AND ES.id = ${entityEquipmentId} -- Filtrar por equipo específico
        GROUP BY
            year_month,
            EOC.id,
            consumption_date, -- Agregar la fecha de consumo a la agrupación
            subgroupId; 
    `;
    

    return this._ConsumptionEquipment.query(query,  []);
  }
}

export interface SaveListConsumptionEquipmentEntity {
    MappingConsumptionsEquipment:Mapping[];
    listConsumosValidarSendMail: any[] ;
}


export interface getOilConsumptionPerMonth {
    compatibilityId:number,
    year_month: string;
    equipmentId: number;
    equipmentName: string;
    rateSystems: number;
    subgroupId: number;
    total_amount: number;
    total_hourConsumption: number; 
    LastOilName: string;
}


export interface consultEquipmentConsumptionByMonthUser {
    equipmentSystemUserId: string;
    EquipmentId: number;
    EquipmentName: string;
    RateSystems: number;
    consumptionEquipmentId: number;
    TotalConsumption: number;
    HourConsumption: number;
    Rate: number;
    Observations: number;
    ConsumptionDate: string;
    bunkerOilId: number;
    TotalBunker: number;
    BunkerDate: string;
}