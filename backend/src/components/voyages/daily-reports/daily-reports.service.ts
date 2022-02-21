import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyReport, GetInfoBunkering, GetInfoVoyageROBBunkering, GetReportVoyagePortDaily, GetROBByUser } from '../../../models/daily-report.entity';
import { Like, Not, Repository } from 'typeorm';
import { URL_Server } from 'src/config/server.config';
import { DummyPromise } from 'src/assets/promises.assets';
import { FormatDateUTCToDateHour, GetDate } from 'src/assets/moment.assets';

@Injectable()
export class DailyReportsService {
    constructor(
        @InjectRepository(DailyReport)
        private _dailyReportRepository: Repository<DailyReport>,
    ) { }

    // Registra un nuevo reporte diario
    async Create(dailyReport: DailyReport): Promise<DailyReport> {


        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._dailyReportRepository.query(` EXEC SP_CreateNewDailyReport @userId = ${dailyReport.userId} ,@portId = ${dailyReport.portId} ,@activityPerformed = '${dailyReport.activityPerformed}' ,@speedStraction = '${dailyReport.speedStraction}' ,@date ='${dailyReport.date}' ,@hour = '${dailyReport.hour}' ,@bunkeringIfo = ${dailyReport.bunkeringIfo} ,@bunkeringMgo = ${dailyReport.bunkeringMgo} ,@mplaIfo  = ${dailyReport.mplaIfo} ,@auxIfo  = ${dailyReport.auxIfo} ,@boilerIfo  = ${dailyReport.boilerIfo} ,@otherIfo = ${dailyReport.otherIfo} ,@mplaMgo = ${dailyReport.mplaMgo} ,@auxMgo   = ${dailyReport.auxMgo} ,@boilerMgo   = ${dailyReport.boilerMgo} ,@ppMgo = ${dailyReport.ppMgo} ,@giMgo = ${dailyReport.giMgo} ,@otherMgo  = ${dailyReport.otherMgo} ,@steamingTime  = ${dailyReport.steamingTime} ,@distance =${dailyReport.distance} ,@beaufour = '${dailyReport.beaufour}' ,@observation ='${dailyReport.observation}'  ,@userIdCreated = ${dailyReport.userIdCreated} ,@dateCreated = '${dailyReport.dateCreated}' ,@userIdUpdated = ${dailyReport.userIdUpdated || 0} ,@dateUpdated = '${dailyReport.dateUpdated || null}' ,@status = ${dailyReport.status}
                    `);

                } else {
                    return this._dailyReportRepository.save(dailyReport);
                }
            }
        ).then(
            (resultSave) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('No se puedo registrar el viaje en la BD.');

                if (URL_Server.bd === 'MSSQL') {
                    // MSSQL
                    if (resultSave.length == 0) throw new Error('No se puedo registrar el viaje en la BD.');
                    return resultSave[0];
                } else {
                    // SLQITE
                    return resultSave;
                }
            }
        ).catch(
            err => {
                throw err;
            }
        )

    }

    // Retorna a un objeto por id.
    async Get(id: Number): Promise<DailyReport> {

        return DummyPromise().then(
            result => {

                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._dailyReportRepository.query(`
                     EXEC SP_BuscarReportePorId 
                    @dailyReportId = ${id} 
                    `);

                } else {
                    return this._dailyReportRepository.find({
                        where: {
                            id: id,
                            status: Not(false)
                        }
                    });
                }

            }
        ).then(
            (resultFind: DailyReport[]) => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('does_not_exist');
                if (resultFind && resultFind.length == 0) throw new Error('does_not_exist');


                let returnDailyReport = resultFind[0];
                // retornamos el objeto.
                return returnDailyReport;
            }
        );
    }

    // Retorna todos los viajes segun filtro.
    async Gets(dailyReport: DailyReport): Promise<DailyReport[]> {

        // Hacemos where por todos los campos de la entidad
        return await this._dailyReportRepository.find({
            where: [
                // name && surname && nick && email
                {
                    userId: Like('%' + (dailyReport.userId || '') + '%'),
                    portId: Like('%' + dailyReport.portId + '%'),
                    status: Not(false)
                }
            ],
            order: {
                date: 'ASC',
                hour: 'ASC'
            },
        }).then(
            (result: DailyReport[]) => {

                // No lo validamos por que puede llegar vacio.

                return result;
            }
        )
    }

    // Actualiza un voyage
    async Update(dailyReport: DailyReport): Promise<DailyReport> {

        return DummyPromise().then
            (result => {
                return this.Get(dailyReport.id);
            }).then(resultFind => {

                // Validamos si encontro al SailingAnality.
                if (!resultFind) throw new Error('does_not_exist');
                if (URL_Server.bd === 'MSSQL') {
                    // Buscamos el viaje
                    return this._dailyReportRepository.query(`
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
                `);

                } else {
                    return this._dailyReportRepository.update(dailyReport.id, dailyReport);

                }
                // Actualizamos

            }).then(resultUpdate => {

                if (!resultUpdate) throw new Error('ERROR_TYPEORM_UPDATE_PORT');
                if (URL_Server.bd === 'MSSQL') {

                    // if ( resultUpdate && resultUpdate.length == 0) throw new Error('ERROR_TYPEORM_UPDATE_PORT');
                }
                // Envio respuesta con el resultado recibido del ultimo paso
                return dailyReport;
            });
    }

    // Elimina a un voyage por id
    async Delete(dailyReport: DailyReport, usuarioDelete: number): Promise<DailyReport> {
        return DummyPromise().then(
            result => {
                return this.Get(dailyReport.id);
            }
        ).then(resultFind => {
            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('does_not_exist');


            resultFind.userIdUpdated = usuarioDelete;
            resultFind.dateUpdated = GetDate();
            resultFind.status = false;
            // verificamos que el email no este en uso, recordemos que el email es unico.
            return this.Update(resultFind);
        }).then(
            resultSave => {

                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_TYPEORM_UPDATE_PORT');

                return dailyReport;
            }
        )
    }

    // QUERY PERSONALIZATE
    // Retorna todos los viajes segun filtro.
    async GetROBByUser(userId: number): Promise<GetROBByUser> {

        // Hacemos where por todos los campos de la entidad
        return await
            this._dailyReportRepository.createQueryBuilder('daily_report')

                .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
                .addSelect(' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ', 'total_mgo')
                .addSelect(' SUM( daily_report.bunkeringIfo )', "total_bunkering_ifo")
                .addSelect(' SUM( daily_report.bunkeringMgo )', "total_bunkering_mgo")

                .innerJoinAndSelect('daily_report.port', 'port')
                .innerJoinAndSelect('port.voyage', 'voyage')

                .where('daily_report.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })

                .andWhere('daily_report.userId = :userId', { userId: userId })

                .getRawOne()
                .then(
                    (result: any) => {

                        let getROBByUser: GetROBByUser = <GetROBByUser>{};

                        // Si no existen valores le doy cero por defecto. 
                        getROBByUser.total_ifo = result.total_ifo || 0;
                        getROBByUser.total_mgo = result.total_mgo || 0;
                        getROBByUser.total_bunkering_ifo = result.total_bunkering_ifo || 0;
                        getROBByUser.total_bunkering_mgo = result.total_bunkering_mgo || 0;

                        return getROBByUser;
                    }
                );
    }

    // Retorna todos los viajes segun filtro.
    async GetStartEndROByFilterDate(startDate: Date, endDate: Date, userId: number): Promise<GetROBByUser[]> {

        // Este arreglo contendra la info del rob del inicio del viaje y cuanto consumio en el rango de fecha.
        let StartEndROB: any[] = [];

        // Hacemos where por todos los campos de la entidad
        // Buscamos la info del rob asta antes del inicio de fecha
        return await this._dailyReportRepository.createQueryBuilder('daily_report')

            .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
            .addSelect(' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ', 'total_mgo')
            .addSelect(' SUM( daily_report.bunkeringIfo ) ', "total_bunkering_ifo")
            .addSelect(' SUM( daily_report.bunkeringMgo ) ', "total_bunkering_mgo")

            .innerJoinAndSelect('daily_report.port', 'port')
            .innerJoinAndSelect('port.voyage', 'voyage')

            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })

            .andWhere('daily_report.userId = :userId', { userId: userId })

            .andWhere('datetime(daily_report.date) < datetime(:startDate)', { startDate: startDate })

            .getRawOne()
            .then(
                (result: GetROBByUser) => {
                    // Verificamos que el resultado no este vacio.
                    if (!result) throw 'ERROR GetROBByUser';

                    let getStartROB = <GetROBByUser>{};

                    // Si no existen valores le doy cero por defecto. 
                    getStartROB.total_ifo = result.total_ifo || 0;
                    getStartROB.total_mgo = result.total_mgo || 0;
                    getStartROB.total_bunkering_ifo = result.total_bunkering_ifo || 0;
                    getStartROB.total_bunkering_mgo = result.total_bunkering_mgo || 0;

                    StartEndROB.push(getStartROB);

                    // Buscamos la info del rob consumido dentro del rango de fecha.
                    return this._dailyReportRepository.createQueryBuilder('daily_report')
                        .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
                        .addSelect(' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ', 'total_mgo')
                        .addSelect(' SUM( daily_report.bunkeringIfo )', "total_bunkering_ifo")
                        .addSelect(' SUM( daily_report.bunkeringMgo )', "total_bunkering_mgo")

                        .innerJoinAndSelect('daily_report.port', 'port')
                        .innerJoinAndSelect('port.voyage', 'voyage')

                        .where('daily_report.status = :status', { status: 1 })
                        .andWhere('port.status = :status', { status: 1 })
                        .andWhere('voyage.status = :status', { status: 1 })

                        .andWhere('daily_report.userId = :userId', { userId: userId })

                        .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
                        .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
                        .getRawOne();
                }
            ).then(
                (result: GetROBByUser) => {

                    if (!result) throw 'ERROR GetEndROBByUser';

                    let getEndROBByUser = <GetROBByUser>{};

                    // Si no existen valores le doy cero por defecto. 
                    getEndROBByUser.total_ifo = result.total_ifo || 0;
                    getEndROBByUser.total_mgo = result.total_mgo || 0;
                    getEndROBByUser.total_bunkering_ifo = result.total_bunkering_ifo || 0;
                    getEndROBByUser.total_bunkering_mgo = result.total_bunkering_mgo || 0;

                    StartEndROB.push(getEndROBByUser);

                    return StartEndROB;
                }
            );
    }

    // Retorna todos los viajes segun filtro.
    async GetBunkeringByUserIFO(userId: number): Promise<GetROBByUser> {

        // Hacemos where por todos los campos de la entidad
        return await
            this._dailyReportRepository.createQueryBuilder('daily_report')
                .select('daily_report.date', 'date')
                .addSelect('daily_report.hour', 'hour')
                .addSelect('daily_report.activityPerformed', 'activityPerformed')
                .addSelect('daily_report.bunkeringIfo', 'bunkeringIfo')

                .innerJoinAndSelect('daily_report.port', 'port')
                .innerJoinAndSelect('port.voyage', 'voyage')

                .where('daily_report.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })

                .andWhere('daily_report.userId = :userId', { userId: userId })
                .andWhere('daily_report.bunkeringIfo > 0', {})
                .orderBy('daily_report.date', 'DESC')
                .limit(5)
                .getRawMany()
                .then(
                    (result: any) => {

                        return result;
                    }
                );
    }

    // Retorna todos los viajes segun filtro.
    async GetBunkeringByUserMGO(userId: number): Promise<GetROBByUser> {

        // Hacemos where por todos los campos de la entidad
        return await
            this._dailyReportRepository.createQueryBuilder('daily_report')

                .select('daily_report.date', 'date')
                .addSelect('daily_report.hour', 'hour')
                .addSelect('daily_report.activityPerformed', 'activityPerformed')
                .addSelect('daily_report.bunkeringMgo', 'bunkeringMgo')

                .innerJoinAndSelect('daily_report.port', 'port')
                .innerJoinAndSelect('port.voyage', 'voyage')

                .where('daily_report.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })

                .andWhere('daily_report.userId = :userId', { userId: userId })
                .andWhere('daily_report.bunkeringMgo > 0', {})
                .orderBy('daily_report.date', 'DESC')
                .limit(5)
                .getRawMany()
                .then(
                    (result: any) => {

                        return result;
                    }
                );
    }


    // Retorna todos los viajes segun filtro.
    async GetReportVoyagePortDaily(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]> {

        // Hacemos where por todos los campos de la entidad
        return await
            this._dailyReportRepository.createQueryBuilder('daily_report')

                .select('voyage.userId', 'userId')
                .addSelect('voyage.year', 'year')
                .addSelect('voyage.id', 'voyageId')
                .addSelect('voyage.voyageNumber', 'voyageNumber')

                .addSelect('port.id', 'portId')
                .addSelect('port.portNumber', 'portNumber')
                .addSelect('port.departurePort', 'departurePort')
                .addSelect('port.arrivalPort', 'arrivalPort')


                .addSelect('daily_report.id', 'dailyReportId')
                .addSelect('daily_report.date', 'date')
                .addSelect('daily_report.hour', 'hour')
                .addSelect('daily_report.steamingTime', 'steamingTime')
                .addSelect('daily_report.activityPerformed', 'activityPerformed')
                .addSelect('daily_report.speedStraction', 'speedStraction')
                .addSelect('daily_report.observation', 'observation')

                .addSelect('daily_report.distance', 'distance')
                .addSelect('daily_report.beaufour', 'beaufour')

                .addSelect('daily_report.mplaIfo', 'mplaIfo')
                .addSelect('daily_report.auxIfo', 'auxIfo')
                .addSelect('daily_report.boilerIfo', 'boilerIfo')
                .addSelect('daily_report.otherIfo', 'otherIfo')
                .addSelect('daily_report.bunkeringIfo', 'bunkeringIfo')

                .addSelect('daily_report.mplaMgo', 'mplaMgo')
                .addSelect('daily_report.auxMgo', 'auxMgo')
                .addSelect('daily_report.boilerMgo', 'boilerMgo')
                .addSelect('daily_report.ppMgo', 'ppMgo')
                .addSelect('daily_report.giMgo', 'giMgo')
                .addSelect('daily_report.otherMgo', 'otherMgo')
                .addSelect('daily_report.bunkeringMgo', 'bunkeringMgo')


                .innerJoin('daily_report.port', 'port')
                .innerJoin('port.voyage', 'voyage')

                .where('daily_report.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })

                .andWhere('daily_report.userId = :userId', { userId: userId })

                .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
                .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
                .getRawMany()
                .then(
                    (result: any) => {
                        // Verificamos que el resultado no este vacio.
                        if (!result) throw 'ERROR GetReportVoyagePortDaily';

                        return result;
                    }
                );
    }

    // Retorna todos los viajes segun filtro.
    async GetReportByUser(userId: number): Promise<GetReportVoyagePortDaily[]> {

        // Hacemos where por todos los campos de la entidad
        return await
            this._dailyReportRepository.createQueryBuilder('daily_report')

                .select('voyage.userId', 'userId')
                .addSelect('voyage.year', 'year')
                .addSelect('voyage.id', 'voyageId')
                .addSelect('voyage.voyageNumber', 'voyageNumber')

                .addSelect('port.id', 'portId')
                .addSelect('port.portNumber', 'portNumber')
                .addSelect('port.departurePort', 'departurePort')
                .addSelect('port.arrivalPort', 'arrivalPort')


                .addSelect('daily_report.id', 'dailyReportId')
                .addSelect('daily_report.date', 'date')
                .addSelect('daily_report.hour', 'hour')
                .addSelect('daily_report.steamingTime', 'steamingTime')
                .addSelect('daily_report.activityPerformed', 'activityPerformed')
                .addSelect('daily_report.speedStraction', 'speedStraction')
                .addSelect('daily_report.observation', 'observation')

                .addSelect('daily_report.distance', 'distance')
                .addSelect('daily_report.beaufour', 'beaufour')

                .addSelect('daily_report.mplaIfo', 'mplaIfo')
                .addSelect('daily_report.auxIfo', 'auxIfo')
                .addSelect('daily_report.boilerIfo', 'boilerIfo')
                .addSelect('daily_report.otherIfo', 'otherIfo')
                .addSelect('daily_report.bunkeringIfo', 'bunkeringIfo')

                .addSelect('daily_report.mplaMgo', 'mplaMgo')
                .addSelect('daily_report.auxMgo', 'auxMgo')
                .addSelect('daily_report.boilerMgo', 'boilerMgo')
                .addSelect('daily_report.ppMgo', 'ppMgo')
                .addSelect('daily_report.giMgo', 'giMgo')
                .addSelect('daily_report.otherMgo', 'otherMgo')
                .addSelect('daily_report.bunkeringMgo', 'bunkeringMgo')


                .innerJoin('daily_report.port', 'port')
                .innerJoin('port.voyage', 'voyage')

                .where('daily_report.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })

                .andWhere('daily_report.userId = :userId', { userId: userId })

                .getRawMany()
                .then(
                    (result: any) => {
                        // Verificamos que el resultado no este vacio.
                        if (!result) throw 'ERROR GetReportVoyagePortDaily';

                        return result;
                    }
                );
    }

    // Obtener la informacion de combustible, consumo y faena.
    async GetInfoVoyageROBAndBunkeringByBuqueAndDate(startDate: Date, endDate: Date, userId: number): Promise<GetInfoVoyageROBBunkering[]> {

        // Este arreglo contendra la info del rob del inicio del viaje y cuanto consumio en el rango de fecha.
        let firstResultInfoVoyage: GetInfoVoyageROBBunkering[] = [];

        // Hacemos where por todos los campos de la entidad
        // Buscamos la info del rob asta antes del inicio de fecha
        return await this._dailyReportRepository.createQueryBuilder('daily_report')

            .select(' voyage.id ', 'voyageId')
            .addSelect(' voyage.voyageNumber ', 'voyageNumber')
            .addSelect(' MIN(daily_report.date) ', "minDate")
            .addSelect(' MAX(daily_report.date) ', "maxDate")
            .addSelect(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', "totalIFO")
            .addSelect(' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ', "totalMGO")

            .innerJoinAndSelect('daily_report.port', 'port')
            .innerJoinAndSelect('port.voyage', 'voyage')

            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })

            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
            .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })

            .groupBy('voyage.id, voyage.voyageNumber')

            .getRawMany()

            .then(
                (result: GetInfoVoyageROBBunkering[]) => {
                    // Verificamos que el resultado no este vacio.
                    if (!result) throw 'ERROR GetROBByUser';


                    firstResultInfoVoyage = result;

                    return this._dailyReportRepository.createQueryBuilder('daily_report')
                        .select(' voyage.id ', 'voyageId')
                        .addSelect(' voyage.voyageNumber ', 'voyageNumber')
                        .addSelect(' port.id ', 'portId')
                        .addSelect(' port.voyageId ', 'voyageId')
                        .addSelect(' port.portNumber ', 'portNumber')
                        .addSelect(' port.departurePort ', 'portDeparture')
                        .addSelect(' daily_report.id ', "daily_reportId")
                        .addSelect(' daily_report.date ', "dailyReportDate")
                        .addSelect(' daily_report.bunkeringIfo ', "bunkeringIfo")
                        .addSelect(' daily_report.bunkeringMgo ', "bunkeringMgo")
                        .addSelect(' daily_report.observation ', "observation")

                        .innerJoinAndSelect('daily_report.port', 'port')
                        .innerJoinAndSelect('port.voyage', 'voyage')

                        .where('daily_report.status = :status', { status: 1 })
                        .andWhere('port.status = :status', { status: 1 })
                        .andWhere('voyage.status = :status', { status: 1 })

                        .andWhere('daily_report.userId = :userId', { userId: userId })
                        .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
                        .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
                        .andWhere('daily_report.bunkeringIfo > :bunkeringIFO OR daily_report.bunkeringMgo > :bunkeringMGO', { bunkeringIFO: 0, bunkeringMGO: 0 })

                        .getRawMany();
                }
            )
            .then(
                (listInfoBunkering: GetInfoBunkering[]) => {
                    let listGetInfoVoyageROBBunkering: GetInfoVoyageROBBunkering[] = [];

                    // Recorremos el primer resultado.
                    firstResultInfoVoyage.forEach(
                        (itemInfoVoyage: GetInfoVoyageROBBunkering) => {
                            // Armamos el objeto.
                            let getInfoVoyageROBBunkering = new GetInfoVoyageROBBunkering();
                            getInfoVoyageROBBunkering.voyageId = itemInfoVoyage.voyageId;
                            getInfoVoyageROBBunkering.voyageNumber = itemInfoVoyage.voyageNumber;
                            getInfoVoyageROBBunkering.minDate = itemInfoVoyage.minDate;
                            getInfoVoyageROBBunkering.maxDate = itemInfoVoyage.maxDate;
                            getInfoVoyageROBBunkering.totalIFO = itemInfoVoyage.totalIFO;
                            getInfoVoyageROBBunkering.totalMGO = itemInfoVoyage.totalMGO;

                            let filterInfoBunkering = listInfoBunkering.filter((item: any) => item.voyageId === itemInfoVoyage.voyageId)

                            filterInfoBunkering.forEach(
                                item => {
                                    let getInfoBunkering: GetInfoBunkering = new GetInfoBunkering();

                                    getInfoBunkering.portId = item.portId;
                                    getInfoBunkering.portNumber = item.portNumber;
                                    getInfoBunkering.portDeparture = item.portDeparture;
                                    getInfoBunkering.daily_reportId = item.daily_reportId;
                                    getInfoBunkering.dailyReportDate = item.dailyReportDate;
                                    getInfoBunkering.bunkeringIfo = item.bunkeringIfo;
                                    getInfoBunkering.bunkeringMgo = item.bunkeringMgo;
                                    getInfoBunkering.observation = item.observation;


                                    getInfoVoyageROBBunkering.listInfoBunkering.push(getInfoBunkering)
                                }
                            );


                            listGetInfoVoyageROBBunkering.push(getInfoVoyageROBBunkering);
                        }
                    );

                    return listGetInfoVoyageROBBunkering;
                });
    }



    // NUEVOS QUERY CON OTRA CALIDA [o]v[o]

    // Esta servicio prove el total de los parametros que tiene el viaje puerto y reporte.
    async GetTotalByActivityFilterByUserIdAndDateAndType(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]> {

        // Hacemos where por todos los campos de la entidad
        return await
            this._dailyReportRepository.createQueryBuilder('daily_report')
                .select('voyage.userId', 'userId')

                // -- Datos del viaje
                .addSelect('voyage.year', 'year')
                .addSelect('voyage.id', 'voyageId')
                .addSelect('voyage.voyageNumber', 'voyageNumber')

                //-- Informacion del puerto
                .addSelect('port.id', 'portId')
                .addSelect('port.portNumber', 'portNumber')
                .addSelect('port.departurePort', 'departurePort')
                .addSelect('port.arrivalPort', 'arrivalPort')


                // -- Informacion del reporte.
                .addSelect('daily_report.id', 'dailyReportId')
                .addSelect('daily_report.date', 'date')
                .addSelect('daily_report.hour', 'hour')
                .addSelect('daily_report.activityPerformed', 'activityPerformed')
                .addSelect('daily_report.speedStraction', 'speedStraction')
                .addSelect('daily_report.observation', 'observation')

                // -- Cantidad de reportes
                .addSelect('COUNT(*)', 'count')
                // -- Suma total de tiempo
                .addSelect('SUM(daily_report.steamingTime)', 'steamingTime')
                // -- Suma total de distancia
                .addSelect('SUM(daily_report.distance)', 'distance')
                // Beaufour
                .addSelect('daily_report.beaufour', 'beaufour')



                // Suma total de consumo por maquina
                .addSelect('SUM(daily_report.mplaIfo)', 'mplaIfo')
                .addSelect('SUM(daily_report.auxIfo)', 'auxIfo')
                .addSelect('SUM(daily_report.boilerIfo)', 'boilerIfo')
                .addSelect('SUM(daily_report.otherIfo)', 'otherIfo')
                // Suma total de bunkering
                .addSelect('SUM(daily_report.bunkeringIfo)', 'bunkeringIfo')

                // UNION DE TABLAS
                .innerJoin('daily_report.port', 'port')
                .innerJoin('port.voyage', 'voyage')

                .where('daily_report.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })

                .andWhere('daily_report.userId = :userId', { userId: userId })
                .andWhere('port.userId = :userId', { userId: userId })
                .andWhere('voyage.userId = :userId', { userId: userId })

                .andWhere(' (daily_report.mplaIfo > :mplaIfo OR daily_report.auxIfo > :auxIfo OR daily_report.boilerIfo > :boilerIfo OR daily_report.otherIfo > :otherIfo OR daily_report.bunkeringIfo > :bunkeringIfo )', { mplaIfo: 0, auxIfo: 0, boilerIfo: 0, otherIfo: 0, bunkeringIfo: 0 })

                .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
                .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })

                .groupBy('activityPerformed')
                .addGroupBy('port.voyageId')

                .orderBy('voyage.year')
                .addOrderBy('port.voyageId')
                .getRawMany()

                .then(
                    (result: any) => {
                        // Verificamos que el resultado no este vacio.
                        if (!result) throw 'ERROR GetReportVoyagePortDaily';

                        return result;
                    }
                );
    }
}
