import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { URL_Server } from '../../config/server.config';
import { DummyPromise } from '../../assets/promises.assets';
import { FormatDateSumDays, FormatDateUTCToDateHour, GetDate } from '../../assets/moment.assets';

import { SendMessageEntity } from '../../models/send-message.entity';
import { UserEntity } from '../../models/user.entity';

@Injectable()
export class SendMessageService {
  constructor(
    @InjectRepository(SendMessageEntity)
    private _sendMessageRepository: Repository<SendMessageEntity>,
  ) {}

  async test(): Promise<boolean> {
    // Hacemos where por todos los campos de la entidad
    return await false;
  }

  // Registra un nuevo viaje
  async Create(sendMessageEntity: SendMessageEntity): Promise<SendMessageEntity> {
    // Hacemos where por todos los campos de la entidad
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          // Buscamos el viaje
          return this._sendMessageRepository.query("SP_ @userId='" + sendMessageEntity.userId + "', @year='" + sendMessageEntity.emails + "'");
        } else {
          if (sendMessageEntity.id) {
            return this._sendMessageRepository.find({
              where: [
                // name && surname && nick && email
                {
                  userId: sendMessageEntity.userId,
                  emails: sendMessageEntity.emails,
                  status: true,
                },
              ],
              take: 1,
              order: {
                id: 'DESC',
              },
            });
          } else {
            return true;
          }
        }
      })
      .then((result: SendMessageEntity[]) => {
        // result length
        if (result) {
          if (URL_Server.bd === 'MSSQL') {
            // Ejecutamos el storeProceude creado.
            return this._sendMessageRepository.query(`
                            SP_ @userId =  ${sendMessageEntity.userId}  ,
                            @userIdCreated =   ${sendMessageEntity.userIdCreated} ,
                            @dateCreated = '${sendMessageEntity.dateCreated}',
                            @userIdUpdated =  ${sendMessageEntity.userIdUpdated ? sendMessageEntity.userIdUpdated : 0} ,
                            @dateUpdated = '${sendMessageEntity.dateUpdated || ''}' ,
                            @status = ${sendMessageEntity.status} 
                            `);
          } else {
            if (result.length > 0) {
              sendMessageEntity.id = result[0].id;
            }
            sendMessageEntity.status = Boolean(sendMessageEntity.status);
            // No lo validamos por que puede llegar vacio.
            return this._sendMessageRepository.save(sendMessageEntity);
          }
        }
      })
      .then((resultSave: any) => {
        // Validamos si encontro al usuario.

        if (!resultSave) throw new Error('No se pudo guardar la configuracion del mail.');

        if (URL_Server.bd === 'MSSQL') {
          // MSSQL
          if (resultSave.length == 0) throw new Error('No se puedo registrar la configuracion en la BD.');
          return resultSave[0];
        } else {
          // SLQITE
          return resultSave;
        }
      });
  }

  async BuscamosLaConfiracionDelBuque(sendMessageEntity: SendMessageEntity): Promise<SendMessageEntity> {
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          // Buscamos el viaje
          // return this._dailyReportRepository.query(` EXEC SP_CreateNewDailyReport @userId = ${dailyReport.userId} ,@portId = ${dailyReport.portId} ,@activityPerformed = '${dailyReport.activityPerformed}' ,@speedStraction = '${dailyReport.speedStraction}' ,@date ='${dailyReport.date}' ,@hour = '${dailyReport.hour}' ,@bunkeringIfo = ${dailyReport.bunkeringIfo} ,@bunkeringMgo = ${dailyReport.bunkeringMgo} ,@mplaIfo  = ${dailyReport.mplaIfo} ,@auxIfo  = ${dailyReport.auxIfo} ,@boilerIfo  = ${dailyReport.boilerIfo} ,@otherIfo = ${dailyReport.otherIfo} ,@mplaMgo = ${dailyReport.mplaMgo} ,@auxMgo   = ${dailyReport.auxMgo} ,@boilerMgo   = ${dailyReport.boilerMgo} ,@ppMgo = ${dailyReport.ppMgo} ,@giMgo = ${dailyReport.giMgo} ,@otherMgo  = ${dailyReport.otherMgo} ,@steamingTime  = ${dailyReport.steamingTime} ,@distance =${dailyReport.distance} ,@beaufour = '${dailyReport.beaufour}' ,@observation ='${dailyReport.observation}'  ,@userIdCreated = ${dailyReport.userIdCreated} ,@dateCreated = '${dailyReport.dateCreated}' ,@userIdUpdated = ${dailyReport.userIdUpdated || 0} ,@dateUpdated = '${dailyReport.dateUpdated || null}' ,@status = ${dailyReport.status}
          // ` );
        } else {
          return this._sendMessageRepository.find({
            where: [
              {
                userId: Number(sendMessageEntity.userId),
                status: Not(false),
              },
            ],
            order: {
              id: 'ASC',
            },
          });
        }
      })
      .then((resultFind: SendMessageEntity[]) => {
        // Validamos si encontro al usuario.
        if (!resultFind) throw new Error('does_not_exist');
        if (resultFind && resultFind.length > 0) {
          let resultSendMessage = resultFind[0];

          return resultSendMessage;
        } else {
          return new SendMessageEntity();
        }
      });
  }
}
