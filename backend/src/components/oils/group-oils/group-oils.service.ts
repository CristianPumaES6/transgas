import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping, searchKey } from '../../../assets/mappingKeys';
import { GetDate } from '../../../assets/moment.assets';
import { DummyPromise } from '../../../assets/promises.assets';
import { URL_Server } from '../../../config/server.config';
import { GroupOilEntity } from '../../../models/group-oils.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class GroupOilsService {




    constructor(
        @InjectRepository(GroupOilEntity)
        private _groupOilRepository: Repository<GroupOilEntity>,
    ) { }


    async Gets(groupOilEntity: GroupOilEntity): Promise<GroupOilEntity[]> {

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

                    return this._groupOilRepository.find({
                        where: [
                            // name && surname && nick && email
                            {
                                id: (groupOilEntity.id || Like('%' + '%')),
                                // userId: (groupOilEntity.userId || Like('%' + '%')),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: GroupOilEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }

    // Registra un nuevo grupo de aceite
    async Create(groupOilEntity: GroupOilEntity): Promise<GroupOilEntity> {

        // Hacemos where por todos los campos de la entidad
        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._groupOilRepository.query("SP_CheckTheLastRecordedTrip @userId='" + groupOilEntity.userId + "', @year='");
                } else {
                    // No lo validamos por que puede llegar vacio.
                    return this._groupOilRepository.save(groupOilEntity);
                }

            }
        ).then(
            (resultSave: any) => {

                if (!resultSave) throw new Error('No se puedo registrar el grupo de aceite.');

                if (URL_Server.bd === 'MSSQL') {
                    // MSSQL
                    if (resultSave.length == 0) throw new Error('No se puedo registrar el grupo de aceite.');
                    return resultSave[0];
                } else {
                    // SLQITE
                    return resultSave;
                }
            }
        )

    }

    // guarda una lista de aceite.
    async SaveList( importGroupOils: GroupOilEntity[] ) {

        // Mapping
        let MappingGroupOils: Mapping[] = [];
        // Filtramos los datos que faltan aggregar y actualizar.
        const addGroupOils = importGroupOils.filter((groupOilEntity: GroupOilEntity) => groupOilEntity.SyncStatus == 'added');
        const updateGroupOils = importGroupOils.filter((groupOilEntity: GroupOilEntity) => groupOilEntity.SyncStatus == 'updated');
        const deleteGroupOils = importGroupOils.filter((groupOilEntity: GroupOilEntity) => groupOilEntity.SyncStatus == 'deleted');


 
        for await (const addGroupOil of addGroupOils) {
            let searchMappingGroupOils = searchKey(MappingGroupOils, addGroupOil.groupId);
           
            // Armamos al nuevo aceite
            let newGroupOilEntity = new GroupOilEntity();

            delete newGroupOilEntity.id;
            newGroupOilEntity.userId = addGroupOil.userId;
            newGroupOilEntity.label = addGroupOil.label;
            newGroupOilEntity.description = addGroupOil.description;

            newGroupOilEntity.groupId = addGroupOil.groupId;
            if (searchMappingGroupOils) { newGroupOilEntity.groupId = searchMappingGroupOils.value }

            // Auditoria
            newGroupOilEntity.userIdCreated = addGroupOil.userIdCreated;
            newGroupOilEntity.dateCreated = GetDate();
            delete newGroupOilEntity.userIdUpdated;
            delete newGroupOilEntity.dateUpdated;
            newGroupOilEntity.status = Boolean(addGroupOil.status);

            // Registramos grupo de aceite
            let registeredGroupOil = await this.Create(newGroupOilEntity);

            // Lo agregamos al mapping
            MappingGroupOils.push(new Mapping(addGroupOil.id, registeredGroupOil.id))
        }

        for await (const updateGroupOil of updateGroupOils) {
            let searchMappingGroupOils = searchKey(MappingGroupOils, updateGroupOil.groupId);
            let updateGroupOilEntity = new GroupOilEntity();

            updateGroupOilEntity.id = updateGroupOil.id;
            updateGroupOilEntity.userId = updateGroupOil.userId;
            updateGroupOilEntity.label = updateGroupOil.label;
            updateGroupOilEntity.description = updateGroupOil.description;

            updateGroupOilEntity.groupId = updateGroupOil.groupId;
            if (searchMappingGroupOils) { updateGroupOilEntity.groupId = searchMappingGroupOils.value }



            // Auditoria
            updateGroupOilEntity.userIdCreated = updateGroupOil.userIdCreated;
            updateGroupOilEntity.dateCreated = updateGroupOil.dateCreated;
            updateGroupOilEntity.userIdUpdated= updateGroupOil.userIdUpdated;
            updateGroupOilEntity.dateUpdated = updateGroupOil.dateUpdated;
            updateGroupOilEntity.status = Boolean(updateGroupOil.status);

            await  this._groupOilRepository.save(updateGroupOil);
        }

        for await (let deleteGroupOil of deleteGroupOils) {
            let searchMappingGroupOils = searchKey(MappingGroupOils, deleteGroupOil.groupId);
            let deleteGroupOilEntity = new GroupOilEntity();

            deleteGroupOilEntity.id = deleteGroupOil.id;
            deleteGroupOilEntity.userId = deleteGroupOil.userId;
            deleteGroupOilEntity.label = deleteGroupOil.label;
            deleteGroupOilEntity.description = deleteGroupOil.description;

            deleteGroupOilEntity.groupId = deleteGroupOil.groupId;
            if (searchMappingGroupOils) { deleteGroupOilEntity.groupId = searchMappingGroupOils.value }

            // Auditoria.
            deleteGroupOilEntity.userIdCreated = deleteGroupOil.userIdCreated;
            deleteGroupOilEntity.dateCreated = deleteGroupOil.dateCreated;
            deleteGroupOilEntity.userIdUpdated= deleteGroupOil.userIdUpdated;
            deleteGroupOilEntity.dateUpdated = deleteGroupOil.dateUpdated;
            deleteGroupOilEntity.status = Boolean(deleteGroupOil.status);

            await this._groupOilRepository.save(deleteGroupOil);
        }


        return MappingGroupOils;
    }
}
