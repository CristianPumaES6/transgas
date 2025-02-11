import { Injectable } from '@nestjs/common';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from 'typeorm';
import { Not } from 'typeorm';

// Otras librerias.
import * as bcrypt from 'bcrypt';
import { ROUNDS_BCRYPT } from '../../config/bcrypt.config';
import { URL_Server } from '../../config/server.config';

// Modelos.
import { UserEntity } from '../../models/user.entity';
import { DummyPromise } from '../../assets/promises.assets';
import { ConvertMMDDYYYToYYYYMMDD, GetDate } from '../../assets/moment.assets';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async Get(id: number): Promise<UserEntity> {
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(`SP_BuscarUsuarioPorId @userId= ${id}`);
        } else {
          return this.userRepository.find({
            where: {
              id: id,
              status: Not(false),
            },
          });
        }
      })
      .then(resultFind => {
        if (!resultFind || resultFind.length == 0) throw 'NO_REGISTER';

        let usuario: UserEntity = resultFind[0];

        // Vaciamos el campo del password.
        usuario.password = null;
        // retornamos el objeto.
        return usuario;
      });
  }

  async Gets(user: UserEntity): Promise<UserEntity[]> {
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(
            `EXEC SP_BuscarUsuariosByFilter @userId =0,@nick = '${user.nick || ''}',@name = '${user.name || ''}',@role= '${user.role || ''}'
                    `,
          );
        } else {
          return this.userRepository.find({
            where: [
              // name && surname && nick && email
              {
                id: user.id || Like('%' + '%'),
                nick: Like('%' + (user.nick || '') + '%'),
                name: Like('%' + (user.name || '') + '%'),
                role: Like('%' + (user.role || '') + '%'),
                status: Not(false),
              },
            ],
          });
        }
      })
      .then((result: UserEntity[]) => {
        if (!result) throw 'ERROR AL CONSULTAR USUARIO.';
        // Recorremos y borramos el password.
        result.forEach(user => {
          // delete user.password;
          user.password = '';
        });

        // No lo validamos por que puede llegar vacio.
        return result;
      });
  }

  async CreateUserNickUnique(user: UserEntity): Promise<UserEntity> {
    // buscamos si el nick o email ya esta en uso.
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(`
                    EXEC SP_GETEmailEstaEnUso @userId = 0, @nick = '${user.nick || ''}' 
                    `);
        } else {
          return this.userRepository.find({
            where: [
              // hacemos un where donde buscamos por nick o email.
              {
                nick: user.nick,
                status: Not(false),
              },
            ],
          });
        }
      })
      .then(resultFind => {
        if (resultFind && resultFind.length > 0) throw 'REPEAT_NICK';

        // encriptamos el password.
        return bcrypt.hash(user.password, ROUNDS_BCRYPT);
      })
      .then(password => {
        // le asignamos el password encriptado al objeto
        user.password = password;

        // Eliminamos el user id
        delete user.id;
        user.years = JSON.stringify(user.years);
        // procedemos hacer el save.

        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(
            `
                    EXEC SP_CreateNewUser
                    @nick ='${user.nick || ''}'
                    ,@name ='${user.name || ''}'
                    ,@filename ='${user.filename || ''}'
                    ,@password ='${user.password || ''}'
                    ,@language ='${user.language || ''}'
                    ,@role ='${user.role || ''}'
                    ,@years  ='${user.years || '[]'}'
                    ,@minSpeed  = ${user.minSpeed || 0}
                    ,@maxSpeed  = ${user.maxSpeed || 0}
                    ,@isConsumptionIFO  = ${user.isConsumptionIFO || 0}
                    ,@isConsumptionLSFO = ${user.isConsumptionLSFO || 0}
                    ,@isConsumptionVLSFO  = ${user.isConsumptionVLSFO || 0}
                    ,@isConsumptionMGO   = ${user.isConsumptionMGO || 0}
                    ,@maxIFOConsumption   = ${user.maxIFOConsumption || 0}
                    ,@maxMGOConsumption   = ${user.maxMGOConsumption || 0}
                    ,@minIFOConsumption   = ${user.minIFOConsumption || 0}
                    ,@minMGOConsumption   = ${user.minMGOConsumption || 0}
                    ,@isMEMGO   = ${user.isMEMGO || 0}
                    ,@isAEMGO   = ${user.isAEMGO || 0}
                    ,@isBoilerMGO   = ${user.isBoilerMGO || 0}
                    ,@isIGMGO   = ${user.isIGMGO || 0}
                    ,@isPowerPMGO   = ${user.isPowerPMGO || 0}
                    ,@isOtherMGO   = ${user.isOtherMGO || 0}
                    ,@isMEIFO   = ${user.isMEIFO || 0}
                    ,@isAEIFO   = ${user.isAEIFO || 0}
                    ,@isBoilerIFO   = ${user.isBoilerIFO || 0}
                    ,@isOtherIFO   = ${user.isOtherIFO || 0}
                    ,@contractSpeedSailingBallastMGO   = ${user.contractSpeedSailingBallastMGO || 0}
                    ,@contractSpeedSailingLadenMGO   = ${user.contractSpeedSailingLadenMGO || 0}
                    ,@contractSpeedSailingEconomicalMGO   = ${user.contractSpeedSailingEconomicalMGO || 0}
                    ,@loadingConsumptionMGO   = ${user.loadingConsumptionMGO || 0}
                    ,@dischargeConsumptionMGO   = ${user.dischargeConsumptionMGO || 0}
                    ,@sailingBallastConsumptionMGO   = ${user.sailingBallastConsumptionMGO || 0}
                    ,@sailingLoadConsumptionMGO   = ${user.sailingLoadConsumptionMGO || 0}
                    ,@sailingEconomicConsumptionMGO   = ${user.sailingEconomicConsumptionMGO || 0}
                    ,@anchoredConsumptionMGO   = ${user.anchoredConsumptionMGO || 0}
                    ,@maneuverConsumptionMGO   = ${user.maneuverConsumptionMGO || 0}
                    ,@otherConsumptionMGO   = ${user.otherConsumptionMGO || 0}
                    ,@contractSpeedSailingBallastIFO   = ${user.contractSpeedSailingBallastIFO || 0}
                    ,@contractSpeedSailingLadenIFO   = ${user.contractSpeedSailingLadenIFO || 0}
                    ,@contractSpeedSailingEconomicalIFO   = ${user.contractSpeedSailingEconomicalIFO || 0}
                    ,@loadingConsumptionIFO   = ${user.loadingConsumptionIFO || 0}
                    ,@dischargeConsumptionIFO   = ${user.dischargeConsumptionIFO || 0}
                    ,@sailingBallastConsumptionIFO   = ${user.sailingBallastConsumptionIFO || 0}
                    ,@sailingLoadConsumptionIFO   = ${user.sailingLoadConsumptionIFO || 0}
                    ,@sailingEconomicConsumptionIFO   = ${user.sailingEconomicConsumptionIFO || 0}
                    ,@anchoredConsumptionIFO   = ${user.anchoredConsumptionIFO || 0}
                    ,@maneuverConsumptionIFO   = ${user.maneuverConsumptionIFO || 0}
                    ,@otherConsumptionIFO   = ${user.otherConsumptionIFO || 0}
                    ,@isDisplayLSFOConsumption   = ${user.isDisplayLSFOConsumption || 0}
                    ,@isDisplayMGOConsumption   = ${user.isDisplayMGOConsumption || 0}
                    ,@isDisplayAverageSpeed   = ${user.isDisplayAverageSpeed || 0}
                    ,@isDisplayDataMGO   = ${user.isDisplayDataMGO || 0}
                    ,@isDisplayDataLSFO   = ${user.isDisplayDataLSFO || 0}
                    ,@isDisplayVesselPerformanceLSFO   = ${user.isDisplayVesselPerformanceLSFO || 0}
                    ,@isDisplayVesselPerformanceMGO   = ${user.isDisplayVesselPerformanceMGO || 0}
                    ,@consumptionEquipmentME_MGO   = ${user.consumptionEquipmentME_MGO || 0}
                    ,@consumptionEquipmentAE_MGO   = ${user.consumptionEquipmentAE_MGO || 0}
                    ,@consumptionEquipmentBOILER_MGO   = ${user.consumptionEquipmentBOILER_MGO || 0}
                    ,@consumptionEquipmentIG_MGO   = ${user.consumptionEquipmentIG_MGO || 0}
                    ,@consumptionEquipmentPP_MGO   = ${user.consumptionEquipmentPP_MGO || 0}
                    ,@consumptionEquipmentOther_MGO   = ${user.consumptionEquipmentOther_MGO || 0}
                    ,@consumptionEquipmentME_IFO   = ${user.consumptionEquipmentME_IFO || 0}
                    ,@consumptionEquipmentAE_IFO   = ${user.consumptionEquipmentAE_IFO || 0}
                    ,@consumptionEquipmentBOILER_IFO   = ${user.consumptionEquipmentBOILER_IFO || 0}
                    ,@consumptionEquipmentOther_IFO   = ${user.consumptionEquipmentOther_IFO || 0}
                    ,@userIdCreated   = ${user.userIdCreated || 0}
                    ,@dateCreated   = '${user.dateCreated || ''}'
                    ,@userIdUpdated   = ${user.userIdUpdated || 0}
                    ,@dateUpdated   = '${user.dateUpdated || ''}'
                    ,@status   = ${user.status || 0}
                    `,
          );
        } else {
          return this.userRepository.save(user);
        }
      })
      .then((resultSave: any) => {
        if (!resultSave) throw new Error('No se puedo registrar el viaje en la BD.');

        if (URL_Server.bd === 'MSSQL') {
          // MSSQL
          if (resultSave.length == 0) throw new Error('No se puedo registrar el viaje en la BD.');
          return resultSave[0];
        } else {
          // SLQITE
          return resultSave;
        }
      });
  }

  // Actualiza un usuario
  async UpdateUserNickUnique(user: UserEntity): Promise<UserEntity> {
    // Contrasela antigua
    let contraseniaOld = '';

    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(
            `
                        EXEC SP_BuscarUsuarioPorId
                        @userId ='${user.id || ''}'
                    `,
          );
        } else {
          // SLQITE
          return this.userRepository.find({
            where: [
              // hacemos un where donde buscamos por id.
              { id: user.id },
            ],
          });
        }
      })
      .then(resultFind => {
        // Validamos si encontro al usuario.
        if (!resultFind || resultFind.length == 0) throw new Error('user_does_not_exist');

        let userfind = resultFind[0];

        // Guardamos el password actual.
        contraseniaOld = userfind.password;

        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(`
                EXEC SP_GETEmailEstaEnUso @userId = ${user.id || 0}, @nick = '${user.nick || ''}' 
                `);
        } else {
          // verificamos que el email no este en uso, recordemos que el email es unico.
          return this.userRepository.find({
            where: [
              // hacemos un where donde buscamos por email y no sea del mismo id.
              {
                id: Not(user.id),
                nick: user.nick,
                status: Not(false),
              },
            ],
          });
        }
      })
      .then(result => {
        if (!result) throw 'REPEAT NICK ERROR:22323';
        if (result && result.length > 0) throw 'REPEAT_NICK';

        // Si existe el password lo encriptamos.
        if (user.password) {
          // encriptamos el password.
          return bcrypt.hash(user.password, ROUNDS_BCRYPT);
        } else {
          // retornamos la antigua contraseña.
          return contraseniaOld;
        }
      })
      .then((password: string) => {
        // Validamos el resultado.
        if (!password) throw new Error('Revisar User.service la funcion hash o el retun no, respondio como se esperaba.');

        // asignamos el password encriptado al objeto
        user.password = password;

        user.years = JSON.stringify(user.years);

        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(
            `
                                        
                    EXEC SP_UpdateUser
                    @id = '${user.id}'
                    ,@nick ='${user.nick || ''}'
                    ,@name ='${user.name || ''}'
                    ,@filename ='${user.filename || ''}'
                    ,@password ='${user.password || ''}'
                    ,@language ='${user.language || ''}'
                    ,@role ='${user.role || ''}'
                    ,@years  ='${user.years || '[]'}'
                    ,@minSpeed  = ${user.minSpeed || 0}
                    ,@maxSpeed  = ${user.maxSpeed || 0}
                    ,@isConsumptionIFO  = ${user.isConsumptionIFO || 0}
                    ,@isConsumptionLSFO = ${user.isConsumptionLSFO || 0}
                    ,@isConsumptionVLSFO  = ${user.isConsumptionVLSFO || 0}
                    ,@isConsumptionMGO   = ${user.isConsumptionMGO || 0}
                    ,@maxIFOConsumption   = ${user.maxIFOConsumption || 0}
                    ,@maxMGOConsumption   = ${user.maxMGOConsumption || 0}
                    ,@minIFOConsumption   = ${user.minIFOConsumption || 0}
                    ,@minMGOConsumption   = ${user.minMGOConsumption || 0}
                    ,@isMEMGO   = ${user.isMEMGO || 0}
                    ,@isAEMGO   = ${user.isAEMGO || 0}
                    ,@isBoilerMGO   = ${user.isBoilerMGO || 0}
                    ,@isIGMGO   = ${user.isIGMGO || 0}
                    ,@isPowerPMGO   = ${user.isPowerPMGO || 0}
                    ,@isOtherMGO   = ${user.isOtherMGO || 0}
                    ,@isMEIFO   = ${user.isMEIFO || 0}
                    ,@isAEIFO   = ${user.isAEIFO || 0}
                    ,@isBoilerIFO   = ${user.isBoilerIFO || 0}
                    ,@isOtherIFO   = ${user.isOtherIFO || 0}
                    ,@contractSpeedSailingBallastMGO   = ${user.contractSpeedSailingBallastMGO || 0}
                    ,@contractSpeedSailingLadenMGO   = ${user.contractSpeedSailingLadenMGO || 0}
                    ,@contractSpeedSailingEconomicalMGO   = ${user.contractSpeedSailingEconomicalMGO || 0}
                    ,@loadingConsumptionMGO   = ${user.loadingConsumptionMGO || 0}
                    ,@dischargeConsumptionMGO   = ${user.dischargeConsumptionMGO || 0}
                    ,@sailingBallastConsumptionMGO   = ${user.sailingBallastConsumptionMGO || 0}
                    ,@sailingLoadConsumptionMGO   = ${user.sailingLoadConsumptionMGO || 0}
                    ,@sailingEconomicConsumptionMGO   = ${user.sailingEconomicConsumptionMGO || 0}
                    ,@anchoredConsumptionMGO   = ${user.anchoredConsumptionMGO || 0}
                    ,@maneuverConsumptionMGO   = ${user.maneuverConsumptionMGO || 0}
                    ,@otherConsumptionMGO   = ${user.otherConsumptionMGO || 0}
                    ,@contractSpeedSailingBallastIFO   = ${user.contractSpeedSailingBallastIFO || 0}
                    ,@contractSpeedSailingLadenIFO   = ${user.contractSpeedSailingLadenIFO || 0}
                    ,@contractSpeedSailingEconomicalIFO   = ${user.contractSpeedSailingEconomicalIFO || 0}
                    ,@loadingConsumptionIFO   = ${user.loadingConsumptionIFO || 0}
                    ,@dischargeConsumptionIFO   = ${user.dischargeConsumptionIFO || 0}
                    ,@sailingBallastConsumptionIFO   = ${user.sailingBallastConsumptionIFO || 0}
                    ,@sailingLoadConsumptionIFO   = ${user.sailingLoadConsumptionIFO || 0}
                    ,@sailingEconomicConsumptionIFO   = ${user.sailingEconomicConsumptionIFO || 0}
                    ,@anchoredConsumptionIFO   = ${user.anchoredConsumptionIFO || 0}
                    ,@maneuverConsumptionIFO   = ${user.maneuverConsumptionIFO || 0}
                    ,@otherConsumptionIFO   = ${user.otherConsumptionIFO || 0}
                    ,@isDisplayLSFOConsumption   = ${user.isDisplayLSFOConsumption || 0}
                    ,@isDisplayMGOConsumption   = ${user.isDisplayMGOConsumption || 0}
                    ,@isDisplayAverageSpeed   = ${user.isDisplayAverageSpeed || 0}
                    ,@isDisplayDataMGO   = ${user.isDisplayDataMGO || 0}
                    ,@isDisplayDataLSFO   = ${user.isDisplayDataLSFO || 0}
                    ,@isDisplayVesselPerformanceLSFO   = ${user.isDisplayVesselPerformanceLSFO || 0}
                    ,@isDisplayVesselPerformanceMGO   = ${user.isDisplayVesselPerformanceMGO || 0}
                    ,@consumptionEquipmentME_MGO   = ${user.consumptionEquipmentME_MGO || 0}
                    ,@consumptionEquipmentAE_MGO   = ${user.consumptionEquipmentAE_MGO || 0}
                    ,@consumptionEquipmentBOILER_MGO   = ${user.consumptionEquipmentBOILER_MGO || 0}
                    ,@consumptionEquipmentIG_MGO   = ${user.consumptionEquipmentIG_MGO || 0}
                    ,@consumptionEquipmentPP_MGO   = ${user.consumptionEquipmentPP_MGO || 0}
                    ,@consumptionEquipmentOther_MGO   = ${user.consumptionEquipmentOther_MGO || 0}
                    ,@consumptionEquipmentME_IFO   = ${user.consumptionEquipmentME_IFO || 0}
                    ,@consumptionEquipmentAE_IFO   = ${user.consumptionEquipmentAE_IFO || 0}
                    ,@consumptionEquipmentBOILER_IFO   = ${user.consumptionEquipmentBOILER_IFO || 0}
                    ,@consumptionEquipmentOther_IFO   = ${user.consumptionEquipmentOther_IFO || 0}
                    ,@userIdUpdated   = ${user.userIdUpdated || 0}
                    ,@dateUpdated   = '${user.dateUpdated || ''}'
                    ,@status   = ${user.status || 0}

`,
          );
        } else {
          // Actualizamos
          return this.userRepository.update(user.id, user);
        }
      })
      .then(resultUpdate => {
        if (URL_Server.bd === 'MSSQL') {
          if (!resultUpdate || !resultUpdate.length) throw new Error('userRepository.update no respondio como esperabamos.');
        } else {
          if (!resultUpdate) throw new Error('userRepository.update no respondio como esperabamos.');
        }
        // borramos el password por seguridad.
        // delete user.password;
        user.password = '';

        // Envio respuesta con el resultado recibido del ultimo paso
        return user;
      });
  }

  // Elimina a un usuario por id
  async Delete(userId: number, deleteUserId: number): Promise<UserEntity> {
    let user: UserEntity = new UserEntity();
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(`SP_BuscarUsuarioPorId @userId= ${userId}`);
        } else {
          // Eliminamos de la base de dato al usuario.
          return this.userRepository.find({
            where: [
              // hacemos un where donde buscamos por id.
              { id: userId },
            ],
          });
        }
      })
      .then(resultFind => {
        if (!resultFind || resultFind.length == 0) throw new Error('user_does_not_exist');

        // Seteamos al usuario.
        user = resultFind[0];
        // Desactivamos el estado.
        user.status = false;
        user.userIdUpdated = deleteUserId;
        user.dateUpdated = GetDate();

        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(
            `

                EXEC SP_UpdateUser
                @id = '${user.id}'
                ,@nick ='${user.nick || ''}'
                ,@name ='${user.name || ''}'
                ,@filename ='${user.filename || ''}'
                ,@password ='${user.password || ''}'
                ,@language ='${user.language || ''}'
                ,@role ='${user.role || ''}'
                ,@years  ='[]'
                ,@minSpeed  = ${user.minSpeed || 0}
                ,@maxSpeed  = ${user.maxSpeed || 0}
                ,@isConsumptionIFO  = ${user.isConsumptionIFO || 0}
                ,@isConsumptionLSFO = ${user.isConsumptionLSFO || 0}
                ,@isConsumptionVLSFO  = ${user.isConsumptionVLSFO || 0}
                ,@isConsumptionMGO   = ${user.isConsumptionMGO || 0}
                ,@maxIFOConsumption   = ${user.maxIFOConsumption || 0}
                ,@maxMGOConsumption   = ${user.maxMGOConsumption || 0}
                ,@minIFOConsumption   = ${user.minIFOConsumption || 0}
                ,@minMGOConsumption   = ${user.minMGOConsumption || 0}
                ,@isMEMGO   = ${user.isMEMGO || 0}
                ,@isAEMGO   = ${user.isAEMGO || 0}
                ,@isBoilerMGO   = ${user.isBoilerMGO || 0}
                ,@isIGMGO   = ${user.isIGMGO || 0}
                ,@isPowerPMGO   = ${user.isPowerPMGO || 0}
                ,@isOtherMGO   = ${user.isOtherMGO || 0}
                ,@isMEIFO   = ${user.isMEIFO || 0}
                ,@isAEIFO   = ${user.isAEIFO || 0}
                ,@isBoilerIFO   = ${user.isBoilerIFO || 0}
                ,@isOtherIFO   = ${user.isOtherIFO || 0}
                ,@contractSpeedSailingBallastMGO   = ${user.contractSpeedSailingBallastMGO || 0}
                ,@contractSpeedSailingLadenMGO   = ${user.contractSpeedSailingLadenMGO || 0}
                ,@contractSpeedSailingEconomicalMGO   = ${user.contractSpeedSailingEconomicalMGO || 0}
                ,@loadingConsumptionMGO   = ${user.loadingConsumptionMGO || 0}
                ,@dischargeConsumptionMGO   = ${user.dischargeConsumptionMGO || 0}
                ,@sailingBallastConsumptionMGO   = ${user.sailingBallastConsumptionMGO || 0}
                ,@sailingLoadConsumptionMGO   = ${user.sailingLoadConsumptionMGO || 0}
                ,@sailingEconomicConsumptionMGO   = ${user.sailingEconomicConsumptionMGO || 0}
                ,@anchoredConsumptionMGO   = ${user.anchoredConsumptionMGO || 0}
                ,@maneuverConsumptionMGO   = ${user.maneuverConsumptionMGO || 0}
                ,@otherConsumptionMGO   = ${user.otherConsumptionMGO || 0}
                ,@contractSpeedSailingBallastIFO   = ${user.contractSpeedSailingBallastIFO || 0}
                ,@contractSpeedSailingLadenIFO   = ${user.contractSpeedSailingLadenIFO || 0}
                ,@contractSpeedSailingEconomicalIFO   = ${user.contractSpeedSailingEconomicalIFO || 0}
                ,@loadingConsumptionIFO   = ${user.loadingConsumptionIFO || 0}
                ,@dischargeConsumptionIFO   = ${user.dischargeConsumptionIFO || 0}
                ,@sailingBallastConsumptionIFO   = ${user.sailingBallastConsumptionIFO || 0}
                ,@sailingLoadConsumptionIFO   = ${user.sailingLoadConsumptionIFO || 0}
                ,@sailingEconomicConsumptionIFO   = ${user.sailingEconomicConsumptionIFO || 0}
                ,@anchoredConsumptionIFO   = ${user.anchoredConsumptionIFO || 0}
                ,@maneuverConsumptionIFO   = ${user.maneuverConsumptionIFO || 0}
                ,@otherConsumptionIFO   = ${user.otherConsumptionIFO || 0}
                ,@isDisplayLSFOConsumption   = ${user.isDisplayLSFOConsumption || 0}
                ,@isDisplayMGOConsumption   = ${user.isDisplayMGOConsumption || 0}
                ,@isDisplayAverageSpeed   = ${user.isDisplayAverageSpeed || 0}
                ,@isDisplayDataMGO   = ${user.isDisplayDataMGO || 0}
                ,@isDisplayDataLSFO   = ${user.isDisplayDataLSFO || 0}
                ,@isDisplayVesselPerformanceLSFO   = ${user.isDisplayVesselPerformanceLSFO || 0}
                ,@isDisplayVesselPerformanceMGO   = ${user.isDisplayVesselPerformanceMGO || 0}
                ,@consumptionEquipmentME_MGO   = ${user.consumptionEquipmentME_MGO || 0}
                ,@consumptionEquipmentAE_MGO   = ${user.consumptionEquipmentAE_MGO || 0}
                ,@consumptionEquipmentBOILER_MGO   = ${user.consumptionEquipmentBOILER_MGO || 0}
                ,@consumptionEquipmentIG_MGO   = ${user.consumptionEquipmentIG_MGO || 0}
                ,@consumptionEquipmentPP_MGO   = ${user.consumptionEquipmentPP_MGO || 0}
                ,@consumptionEquipmentOther_MGO   = ${user.consumptionEquipmentOther_MGO || 0}
                ,@consumptionEquipmentME_IFO   = ${user.consumptionEquipmentME_IFO || 0}
                ,@consumptionEquipmentAE_IFO   = ${user.consumptionEquipmentAE_IFO || 0}
                ,@consumptionEquipmentBOILER_IFO   = ${user.consumptionEquipmentBOILER_IFO || 0}
                ,@consumptionEquipmentOther_IFO   = ${user.consumptionEquipmentOther_IFO || 0}
                ,@userIdUpdated   = ${user.userIdUpdated || 0}
                ,@dateUpdated   = '${user.dateUpdated || ''}'
                ,@status   = ${user.status || 0}

                `,
          );
        } else {
          // Actualizamos
          return this.userRepository.update(user.id, user);
        }
      })
      .then(resultSave => {
        // Validamos si se actualizo correctamente.
        if (!resultSave) throw new Error('error_user_save');
        // Borramos el password.
        user.password = '';

        return user;
      });
  }

  async GetUserByNick(nick: string): Promise<UserEntity> {
    return await DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(`
                        EXEC SP_GetUserByNick
                            @nick = ${nick}
                    `);
          //
        } else {
          return this.userRepository.find({
            where: [
              // hacemos un where donde buscamos por email.
              { nick: nick, status: Not(false) },
            ],
          });
        }
      })
      .then((resultUser: any) => {
        if (!resultUser || (resultUser && !resultUser.length)) throw new Error('user_was_not_found');

        return resultUser[0];
      });
  }

  // Actualiza el filename del usuario ademas retorna el newfilename.
  async UpdateImageUser(id: number, newFilename: string): Promise<string> {
    let urlImage: string = URL_Server.back + '/' + newFilename;

    return await DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return this.userRepository.query(`
                        EXEC SP_UpdateImageUser @id = ${id} ,@urlImage = '${urlImage}'
                    `);
        } else {
          return this.userRepository.update(id, { filename: urlImage });
        }
      })
      .then(resultUpdate => {
        if (!resultUpdate) throw new Error('userRepository.update no respondio como esperabamos.');

        // Envio respuesta con el resultado recibido del ultimo paso
        return urlImage;
      });
  }
}
