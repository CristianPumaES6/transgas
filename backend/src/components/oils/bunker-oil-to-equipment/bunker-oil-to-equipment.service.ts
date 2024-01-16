import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping, searchKey } from 'src/assets/mappingKeys';
import { GetDate } from 'src/assets/moment.assets';
import { DummyPromise } from 'src/assets/promises.assets';
import { URL_Server } from 'src/config/server.config';
import {  BunkerOilToEquipmentEntity } from 'src/models/buker-oil-to-equipment.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class BunkerOilToEquipmentService {





    
    constructor(
        @InjectRepository(BunkerOilToEquipmentEntity)
        private _BunkerOilToEquipment: Repository<BunkerOilToEquipmentEntity>,
    ) { }


    async Gets(groupOilEntity: BunkerOilToEquipmentEntity): Promise<BunkerOilToEquipmentEntity[]> {

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

                    return this._BunkerOilToEquipment.find({
                        where: [
                            // name && surname && nick && email
                            {
                                id: (groupOilEntity.id || Like('%' + '%')),
                                userId: (groupOilEntity.userId || Like('%' + '%')),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: BunkerOilToEquipmentEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }




    // Registra un nuevo grupo de aceite
    async Create(bunkerOilToEquipment: BunkerOilToEquipmentEntity): Promise<BunkerOilToEquipmentEntity> {

        // Hacemos where por todos los campos de la entidad
        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._BunkerOilToEquipment.query("SP_CheckTheLastRecordedTrip @userId='" + bunkerOilToEquipment.userId + "', @year='");
                } else {
                    // No lo validamos por que puede llegar vacio.
                    return this._BunkerOilToEquipment.save(bunkerOilToEquipment);
                }

            }
        ).then(
            (resultSave: any) => {

                if (!resultSave) throw new Error('No se puedo registrar el Bunker del equipo.');

                if (URL_Server.bd === 'MSSQL') {
                    // MSSQL
                    if (resultSave.length == 0) throw new Error('No se puedo registrar el Bunker del equipo.');
                    return resultSave[0];
                } else {
                    // SLQITE
                    return resultSave;
                }
            }
        );

    }

    // guarda una lista de aceite.
    async SaveList(MappingOils: Mapping[], MappingTypesOfOilEquipment: Mapping[], bunkerOilToEquipmentEntity: BunkerOilToEquipmentEntity[]) {


        // FIltramos los datos que faltan aggregar y actualizar.
        const addBunkerOilToEquipmentEntity = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment: BunkerOilToEquipmentEntity) => bunkerOilToEquipment.SyncStatus == 'added');
        const updateBunkerOilToEquipmentEntity = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment: BunkerOilToEquipmentEntity) => bunkerOilToEquipment.SyncStatus == 'updated');
        const deleteBunkerOilToEquipmentEntity = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment: BunkerOilToEquipmentEntity) => bunkerOilToEquipment.SyncStatus == 'deleted');

        let MappingBunkerOilToEquipmentEntity:Mapping[] = [];

        for await (const addTypeOfOilEquipment of addBunkerOilToEquipmentEntity) {

            let searchMappingTypesOfOilEquipment = searchKey(MappingTypesOfOilEquipment, addTypeOfOilEquipment.entityEquipmentId);
            let searchMappingOils = searchKey(MappingOils, addTypeOfOilEquipment.entityOilId);

            // Armamos al nuevo tipo de aceite
            let newBunkerOilToEquipmentEntity = new BunkerOilToEquipmentEntity();

            delete newBunkerOilToEquipmentEntity.id;
            newBunkerOilToEquipmentEntity.userId = addTypeOfOilEquipment.userId;
            newBunkerOilToEquipmentEntity.entityEquipmentId = addTypeOfOilEquipment.entityEquipmentId;
            if (searchMappingTypesOfOilEquipment) { addTypeOfOilEquipment.entityEquipmentId = searchMappingTypesOfOilEquipment.value }
            newBunkerOilToEquipmentEntity.entityOilId = addTypeOfOilEquipment.entityOilId;
            if (searchMappingOils) { newBunkerOilToEquipmentEntity.entityOilId = searchMappingOils.value }
            newBunkerOilToEquipmentEntity.bunker = addTypeOfOilEquipment.bunker;
            newBunkerOilToEquipmentEntity.comment = addTypeOfOilEquipment.comment;
            newBunkerOilToEquipmentEntity.datetime = addTypeOfOilEquipment.datetime;

            // Auditoria.
            newBunkerOilToEquipmentEntity.userIdCreated = addTypeOfOilEquipment.id;
            newBunkerOilToEquipmentEntity.dateCreated = GetDate();
            delete newBunkerOilToEquipmentEntity.userIdUpdated;
            delete newBunkerOilToEquipmentEntity.dateUpdated;
            newBunkerOilToEquipmentEntity.status = Boolean(addTypeOfOilEquipment.status);

            // Registramos grupo de aceite
            let registeredBunkerOilToEquipmentEntity = await this.Create(newBunkerOilToEquipmentEntity);

            // Lo agregamos al mapping
            MappingBunkerOilToEquipmentEntity.push(new Mapping(addTypeOfOilEquipment.id, registeredBunkerOilToEquipmentEntity.id))
        }

        for await (const bunkerOilToEquipment of updateBunkerOilToEquipmentEntity) {

            let searchMappingTypesOfOilEquipment = searchKey(MappingTypesOfOilEquipment, bunkerOilToEquipment.entityEquipmentId);
            let searchMappingOils = searchKey(MappingOils, bunkerOilToEquipment.entityOilId);

            // Armamos al nuevo tipo de aceite
            let newBunkerOilToEquipmentEntity = new BunkerOilToEquipmentEntity();

            delete newBunkerOilToEquipmentEntity.id;
            newBunkerOilToEquipmentEntity.userId = bunkerOilToEquipment.userId;
            newBunkerOilToEquipmentEntity.entityEquipmentId = bunkerOilToEquipment.entityEquipmentId;
            if (searchMappingTypesOfOilEquipment) { newBunkerOilToEquipmentEntity.entityEquipmentId = searchMappingTypesOfOilEquipment.value }
            newBunkerOilToEquipmentEntity.entityOilId = bunkerOilToEquipment.entityOilId;
            if (searchMappingOils) { newBunkerOilToEquipmentEntity.entityOilId = searchMappingOils.value }
            newBunkerOilToEquipmentEntity.bunker = bunkerOilToEquipment.bunker;
            newBunkerOilToEquipmentEntity.comment = bunkerOilToEquipment.comment;
            newBunkerOilToEquipmentEntity.datetime = bunkerOilToEquipment.datetime;

            // Auditoria.
            newBunkerOilToEquipmentEntity.userIdCreated = bunkerOilToEquipment.id;
            newBunkerOilToEquipmentEntity.dateCreated = bunkerOilToEquipment.dateCreated;
            newBunkerOilToEquipmentEntity.userIdUpdated = bunkerOilToEquipment.userIdUpdated;
            newBunkerOilToEquipmentEntity.dateUpdated = bunkerOilToEquipment.dateUpdated;
            newBunkerOilToEquipmentEntity.status = Boolean(bunkerOilToEquipment.status);

            await this._BunkerOilToEquipment.save(newBunkerOilToEquipmentEntity);
        }

        for await (let bunkerOilToEquipment of deleteBunkerOilToEquipmentEntity) {

            let searchMappingTypesOfOilEquipment = searchKey(MappingTypesOfOilEquipment, bunkerOilToEquipment.entityEquipmentId);
            let searchMappingOils = searchKey(MappingOils, bunkerOilToEquipment.entityOilId);

            // Armamos al nuevo tipo de aceite
            let newBunkerOilToEquipmentEntity = new BunkerOilToEquipmentEntity();

            delete newBunkerOilToEquipmentEntity.id;
            newBunkerOilToEquipmentEntity.userId = bunkerOilToEquipment.userId;
            newBunkerOilToEquipmentEntity.entityEquipmentId = bunkerOilToEquipment.entityEquipmentId;
            if (searchMappingTypesOfOilEquipment) { newBunkerOilToEquipmentEntity.entityEquipmentId = searchMappingTypesOfOilEquipment.value }
            newBunkerOilToEquipmentEntity.entityOilId = bunkerOilToEquipment.entityOilId;
            if (searchMappingOils) { newBunkerOilToEquipmentEntity.entityOilId = searchMappingOils.value }
            newBunkerOilToEquipmentEntity.bunker = bunkerOilToEquipment.bunker;
            newBunkerOilToEquipmentEntity.comment = bunkerOilToEquipment.comment;
            newBunkerOilToEquipmentEntity.datetime = bunkerOilToEquipment.datetime;

            // Auditoria.
            newBunkerOilToEquipmentEntity.userIdCreated = bunkerOilToEquipment.id;
            newBunkerOilToEquipmentEntity.dateCreated = bunkerOilToEquipment.dateCreated;
            newBunkerOilToEquipmentEntity.userIdUpdated = bunkerOilToEquipment.userIdUpdated;
            newBunkerOilToEquipmentEntity.dateUpdated = bunkerOilToEquipment.dateUpdated;
            newBunkerOilToEquipmentEntity.status = Boolean(bunkerOilToEquipment.status);

            await this._BunkerOilToEquipment.save(bunkerOilToEquipment);
        }

        return MappingTypesOfOilEquipment;
    }

}
