import { Injectable } from '@nestjs/common';
import { OilEntity } from '../../../models/oil.entity';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from 'typeorm';
import { Not } from 'typeorm';

// Otras librerias.
import * as bcrypt from 'bcrypt';
import { ROUNDS_BCRYPT } from '../../../config/bcrypt.config';
import { URL_Server } from '../../../config/server.config';

// Modelos.
import { UserEntity } from '../../../models/user.entity';
import { DummyPromise } from '../../../assets/promises.assets';
import { ConvertMMDDYYYToYYYYMMDD, GetDate } from '../../../assets/moment.assets';
import { ConsumptionEquipmentEntity } from '../../../models/consumptionEquipment.entity';
import { Mapping, searchKey } from '../../../assets/mappingKeys';
import { EquipmentOilCompatibilityEntity } from '../../../models/equipment-oil-compatibility.entity';

@Injectable()
export class EquipmentOilCompatibilityService {
  constructor(
    @InjectRepository(EquipmentOilCompatibilityEntity)
    private _EquipmentOilCompatibilityEntity: Repository<EquipmentOilCompatibilityEntity>,
  ) {}

  async Gets(equipmentOilCompatibility: EquipmentOilCompatibilityEntity): Promise<EquipmentOilCompatibilityEntity[]> {
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return null;

          //  return hthis.userRepository.query(
          //
          // `EXEC SP_BuscarUsuariosByFilter @userId =0,@nick = '${user.nick || ''}',@name = '${user.name || ''}',@role= '${user.role || ''}'
          // `
          // );
        } else {
          return this._EquipmentOilCompatibilityEntity.find({
            where: [
              // name && surname && nick && email
              {
                id: equipmentOilCompatibility.id || Like('%' + '%'),
                userId: equipmentOilCompatibility.userId || Like('%' + '%'),
                status: Not(false),
              },
            ],
          });
        }
      })
      .then((result: EquipmentOilCompatibilityEntity[]) => {
        if (!result) throw 'ERROR AL CONSULTAR LOS aceites compatibles con el equipo.';

        // No lo validamos por que puede llegar vacio.
        return result;
      });
  }

  // Registra un nuevo grupo de aceite
  async Create(equipmentOilCompatibility: EquipmentOilCompatibilityEntity): Promise<EquipmentOilCompatibilityEntity> {
    // Hacemos where por todos los campos de la entidad
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          // Buscamos el viaje
          return this._EquipmentOilCompatibilityEntity.query(
            "SP_CheckTheLastRecordedTrip @userId='" + equipmentOilCompatibility.userId + "', @year='",
          );
        } else {
          // No lo validamos por que puede llegar vacio.
          return this._EquipmentOilCompatibilityEntity.save(equipmentOilCompatibility);
        }
      })
      .then((resultSave: any) => {
        if (!resultSave) throw new Error('No se puedo registrar el aceite compatible.');

        if (URL_Server.bd === 'MSSQL') {
          // MSSQL
          if (resultSave.length == 0) throw new Error('No se puedo registrar el aceite compatible.');
          return resultSave[0];
        } else {
          // SLQITE
          return resultSave;
        }
      });
  }

  // Guarda una lista de aceite.
  async SaveList(
    MappingOils: Mapping[],
    MappingEquipmentSystems: Mapping[],
    equipmentOilCompatibilitys: EquipmentOilCompatibilityEntity[],
  ): Promise<Mapping[]> {
    let MappingConsumptionsEquipment: Mapping[] = [];
    // FIltramos los datos que faltan aggregar y actualizar.
    const addEquipmentOilCompatibilitys = equipmentOilCompatibilitys.filter(
      (equipmentOilCompatibility: EquipmentOilCompatibilityEntity) => equipmentOilCompatibility.SyncStatus == 'added',
    );
    const updateEquipmentOilCompatibilitys = equipmentOilCompatibilitys.filter(
      (equipmentOilCompatibility: EquipmentOilCompatibilityEntity) => equipmentOilCompatibility.SyncStatus == 'updated',
    );
    const deleteEquipmentOilCompatibilitys = equipmentOilCompatibilitys.filter(
      (equipmentOilCompatibility: EquipmentOilCompatibilityEntity) => equipmentOilCompatibility.SyncStatus == 'deleted',
    );

    let listDeConsumosRegistrados = [];

    for await (const addEquipmentOilCompatibility of addEquipmentOilCompatibilitys) {
      let searchMappingOils = searchKey(MappingOils, addEquipmentOilCompatibility.entityOilId);
      let searchMappingEquipmentSystems = searchKey(MappingEquipmentSystems, addEquipmentOilCompatibility.entityEquipmentId);

      // Armamos al nuevo tipo de aceite
      let newEquipmentOilCompatibilityEntity = new EquipmentOilCompatibilityEntity();

      delete newEquipmentOilCompatibilityEntity.id;

      newEquipmentOilCompatibilityEntity.userId = addEquipmentOilCompatibility.userId;

      newEquipmentOilCompatibilityEntity.entityOilId = addEquipmentOilCompatibility.entityOilId;
      if (searchMappingOils) {
        newEquipmentOilCompatibilityEntity.entityOilId = searchMappingOils.value;
      }

      newEquipmentOilCompatibilityEntity.entityEquipmentId = addEquipmentOilCompatibility.entityEquipmentId;
      if (searchMappingEquipmentSystems) {
        newEquipmentOilCompatibilityEntity.entityEquipmentId = searchMappingEquipmentSystems.value;
      }

      // AQUI VALIDAR MI SOBRE CONSUMO
      // SendMailHTMLLubricante  976873362

      // Auditoria.
      newEquipmentOilCompatibilityEntity.userIdCreated = addEquipmentOilCompatibility.userIdCreated;
      newEquipmentOilCompatibilityEntity.dateCreated = GetDate();
      delete newEquipmentOilCompatibilityEntity.userIdUpdated;
      delete newEquipmentOilCompatibilityEntity.dateUpdated;
      newEquipmentOilCompatibilityEntity.status = Boolean(addEquipmentOilCompatibility.status);

      // Registramos grupo de aceite
      let registeredConsumptionEquipmentEntity = await this.Create(newEquipmentOilCompatibilityEntity);

      // Lo agregamos al mapping
      MappingConsumptionsEquipment.push(new Mapping(addEquipmentOilCompatibility.id, registeredConsumptionEquipmentEntity.id));
    }

    for await (const updateEquipmentOilCompatibility of updateEquipmentOilCompatibilitys) {
      let searchMappingOils = searchKey(MappingOils, updateEquipmentOilCompatibility.entityOilId);
      let searchMappingEquipmentSystems = searchKey(MappingEquipmentSystems, updateEquipmentOilCompatibility.entityEquipmentId);

      let equipmentOilCompatibility = new EquipmentOilCompatibilityEntity();

      equipmentOilCompatibility.id = updateEquipmentOilCompatibility.id;
      equipmentOilCompatibility.userId = updateEquipmentOilCompatibility.userId;

      equipmentOilCompatibility.entityOilId = updateEquipmentOilCompatibility.entityOilId;
      if (searchMappingOils) {
        equipmentOilCompatibility.entityOilId = searchMappingOils.value;
      }

      equipmentOilCompatibility.entityEquipmentId = updateEquipmentOilCompatibility.entityEquipmentId;
      if (searchMappingEquipmentSystems) {
        equipmentOilCompatibility.entityEquipmentId = searchMappingEquipmentSystems.value;
      }

      // Auditoria.
      equipmentOilCompatibility.userIdCreated = updateEquipmentOilCompatibility.userIdCreated;
      equipmentOilCompatibility.dateCreated = updateEquipmentOilCompatibility.dateCreated;
      equipmentOilCompatibility.userIdUpdated = updateEquipmentOilCompatibility.userIdUpdated;
      equipmentOilCompatibility.dateUpdated = updateEquipmentOilCompatibility.dateUpdated;
      equipmentOilCompatibility.status = Boolean(updateEquipmentOilCompatibility.status);

      // solo si esta activo guardaremos su Id para proximas evaluaciones
      if (equipmentOilCompatibility.status) {
        listDeConsumosRegistrados.push(equipmentOilCompatibility.id);
      }
      await this._EquipmentOilCompatibilityEntity.save(equipmentOilCompatibility);
    }

    for await (let deleteEquipmentOilCompatibility of deleteEquipmentOilCompatibilitys) {
      let searchMappingOils = searchKey(MappingOils, deleteEquipmentOilCompatibility.entityOilId);
      let searchMappingEquipmentSystems = searchKey(MappingEquipmentSystems, deleteEquipmentOilCompatibility.entityEquipmentId);

      let equipmentOilCompatibility = new EquipmentOilCompatibilityEntity();

      equipmentOilCompatibility.id = deleteEquipmentOilCompatibility.id;

      equipmentOilCompatibility.userId = deleteEquipmentOilCompatibility.userId;

      equipmentOilCompatibility.entityOilId = deleteEquipmentOilCompatibility.entityOilId;
      if (searchMappingOils) {
        equipmentOilCompatibility.entityOilId = searchMappingOils.value;
      }
      equipmentOilCompatibility.entityEquipmentId = deleteEquipmentOilCompatibility.entityEquipmentId;
      if (searchMappingEquipmentSystems) {
        equipmentOilCompatibility.entityEquipmentId = searchMappingEquipmentSystems.value;
      }

      // Auditoria.
      equipmentOilCompatibility.userIdCreated = deleteEquipmentOilCompatibility.userIdCreated;
      equipmentOilCompatibility.dateCreated = deleteEquipmentOilCompatibility.dateCreated;
      equipmentOilCompatibility.userIdUpdated = deleteEquipmentOilCompatibility.userIdUpdated;
      equipmentOilCompatibility.dateUpdated = deleteEquipmentOilCompatibility.dateUpdated;
      equipmentOilCompatibility.status = Boolean(deleteEquipmentOilCompatibility.status);

      await this._EquipmentOilCompatibilityEntity.save(equipmentOilCompatibility);
    }

    // AQUI VALIDAR MI SOBRE CONSUMO
    // SendMailHTMLLubricante  976873362

    return MappingConsumptionsEquipment;
  }
}
