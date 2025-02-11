import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping, searchKey } from '../../../assets/mappingKeys';
import { GetDate } from '../../../assets/moment.assets';
import { DummyPromise } from '../../../assets/promises.assets';
import { URL_Server } from '../../../config/server.config';
import { BunkerOil } from '../../../models/buker-oil.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class BunkerOilService {
  constructor(
    @InjectRepository(BunkerOil)
    private _BunkerOil: Repository<BunkerOil>,
  ) {}

  async Gets(groupOilEntity: BunkerOil): Promise<BunkerOil[]> {
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
          return this._BunkerOil.find({
            where: [
              // name && surname && nick && email
              {
                id: groupOilEntity.id || Like('%' + '%'),
                userId: groupOilEntity.userId || Like('%' + '%'),
                status: Not(false),
              },
            ],
          });
        }
      })
      .then((result: BunkerOil[]) => {
        if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.';

        // No lo validamos por que puede llegar vacio.
        return result;
      });
  }

  // Registra un nuevo grupo de aceite
  async Create(bunkerOil: BunkerOil): Promise<BunkerOil> {
    // Hacemos where por todos los campos de la entidad
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          // Buscamos el viaje
          return this._BunkerOil.query("SP_CheckTheLastRecordedTrip @userId='" + bunkerOil.userId + "', @year='");
        } else {
          // No lo validamos por que puede llegar vacio.
          return this._BunkerOil.save(bunkerOil);
        }
      })
      .then((resultSave: any) => {
        if (!resultSave) throw new Error('No se puedo registrar el Bunker del equipo.');

        if (URL_Server.bd === 'MSSQL') {
          // MSSQL
          if (resultSave.length == 0) throw new Error('No se puedo registrar el Bunker del equipo.');
          return resultSave[0];
        } else {
          // SLQITE
          return resultSave;
        }
      });
  }

  // guarda una lista de aceite.
  async SaveList(MappingOils: Mapping[], bunkerOilEntity: BunkerOil[]) {
    // FIltramos los datos que faltan aggregar y actualizar.
    const addBunkerOil = bunkerOilEntity.filter((bunkerOil: BunkerOil) => bunkerOil.SyncStatus == 'added');
    const updateBunkerOil = bunkerOilEntity.filter((bunkerOil: BunkerOil) => bunkerOil.SyncStatus == 'updated');
    const deleteBunkerOil = bunkerOilEntity.filter((bunkerOil: BunkerOil) => bunkerOil.SyncStatus == 'deleted');

    let MappingBunkerOil: Mapping[] = [];

    for await (const bunkerOil of addBunkerOil) {
      let searchMappingOils = searchKey(MappingOils, bunkerOil.entityOilId);

      // Armamos al nuevo tipo de aceite
      let newBunkerOil = new BunkerOil();

      delete newBunkerOil.id;
      newBunkerOil.userId = bunkerOil.userId;
      newBunkerOil.entityOilId = bunkerOil.entityOilId;
      if (searchMappingOils) {
        newBunkerOil.entityOilId = searchMappingOils.value;
      }
      newBunkerOil.bunker = bunkerOil.bunker || 0;
      newBunkerOil.comment = bunkerOil.comment;
      newBunkerOil.datetime = bunkerOil.datetime;

      // Auditoria.
      newBunkerOil.userIdCreated = bunkerOil.userIdCreated;
      newBunkerOil.dateCreated = GetDate();
      delete newBunkerOil.userIdUpdated;
      delete newBunkerOil.dateUpdated;
      newBunkerOil.status = Boolean(bunkerOil.status);

      // Registramos grupo de aceite
      let registeredBunkerOil = await this.Create(newBunkerOil);

      // Lo agregamos al mapping
      MappingBunkerOil.push(new Mapping(bunkerOil.id, registeredBunkerOil.id));
    }

    for await (const bunkerOil of updateBunkerOil) {
      let searchMappingOils = searchKey(MappingOils, bunkerOil.entityOilId);

      // Armamos al nuevo tipo de aceite
      let newBunkerOil = new BunkerOil();

      newBunkerOil.id = bunkerOil.id;
      newBunkerOil.userId = bunkerOil.userId;
      newBunkerOil.entityOilId = bunkerOil.entityOilId;
      if (searchMappingOils) {
        newBunkerOil.entityOilId = searchMappingOils.value;
      }
      newBunkerOil.bunker = bunkerOil.bunker || 0;
      newBunkerOil.comment = bunkerOil.comment;
      newBunkerOil.datetime = bunkerOil.datetime;

      // Auditoria.
      newBunkerOil.userIdCreated = bunkerOil.userIdCreated;
      newBunkerOil.dateCreated = bunkerOil.dateCreated;
      newBunkerOil.userIdUpdated = bunkerOil.userIdUpdated;
      newBunkerOil.dateUpdated = bunkerOil.dateUpdated;
      newBunkerOil.status = Boolean(bunkerOil.status);

      await this._BunkerOil.save(newBunkerOil);
    }

    for await (let bunkerOil of deleteBunkerOil) {
      let searchMappingOils = searchKey(MappingOils, bunkerOil.entityOilId);

      // Armamos al nuevo tipo de aceite
      let newBunkerOil = new BunkerOil();

      newBunkerOil.id = bunkerOil.id;
      newBunkerOil.userId = bunkerOil.userId;
      newBunkerOil.entityOilId = bunkerOil.entityOilId;
      if (searchMappingOils) {
        newBunkerOil.entityOilId = searchMappingOils.value;
      }
      newBunkerOil.bunker = bunkerOil.bunker || 0;
      newBunkerOil.comment = bunkerOil.comment;
      newBunkerOil.datetime = bunkerOil.datetime;

      // Auditoria.
      newBunkerOil.userIdCreated = bunkerOil.userIdCreated;
      newBunkerOil.dateCreated = bunkerOil.dateCreated;
      newBunkerOil.userIdUpdated = bunkerOil.userIdUpdated;
      newBunkerOil.dateUpdated = bunkerOil.dateUpdated;
      newBunkerOil.status = Boolean(bunkerOil.status);

      await this._BunkerOil.save(bunkerOil);
    }

    return MappingBunkerOil;
  }
}
