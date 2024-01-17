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
    async SaveList(MappingGroupOils: Mapping[], consumptionsEquipment: ConsumptionEquipmentEntity[]) {


        let MappingConsumptionsEquipment: Mapping[] = [];
        // FIltramos los datos que faltan aggregar y actualizar.
        const addConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'added');
        const updateConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'updated');
        const deleteConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'deleted');



        for await (const consumptionEquipment of addConsumptionEquipment) {

            let searchMappingConsumptionEquipmentEntity = searchKey(MappingGroupOils, consumptionEquipment.entityEquipmentId);

            // Armamos al nuevo tipo de aceite
            let newConsumptionEquipmentEntity = new ConsumptionEquipmentEntity();

            delete newConsumptionEquipmentEntity.id;
            newConsumptionEquipmentEntity.userId = consumptionEquipment.userId;
            newConsumptionEquipmentEntity.date = consumptionEquipment.date;
            newConsumptionEquipmentEntity.amount = consumptionEquipment.amount;
            newConsumptionEquipmentEntity.hourConsumption = consumptionEquipment.hourConsumption;
            newConsumptionEquipmentEntity.observation = consumptionEquipment.observation;
            newConsumptionEquipmentEntity.entityEquipmentId = consumptionEquipment.entityEquipmentId;
            if (searchMappingConsumptionEquipmentEntity) { newConsumptionEquipmentEntity.entityEquipmentId = searchMappingConsumptionEquipmentEntity.value }

            // Auditoria.
            newConsumptionEquipmentEntity.userIdCreated = consumptionEquipment.userIdCreated;
            newConsumptionEquipmentEntity.dateCreated = GetDate();
            delete newConsumptionEquipmentEntity.userIdUpdated;
            delete newConsumptionEquipmentEntity.dateUpdated;
            newConsumptionEquipmentEntity.status = Boolean(consumptionEquipment.status);

            // Registramos grupo de aceite
            let registeredConsumptionEquipmentEntity  = await this.Create(newConsumptionEquipmentEntity);

            // Lo agregamos al mapping
            MappingConsumptionsEquipment.push(new Mapping(newConsumptionEquipmentEntity.id, registeredConsumptionEquipmentEntity.id))
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


        return MappingConsumptionsEquipment;
    }
}
