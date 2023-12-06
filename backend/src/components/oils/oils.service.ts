import { Injectable } from '@nestjs/common';
import { OilEntity } from '../../models/oil.entity';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from "typeorm";
import { Not } from "typeorm";

// Otras librerias. 
import * as bcrypt from 'bcrypt';
import { ROUNDS_BCRYPT } from '../../config/bcrypt.config';
import { URL_Server } from '../../config/server.config'

// Modelos.
import { UserEntity } from '../../models/user.entity';
import { DummyPromise } from '../../assets/promises.assets';
import { ConvertMMDDYYYToYYYYMMDD, GetDate } from '../../assets/moment.assets';

@Injectable()
export class OilsService {

    constructor(
        @InjectRepository(OilEntity)
        private _oilRepository: Repository<OilEntity>,
    ) { }

    // Retorna a un objeto por id.
    async Get(id: Number): Promise<OilEntity> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._oilRepository.query(`
                     EXEC SP_BuscarReportePorId 
                    @dailyReportId = ${id} 
                    `);

                } else {


                    return this._oilRepository.find({
                        where: [{
                            id: id,
                        }]
                    });
                }

            }
        ).then(
            (resultFind: OilEntity[]) => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('does_not_exist');
                if (resultFind && resultFind.length == 0) throw new Error('does_not_exist');


                let returnDailyReport = resultFind[0];
                // retornamos el objeto.
                return returnDailyReport;
            }
        );
    }

    async Gets(oilEntity: OilEntity): Promise<OilEntity[]> {

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

                    return this._oilRepository.find({
                        where: [
                            // name && surname && nick && email
                            {
                                id: (oilEntity.id || Like('%' + '%')),
                                name: Like('%' + (oilEntity.name || '') + '%'),
                                status: Not(false)
                            }
                        ]
                    });

                }


            }
        ).then(
            (result: OilEntity[]) => {

                if (!result) throw 'ERROR AL CONSULTAR LOS ACEITES.'

                // No lo validamos por que puede llegar vacio.
                return result;
            }
        )
    }


    async Create(oilEntity: OilEntity): Promise<OilEntity> {

        // buscamos si el nick o email ya esta en uso.
        return DummyPromise().then(
            result => {
 
            if (URL_Server.bd === 'MSSQL') {
                return /*this.userRepository.query(
                    `
                    EXEC SP_CreateNewUser
                    @nick ='${user.nick || ''}'
                    `
                );*/
            } else {
                return this._oilRepository.save(oilEntity);
            }

        }).then(
            (resultSave: any) => {


                if (!resultSave) throw new Error('No se puedo registrar el aceite en la BD.');

                if (URL_Server.bd === 'MSSQL') {
                    // MSSQL
                    if (resultSave.length == 0) throw new Error('No se puedo registrar el aceite en la BD.');
                    return resultSave[0];
                } else {
                    // SLQITE
                    return resultSave;
                }
            }
        );
    }


    // Actualiza un voyage
    async Update(oilEntity: OilEntity): Promise<OilEntity> {

        return DummyPromise().then
            (result => {
                return this.Get(oilEntity.id);
            }).then(resultFind => {

                // Validamos si encontro al SailingAnality.
                if (!resultFind) throw new Error('does_not_exist');
                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return null  /*this._dailyReportRepository.query(`
                    EXEC SP_UpdateDailyReport  
                        @id = ${dailyReport.userId} 
                        ,@userId = ${dailyReport.userId} 
                        ,@portId = ${dailyReport.portId} 
                        ,@activityPerformed = '${dailyReport.activityPerformed}' 
                        ,@speedStraction = '${dailyReport.speedStraction}' 
                        ,@date ='${dailyReport.date ? FormatDateUTCToDateHour(dailyReport.date) : ''}' 
                        ,@hour = '${dailyReport.hour}' 
                        ,@bunkeringIfo = ${dailyReport.bunkeringIfo} 
                        ,@bunkeringMgo = ${dailyReport.bunkeringMgo} 
                        ,@mplaIfo  = ${dailyReport.mplaIfo} 
                        ,@auxIfo  = ${dailyReport.auxIfo}
                        ,@boilerIfo  = ${dailyReport.boilerIfo} 
                        ,@otherIfo = ${dailyReport.otherIfo}
                        ,@mplaMgo = ${dailyReport.mplaMgo}
                        ,@auxMgo   = ${dailyReport.auxMgo}
                        ,@boilerMgo   = ${dailyReport.boilerMgo} 
                        ,@ppMgo = ${dailyReport.ppMgo} 
                        ,@giMgo = ${dailyReport.giMgo} 
                        ,@otherMgo  = ${dailyReport.otherMgo} 
                        ,@steamingTime  = ${dailyReport.steamingTime}
                        ,@distance =${dailyReport.distance}
                        ,@beaufour = '${dailyReport.beaufour}'
                        ,@observation ='${dailyReport.observation}' 
                        ,@userIdUpdated = ${dailyReport.userIdUpdated || 0}
                        ,@dateUpdated = '${dailyReport.dateUpdated || ''}'
                        ,@status = ${dailyReport.status}
                `);*/

                } else {
                    return this._oilRepository.update(oilEntity.id, oilEntity);

                }
                // Actualizamos

            }).then(resultUpdate => {

                if (!resultUpdate) throw new Error('ERROR_TYPEORM_UPDATE_PORT');
                if (URL_Server.bd === 'MSSQL') {

                    // if ( resultUpdate && resultUpdate.length == 0) throw new Error('ERROR_TYPEORM_UPDATE_PORT');
                }
                // Envio respuesta con el resultado recibido del ultimo paso
                return oilEntity;
            });
    }

    // Elimina a un voyage por id
    async Delete(oilEntity: OilEntity, usuarioDelete: number): Promise<OilEntity> {
       
       let returnOilEntity:OilEntity;
        return DummyPromise().then(
            result => {
                return this.Get(oilEntity.id);
            }
        ).then(
            resultFind => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('does_not_exist');


                resultFind.userIdUpdated = usuarioDelete;
                resultFind.dateUpdated = GetDate();
                resultFind.status = false;

                returnOilEntity = resultFind; 
                // verificamos que el email no este en uso, recordemos que el email es unico.
                return this.Update(resultFind);
            }
        ).then(
            resultSave => {

                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_TYPEORM_UPDATE_PORT');

                return returnOilEntity;
            }
        )
    }
}
