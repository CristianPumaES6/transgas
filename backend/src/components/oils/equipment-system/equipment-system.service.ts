import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping, searchKey } from 'src/assets/mappingKeys';
import { GetDate } from 'src/assets/moment.assets';
import { DummyPromise } from 'src/assets/promises.assets';
import { URL_Server } from 'src/config/server.config';
import { EquipmentSystemEntity } from 'src/models/equipment-system.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class EquipmentSystemService {


    constructor(
        @InjectRepository(EquipmentSystemEntity)
        private _EquipmentSystemEntity: Repository<EquipmentSystemEntity>,
    ) { }


    async Gets(equipmentSystemEntity: EquipmentSystemEntity): Promise<EquipmentSystemEntity[]> {

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

                    return this._EquipmentSystemEntity.find({
                        where: [
                            // name && surname && nick && email
                            {
                                id: (equipmentSystemEntity.id || Like('%' + '%')),
                                userId: (equipmentSystemEntity.userId || Like('%' + '%')),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: EquipmentSystemEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }


    // Registra un nuevo grupo de aceite
    async Create(equipmentSystemEntity: EquipmentSystemEntity): Promise<EquipmentSystemEntity> {

        // Hacemos where por todos los campos de la entidad
        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._EquipmentSystemEntity.query("SP_CheckTheLastRecordedTrip @userId='" + equipmentSystemEntity.userId + "', @year='");
                } else {
                    // No lo validamos por que puede llegar vacio.
                    return this._EquipmentSystemEntity.save(equipmentSystemEntity);
                }

            }
        ).then(
            (resultSave: any) => {
                if (!resultSave) throw new Error('No se puedo registrar el tipo de aceite.');

                if (URL_Server.bd === 'MSSQL') {
                    // MSSQL
                    if (resultSave.length == 0) throw new Error('No se puedo registrar el tipo de aceite.');
                    return resultSave[0];
                } else {
                    // SLQITE
                    return resultSave;
                }
            }
        )

    }


    // guarda una lista de aceite.
    async SaveList(MappingGroupOils: Mapping[], typesOfOilEquipmentEntity: EquipmentSystemEntity[]) {

        // Mapping
        let MappingEquipmentSystems: Mapping[] = [];

        // FIltramos los datos que faltan aggregar y actualizar.
        const addEquipmentSystems = typesOfOilEquipmentEntity.filter((equipmentSystemEntity: EquipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'added');
        const updateEquipmentSystems = typesOfOilEquipmentEntity.filter((equipmentSystemEntity: EquipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'updated');
        const deleteEquipmentSystems = typesOfOilEquipmentEntity.filter((equipmentSystemEntity: EquipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'deleted');



        for await (const addEquipmentSystem of addEquipmentSystems) {

            let searchMappingGroupOils = searchKey(MappingGroupOils, addEquipmentSystem.entityGroupId);

            // Armamos al nuevo tipo de aceite
            let newEquipmentSystemEntity = new EquipmentSystemEntity();

            delete newEquipmentSystemEntity.id;
            newEquipmentSystemEntity.userId = addEquipmentSystem.userId;
            newEquipmentSystemEntity.equipment = addEquipmentSystem.equipment;
            newEquipmentSystemEntity.rate = addEquipmentSystem.rate;
           
            newEquipmentSystemEntity.entityFrequencyId = addEquipmentSystem.entityFrequencyId;
            
            newEquipmentSystemEntity.entityGroupId = addEquipmentSystem.entityGroupId;
            if (searchMappingGroupOils) { newEquipmentSystemEntity.entityGroupId = searchMappingGroupOils.value }

            // Auditoria.
            newEquipmentSystemEntity.userIdCreated = addEquipmentSystem.userIdCreated;
            newEquipmentSystemEntity.dateCreated = GetDate();
            delete newEquipmentSystemEntity.userIdUpdated;
            delete newEquipmentSystemEntity.dateUpdated;
            newEquipmentSystemEntity.status = Boolean(addEquipmentSystem.status);

            // Registramos grupo de aceite
            let registeredGroupOil = await this.Create(newEquipmentSystemEntity);

            // Lo agregamos al mapping
            MappingEquipmentSystems.push(new Mapping(addEquipmentSystem.id, registeredGroupOil.id))
        }

        for await (const updateEquipmentSystem of updateEquipmentSystems) {
            let searchMappingGroupOils = searchKey(MappingGroupOils, updateEquipmentSystem.entityGroupId);

            let equipmentSystem = new EquipmentSystemEntity();

            equipmentSystem.id = updateEquipmentSystem.id;
            equipmentSystem.userId = updateEquipmentSystem.userId;
            equipmentSystem.rate = updateEquipmentSystem.rate;
            equipmentSystem.equipment = updateEquipmentSystem.equipment;
            
            equipmentSystem.entityFrequencyId = updateEquipmentSystem.entityFrequencyId;
            
            equipmentSystem.entityGroupId = updateEquipmentSystem.entityGroupId;
            if (searchMappingGroupOils) { equipmentSystem.entityGroupId = searchMappingGroupOils.value }

            // Auditoria.
            equipmentSystem.userIdCreated = updateEquipmentSystem.userIdCreated;
            equipmentSystem.dateCreated = updateEquipmentSystem.dateCreated;
            equipmentSystem.userIdUpdated = updateEquipmentSystem.userIdUpdated;
            equipmentSystem.dateUpdated = updateEquipmentSystem.dateUpdated;
            equipmentSystem.status = Boolean(updateEquipmentSystem.status);

            await this._EquipmentSystemEntity.save(equipmentSystem);
        }



        for await (let deleteEquipmentSystem of deleteEquipmentSystems) {
           let searchMappingGroupOils = searchKey(MappingGroupOils, deleteEquipmentSystem.entityGroupId);

            let equipmentSystem = new EquipmentSystemEntity();

            equipmentSystem.id = deleteEquipmentSystem.id;
            equipmentSystem.userId = deleteEquipmentSystem.userId;
            equipmentSystem.rate = deleteEquipmentSystem.rate;
            equipmentSystem.equipment = deleteEquipmentSystem.equipment;
            
            equipmentSystem.entityFrequencyId = deleteEquipmentSystem.entityFrequencyId;
            
            equipmentSystem.entityGroupId = deleteEquipmentSystem.entityGroupId;
            if (searchMappingGroupOils) { equipmentSystem.entityGroupId = searchMappingGroupOils.value }

            // Auditoria.
            equipmentSystem.userIdCreated = deleteEquipmentSystem.userIdCreated;
            equipmentSystem.dateCreated = deleteEquipmentSystem.dateCreated;
            equipmentSystem.userIdUpdated = deleteEquipmentSystem.userIdUpdated;
            equipmentSystem.dateUpdated = deleteEquipmentSystem.dateUpdated;
            equipmentSystem.status = Boolean(deleteEquipmentSystem.status);

            await this._EquipmentSystemEntity.save(equipmentSystem);
        }


        return MappingEquipmentSystems;
    }
}
