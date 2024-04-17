import { Injectable } from '@nestjs/common';
import { OilEntity } from '../../../../models/oil.entity';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from "typeorm";
import { Not } from "typeorm";

// Otras librerias. 
import * as bcrypt from 'bcrypt';
import { ROUNDS_BCRYPT } from '../../../../config/bcrypt.config';
import { URL_Server } from '../../../../config/server.config'

// Modelos.
import { UserEntity } from '../../../../models/user.entity';
import { DummyPromise } from '../../../../assets/promises.assets';
import { ConvertMMDDYYYToYYYYMMDD, GetDate } from '../../../../assets/moment.assets';
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

 
    // guarda una lista de aceite.
    async SaveList(MappingGroupOils: Mapping[], consumptionsEquipment: ConsumptionEquipmentEntity[]): Promise<SaveListConsumptionEquipmentEntity> {


        let MappingConsumptionsEquipment: Mapping[] = [];
        // FIltramos los datos que faltan aggregar y actualizar.
        const addConsumptionEquipments = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'added');
        const updateConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'updated');
        const deleteConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'deleted');

        let listDeConsumosRegistrados = [];

        for await (const addConsumptionEquipment of addConsumptionEquipments) {

            let searchMappingConsumptionEquipmentEntity = searchKey(MappingGroupOils, addConsumptionEquipment.entityEquipmentId);

            // Armamos al nuevo tipo de aceite
            let newConsumptionEquipmentEntity = new ConsumptionEquipmentEntity();

            delete newConsumptionEquipmentEntity.id;
            newConsumptionEquipmentEntity.userId = addConsumptionEquipment.userId;
            newConsumptionEquipmentEntity.date = addConsumptionEquipment.date;
            newConsumptionEquipmentEntity.amount = addConsumptionEquipment.amount;
            newConsumptionEquipmentEntity.hourConsumption = addConsumptionEquipment.hourConsumption;
            newConsumptionEquipmentEntity.observation = addConsumptionEquipment.observation;
            newConsumptionEquipmentEntity.entityEquipmentId = addConsumptionEquipment.entityEquipmentId;
            if (searchMappingConsumptionEquipmentEntity) { newConsumptionEquipmentEntity.entityEquipmentId = searchMappingConsumptionEquipmentEntity.value }

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

        for await (const updateTypeOfOilEquipment of updateConsumptionEquipment) {

            let searchMappingConsumptionEquipmentEntity = searchKey(MappingGroupOils, updateTypeOfOilEquipment.entityEquipmentId);

            let typeOfOilEquipment = new ConsumptionEquipmentEntity();

            typeOfOilEquipment.id = updateTypeOfOilEquipment.id;
            typeOfOilEquipment.userId = updateTypeOfOilEquipment.userId;
            typeOfOilEquipment.date = updateTypeOfOilEquipment.date;
            typeOfOilEquipment.amount = updateTypeOfOilEquipment.amount;
            typeOfOilEquipment.hourConsumption = updateTypeOfOilEquipment.hourConsumption;
            typeOfOilEquipment.observation = updateTypeOfOilEquipment.observation;
            typeOfOilEquipment.entityEquipmentId = updateTypeOfOilEquipment.entityEquipmentId;
            if (searchMappingConsumptionEquipmentEntity) { typeOfOilEquipment.entityEquipmentId = searchMappingConsumptionEquipmentEntity.value }


            // Auditoria.
            typeOfOilEquipment.userIdCreated = updateTypeOfOilEquipment.userIdCreated;
            typeOfOilEquipment.dateCreated = updateTypeOfOilEquipment.dateCreated;
            typeOfOilEquipment.userIdUpdated = updateTypeOfOilEquipment.userIdUpdated;
            typeOfOilEquipment.dateUpdated = updateTypeOfOilEquipment.dateUpdated;
            typeOfOilEquipment.status = Boolean(updateTypeOfOilEquipment.status);

            // solo si esta activo guardaremos su Id para proximas evaluaciones
            if(typeOfOilEquipment.status){
                listDeConsumosRegistrados.push(typeOfOilEquipment.id);
            }
            await this._ConsumptionEquipment.save(typeOfOilEquipment);
        }

        for await (let consumptionEquipment of deleteConsumptionEquipment) {
         
            let searchMappingConsumptionEquipmentEntity = searchKey(MappingGroupOils, consumptionEquipment.entityEquipmentId);

            let typeOfOilEquipment = new ConsumptionEquipmentEntity();

            typeOfOilEquipment.id = consumptionEquipment.id;
            typeOfOilEquipment.userId = consumptionEquipment.userId;
            typeOfOilEquipment.date = consumptionEquipment.date;
            typeOfOilEquipment.amount = consumptionEquipment.amount;
            typeOfOilEquipment.hourConsumption = consumptionEquipment.hourConsumption;
            typeOfOilEquipment.observation = consumptionEquipment.observation;
            
            typeOfOilEquipment.entityEquipmentId = consumptionEquipment.entityEquipmentId;
            if (searchMappingConsumptionEquipmentEntity) { typeOfOilEquipment.entityEquipmentId = searchMappingConsumptionEquipmentEntity.value }


            // Auditoria.
            typeOfOilEquipment.userIdCreated = consumptionEquipment.userIdCreated;
            typeOfOilEquipment.dateCreated = consumptionEquipment.dateCreated;
            typeOfOilEquipment.userIdUpdated = consumptionEquipment.userIdUpdated;
            typeOfOilEquipment.dateUpdated = consumptionEquipment.dateUpdated;
            typeOfOilEquipment.status = Boolean(consumptionEquipment.status);
 
            await this._ConsumptionEquipment.save(typeOfOilEquipment);
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
    CE.year_month,
    CE.entityEquipmentId,
    CE.total_amount,
    CE.total_hourConsumption,
    CE.rate,
    CE.equipment,
    CE.entityGroupId,
    COALESCE(B.total_bunker, 0) AS total_bunker,
    B.last_entityOilId,
    B.last_oil_name
  FROM
    (SELECT
      strftime('%Y-%m', CE.date) AS year_month,
      CE.entityEquipmentId,
      TOE.entityGroupId,
      SUM(CE.amount) AS total_amount,
      SUM(CE.hourConsumption) AS total_hourConsumption,
      TOE.rate,
      TOE.equipment
    FROM
      consumptionEquipment CE
      INNER JOIN typeOfOilEquipment TOE ON CE.entityEquipmentId = TOE.id
    WHERE
      CE.userId = ? AND
      CE.status = 1
    GROUP BY
      year_month,
      CE.entityEquipmentId,
      TOE.entityGroupId) AS CE
  LEFT JOIN
    (SELECT 
      strftime('%Y-%m', main.datetime) AS year_month,
      main.entityEquipmentId,
      SUM(main.bunker) AS total_bunker,
      (SELECT sub.entityOilId 
       FROM bunkerOilToEquipment sub
       WHERE sub.entityEquipmentId = main.entityEquipmentId
         AND strftime('%Y-%m', sub.datetime) = strftime('%Y-%m', main.datetime)
         AND sub.status = 1
       ORDER BY sub.datetime ASC 
       LIMIT 1) AS last_entityOilId,
      (SELECT O.name 
       FROM bunkerOilToEquipment sub
       INNER JOIN oil O ON O.id = sub.entityOilId
       WHERE sub.entityEquipmentId = main.entityEquipmentId
         AND strftime('%Y-%m', sub.datetime) = strftime('%Y-%m', main.datetime)
         AND sub.status = 1
       ORDER BY sub.datetime ASC 
       LIMIT 1) AS last_oil_name
    FROM 
      bunkerOilToEquipment main
    WHERE main.userId = ? AND
      main.status = 1
    GROUP BY 
      year_month,
      main.entityEquipmentId) AS B ON CE.year_month = B.year_month AND CE.entityEquipmentId = B.entityEquipmentId
  ORDER BY
    CE.year_month ASC, 
    CE.entityEquipmentId;
    `;

    return this._ConsumptionEquipment.query(query,  [userId, userId ]);
  }


  
  
  async consultEquipmentConsumptionByMonthUser(userId : number, entityEquipmentId: number, DateYEAR_MONTH:string): Promise<consultEquipmentConsumptionByMonthUser[]>  {
    const query = `
                    SELECT
                        toe.userId AS typeOfOilEquipmentUserId,
                        toe.id AS EquipmentId,
                        toe.equipment AS EquipmentName,
                        toe.rate AS RateSystems,
                        ce.id AS consumptionEquipmentId,
                        COALESCE(SUM(ce.amount), 0) AS TotalConsumption,
                        COALESCE(SUM(ce.hourConsumption), 0) AS HourConsumption,
                        CASE 
                            WHEN COALESCE(SUM(ce.hourConsumption), 0) > 0 THEN ROUND(CAST(SUM(ce.amount) AS REAL) / SUM(ce.hourConsumption), 2) 
                            ELSE 0 
                        END AS Rate,
                        GROUP_CONCAT(ce.observation, '; ') AS Observations,
                        ce.date AS ConsumptionDate,
                        boe.id AS bunkerOilToEquipmentId,
                        COALESCE(SUM(boe.bunker), 0) AS TotalBunker,
                        MAX(boe.datetime) AS BunkerDate -- Asumiendo que solo hay un bunkering por día.
                    FROM typeOfOilEquipment AS toe
                    LEFT JOIN consumptionEquipment AS ce 
                        ON toe.id = ce.entityEquipmentId AND ce.userId = ${userId}
                    LEFT JOIN bunkerOilToEquipment AS boe 
                        ON toe.id = boe.entityEquipmentId AND boe.userId = ${userId}
                        AND DATE(ce.date) = DATE(boe.datetime)
                    WHERE 
                        toe.id =  ${entityEquipmentId}
                        AND (strftime('%Y-%m', ce.date) = '${DateYEAR_MONTH}' OR strftime('%Y-%m', boe.datetime) = '${DateYEAR_MONTH}')
                    GROUP BY toe.id, ce.date, boe.datetime
                    ORDER BY ce.date, boe.datetime;
    `;
    

    return this._ConsumptionEquipment.query(query,  []);
  }
}

export interface SaveListConsumptionEquipmentEntity {
    MappingConsumptionsEquipment:Mapping[];
    listConsumosValidarSendMail: any[] ;
}


export interface getOilConsumptionPerMonth {
    year_month: string;
    entityEquipmentId: number;
    total_amount: number;
    total_hourConsumption: number;
    rate: number;
    equipment: string;
    entityGroupId: number;
    total_bunker: number;
    last_entityOilId: number;
    last_oil_name: string;
}


export interface consultEquipmentConsumptionByMonthUser {
    typeOfOilEquipmentUserId: string;
    EquipmentId: number;
    EquipmentName: string;
    RateSystems: number;
    consumptionEquipmentId: number;
    TotalConsumption: number;
    HourConsumption: number;
    Rate: number;
    Observations: number;
    ConsumptionDate: string;
    bunkerOilToEquipmentId: number;
    TotalBunker: number;
    BunkerDate: string;
}