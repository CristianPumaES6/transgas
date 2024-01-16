import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping, searchKey } from 'src/assets/mappingKeys';
import { GetDate } from 'src/assets/moment.assets';
import { DummyPromise } from 'src/assets/promises.assets';
import { URL_Server } from 'src/config/server.config';
import { TypeOfOilEquipmentEntity } from 'src/models/type-of-oils-equipment.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class TypeOfOilEquipmentService {


    constructor(
        @InjectRepository(TypeOfOilEquipmentEntity)
        private _TypeOfOilEquimentEntity: Repository<TypeOfOilEquipmentEntity>,
    ) { }


    async Gets(typeOfOilEquipmentEntity: TypeOfOilEquipmentEntity): Promise<TypeOfOilEquipmentEntity[]> {

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

                    return this._TypeOfOilEquimentEntity.find({
                        where: [
                            // name && surname && nick && email
                            {
                                id: (typeOfOilEquipmentEntity.id || Like('%' + '%')),
                                userId: (typeOfOilEquipmentEntity.userId || Like('%' + '%')),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: TypeOfOilEquipmentEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }


    // Registra un nuevo grupo de aceite
    async Create(typeOfOilEquipmentEntity: TypeOfOilEquipmentEntity): Promise<TypeOfOilEquipmentEntity> {

        // Hacemos where por todos los campos de la entidad
        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._TypeOfOilEquimentEntity.query("SP_CheckTheLastRecordedTrip @userId='" + typeOfOilEquipmentEntity.userId + "', @year='");
                } else {
                    // No lo validamos por que puede llegar vacio.
                    return this._TypeOfOilEquimentEntity.save(typeOfOilEquipmentEntity);
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
    async SaveList(MappingGroupOils: Mapping[], typesOfOilEquipmentEntity: TypeOfOilEquipmentEntity[]) {

        let MappingTypesOfOilEquipment: Mapping[] = [];

        // FIltramos los datos que faltan aggregar y actualizar.
        const addTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((typeOfOilEquipmentEntity: TypeOfOilEquipmentEntity) => typeOfOilEquipmentEntity.SyncStatus == 'added');
        const updateTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((typeOfOilEquipmentEntity: TypeOfOilEquipmentEntity) => typeOfOilEquipmentEntity.SyncStatus == 'updated');
        const deleteTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((typeOfOilEquipmentEntity: TypeOfOilEquipmentEntity) => typeOfOilEquipmentEntity.SyncStatus == 'deleted');



        for await (const addTypeOfOilEquipment of addTypesOfOilEquipment) {

            let searchMappingGroupOils = searchKey(MappingGroupOils, addTypeOfOilEquipment.entityGroupId);

            // Armamos al nuevo tipo de aceite
            let newTypeOfOilEquipmentEntity = new TypeOfOilEquipmentEntity();

            delete newTypeOfOilEquipmentEntity.id;
            newTypeOfOilEquipmentEntity.userId = addTypeOfOilEquipment.userId;
            newTypeOfOilEquipmentEntity.equipment = addTypeOfOilEquipment.equipment;
            newTypeOfOilEquipmentEntity.entityGroupId = addTypeOfOilEquipment.entityGroupId;
            if (searchMappingGroupOils) { newTypeOfOilEquipmentEntity.entityGroupId = searchMappingGroupOils.value }

            // Auditoria.
            newTypeOfOilEquipmentEntity.userIdCreated = addTypeOfOilEquipment.id;
            newTypeOfOilEquipmentEntity.dateCreated = GetDate();
            delete newTypeOfOilEquipmentEntity.userIdUpdated;
            delete newTypeOfOilEquipmentEntity.dateUpdated;
            newTypeOfOilEquipmentEntity.status = Boolean(addTypeOfOilEquipment.status);

            // Registramos grupo de aceite
            let registeredGroupOil = await this.Create(newTypeOfOilEquipmentEntity);

            // Lo agregamos al mapping
            MappingTypesOfOilEquipment.push(new Mapping(addTypeOfOilEquipment.id, registeredGroupOil.id))
        }

        for await (const updateTypeOfOilEquipment of updateTypesOfOilEquipment) {
            let searchMappingGroupOils = searchKey(MappingGroupOils, updateTypeOfOilEquipment.entityGroupId);

            let typeOfOilEquipment = new TypeOfOilEquipmentEntity();

            typeOfOilEquipment.id = updateTypeOfOilEquipment.id;
            typeOfOilEquipment.userId = updateTypeOfOilEquipment.userId;
            typeOfOilEquipment.equipment = updateTypeOfOilEquipment.equipment;
            typeOfOilEquipment.entityGroupId = updateTypeOfOilEquipment.entityGroupId;
            if (searchMappingGroupOils) { typeOfOilEquipment.entityGroupId = searchMappingGroupOils.value }

            // Auditoria.
            typeOfOilEquipment.userIdCreated = updateTypeOfOilEquipment.id;
            typeOfOilEquipment.dateCreated = updateTypeOfOilEquipment.dateCreated;
            typeOfOilEquipment.userIdUpdated = updateTypeOfOilEquipment.userIdUpdated;
            typeOfOilEquipment.dateUpdated = updateTypeOfOilEquipment.dateUpdated;
            typeOfOilEquipment.status = Boolean(updateTypeOfOilEquipment.status);

            await this._TypeOfOilEquimentEntity.save(typeOfOilEquipment);
        }



        for await (let deleteTypeOfOilEquipment of deleteTypesOfOilEquipment) {
            let searchMappingGroupOils = searchKey(MappingGroupOils, deleteTypeOfOilEquipment.entityGroupId);

            let typeOfOilEquipment = new TypeOfOilEquipmentEntity();


            typeOfOilEquipment.id = deleteTypeOfOilEquipment.id;
            typeOfOilEquipment.userId = deleteTypeOfOilEquipment.userId;
            typeOfOilEquipment.equipment = deleteTypeOfOilEquipment.equipment;
            typeOfOilEquipment.entityGroupId = deleteTypeOfOilEquipment.entityGroupId;
            if (searchMappingGroupOils) { typeOfOilEquipment.entityGroupId = searchMappingGroupOils.value }

            // Auditoria.
            typeOfOilEquipment.userIdCreated = deleteTypeOfOilEquipment.id;
            typeOfOilEquipment.dateCreated = deleteTypeOfOilEquipment.dateCreated;
            typeOfOilEquipment.userIdUpdated = deleteTypeOfOilEquipment.userIdUpdated;
            typeOfOilEquipment.dateUpdated = deleteTypeOfOilEquipment.dateUpdated;
            typeOfOilEquipment.status = Boolean(deleteTypeOfOilEquipment.status);

            await this._TypeOfOilEquimentEntity.save(typeOfOilEquipment);
        }


        return MappingTypesOfOilEquipment;
    }
}
