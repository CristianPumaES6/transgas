import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping, searchKey } from 'src/assets/mappingKeys';
import { GetDate } from 'src/assets/moment.assets';
import { DummyPromise } from 'src/assets/promises.assets';
import { URL_Server } from 'src/config/server.config';
import {  BunkerOil } from 'src/models/buker-oil-to-equipment.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class BunkerOilService {





    
    constructor(
        @InjectRepository(BunkerOil)
        private _BunkerOilToEquipment: Repository<BunkerOil>,
    ) { }


    async Gets(groupOilEntity: BunkerOil): Promise<BunkerOil[]> {

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
            (result: BunkerOil[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }

    // Registra un nuevo grupo de aceite
    async Create(bunkerOilToEquipment: BunkerOil): Promise<BunkerOil> {

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
    async SaveList(MappingOils: Mapping[], MappingTypesOfOilEquipment: Mapping[], bunkerOilToEquipmentEntity: BunkerOil[]) {


        // FIltramos los datos que faltan aggregar y actualizar.
        const addBunkerOil = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment: BunkerOil) => bunkerOilToEquipment.SyncStatus == 'added');
        const updateBunkerOil = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment: BunkerOil) => bunkerOilToEquipment.SyncStatus == 'updated');
        const deleteBunkerOil = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment: BunkerOil) => bunkerOilToEquipment.SyncStatus == 'deleted');

        let MappingBunkerOil:Mapping[] = [];

        for await (const addBunkerOilToEquipment of addBunkerOil) {

             let searchMappingOils = searchKey(MappingOils, addBunkerOilToEquipment.entityOilId);

            // Armamos al nuevo tipo de aceite
            let newBunkerOil = new BunkerOil();

            delete newBunkerOil.id;
            newBunkerOil.userId = addBunkerOilToEquipment.userId;
            newBunkerOil.entityOilId = addBunkerOilToEquipment.entityOilId;
            if (searchMappingOils) { newBunkerOil.entityOilId = searchMappingOils.value }
            newBunkerOil.bunker = addBunkerOilToEquipment.bunker;
            newBunkerOil.comment = addBunkerOilToEquipment.comment;
            newBunkerOil.datetime = addBunkerOilToEquipment.datetime;

            // Auditoria.
            newBunkerOil.userIdCreated = addBunkerOilToEquipment.userIdCreated;
            newBunkerOil.dateCreated = GetDate();
            delete newBunkerOil.userIdUpdated;
            delete newBunkerOil.dateUpdated;
            newBunkerOil.status = Boolean(addBunkerOilToEquipment.status);

            // Registramos grupo de aceite
            let registeredBunkerOil = await this.Create(newBunkerOil);

            // Lo agregamos al mapping
            MappingBunkerOil.push(new Mapping(addBunkerOilToEquipment.id, registeredBunkerOil.id))
        }

        for await (const bunkerOilToEquipment of updateBunkerOil) {

            let searchMappingOils = searchKey(MappingOils, bunkerOilToEquipment.entityOilId);

            // Armamos al nuevo tipo de aceite
            let newBunkerOil = new BunkerOil();
 
            newBunkerOil.id = bunkerOilToEquipment.id;
            newBunkerOil.userId = bunkerOilToEquipment.userId;
            newBunkerOil.entityOilId = bunkerOilToEquipment.entityOilId;
            if (searchMappingOils) { newBunkerOil.entityOilId = searchMappingOils.value }
            newBunkerOil.bunker = bunkerOilToEquipment.bunker;
            newBunkerOil.comment = bunkerOilToEquipment.comment;
            newBunkerOil.datetime = bunkerOilToEquipment.datetime;

            // Auditoria.
            newBunkerOil.userIdCreated = bunkerOilToEquipment.userIdCreated;
            newBunkerOil.dateCreated = bunkerOilToEquipment.dateCreated;
            newBunkerOil.userIdUpdated = bunkerOilToEquipment.userIdUpdated;
            newBunkerOil.dateUpdated = bunkerOilToEquipment.dateUpdated;
            newBunkerOil.status = Boolean(bunkerOilToEquipment.status);

            await this._BunkerOilToEquipment.save(newBunkerOil);
        }

        for await (let bunkerOilToEquipment of deleteBunkerOil) {

            let searchMappingOils = searchKey(MappingOils, bunkerOilToEquipment.entityOilId);

            // Armamos al nuevo tipo de aceite
            let newBunkerOil = new BunkerOil();

            newBunkerOil.id = bunkerOilToEquipment.id;
            newBunkerOil.userId = bunkerOilToEquipment.userId;
            newBunkerOil.entityOilId = bunkerOilToEquipment.entityOilId;
            if (searchMappingOils) { newBunkerOil.entityOilId = searchMappingOils.value }
            newBunkerOil.bunker = bunkerOilToEquipment.bunker;
            newBunkerOil.comment = bunkerOilToEquipment.comment;
            newBunkerOil.datetime = bunkerOilToEquipment.datetime;

            // Auditoria.
            newBunkerOil.userIdCreated = bunkerOilToEquipment.userIdCreated;
            newBunkerOil.dateCreated = bunkerOilToEquipment.dateCreated;
            newBunkerOil.userIdUpdated = bunkerOilToEquipment.userIdUpdated;
            newBunkerOil.dateUpdated = bunkerOilToEquipment.dateUpdated;
            newBunkerOil.status = Boolean(bunkerOilToEquipment.status);

            await this._BunkerOilToEquipment.save(bunkerOilToEquipment);
        }

        return MappingBunkerOil;
    }

}
