import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { URL_Server } from '../../config/server.config';
import { DummyPromise } from '../../assets/promises.assets';
import { FormatDateSumDays, FormatDateUTCToDateHour, GetDate } from '../../assets/moment.assets';



import { SendMessageEntity } from 'src/models/send-message.entity';
import { UserEntity } from 'src/models/user.entity';

@Injectable()
export class SendMessageService {
    constructor(
        @InjectRepository(SendMessageEntity)
        private _sendMessageRepository: Repository<SendMessageEntity>,
    ) { }


    async test(): Promise<boolean> {

        // Hacemos where por todos los campos de la entidad
        return await false;

    }


    async BuscamosLaConfiracionDelBuque(sendMessageEntity: SendMessageEntity): Promise<SendMessageEntity> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    // return this._dailyReportRepository.query(` EXEC SP_CreateNewDailyReport @userId = ${dailyReport.userId} ,@portId = ${dailyReport.portId} ,@activityPerformed = '${dailyReport.activityPerformed}' ,@speedStraction = '${dailyReport.speedStraction}' ,@date ='${dailyReport.date}' ,@hour = '${dailyReport.hour}' ,@bunkeringIfo = ${dailyReport.bunkeringIfo} ,@bunkeringMgo = ${dailyReport.bunkeringMgo} ,@mplaIfo  = ${dailyReport.mplaIfo} ,@auxIfo  = ${dailyReport.auxIfo} ,@boilerIfo  = ${dailyReport.boilerIfo} ,@otherIfo = ${dailyReport.otherIfo} ,@mplaMgo = ${dailyReport.mplaMgo} ,@auxMgo   = ${dailyReport.auxMgo} ,@boilerMgo   = ${dailyReport.boilerMgo} ,@ppMgo = ${dailyReport.ppMgo} ,@giMgo = ${dailyReport.giMgo} ,@otherMgo  = ${dailyReport.otherMgo} ,@steamingTime  = ${dailyReport.steamingTime} ,@distance =${dailyReport.distance} ,@beaufour = '${dailyReport.beaufour}' ,@observation ='${dailyReport.observation}'  ,@userIdCreated = ${dailyReport.userIdCreated} ,@dateCreated = '${dailyReport.dateCreated}' ,@userIdUpdated = ${dailyReport.userIdUpdated || 0} ,@dateUpdated = '${dailyReport.dateUpdated || null}' ,@status = ${dailyReport.status}
                    // ` );
                } else {

                    return this._sendMessageRepository.find({
                        where: [{
                            userId: sendMessageEntity.id,
                            status: Not(false)
                        }]
                    });

                }
            }
        ).then(
            (resultFind: SendMessageEntity[]) => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('does_not_exist');
                if (resultFind && resultFind.length > 0) 
                
                {

                    let resultSendMessage = resultFind[0];

                    return resultSendMessage
                }

                return <any>{};
            });

    }
}
