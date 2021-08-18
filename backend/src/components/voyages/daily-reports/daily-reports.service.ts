import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyReport, GetROBByUser } from '../../../models/daily-report.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class DailyReportsService {
    constructor(
        @InjectRepository(DailyReport)
        private _dailyReportRepository: Repository<DailyReport>,
    ) { }

    // Registra un nuevo reporte diario
    async Create(dailyReport: DailyReport): Promise<DailyReport> {

        return await this._dailyReportRepository.save(dailyReport).then(
            (resultSave: DailyReport) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('No se puedo registrar el viaje en la BD.');

                return resultSave;
            }
        );

    }

    // Retorna a un objeto por id.
    async Get(id: Number): Promise<DailyReport> {
        // Hacemos una busqueda por id
        return await this._dailyReportRepository.findOne({
            where: {
                id: id,
                status: Not(false)
            }
        }).then(
            (resultFind: DailyReport) => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('does_not_exist');

                // retornamos el objeto.
                return resultFind;
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

                        .andWhere('datetime(daily_report.date) <= datetime(:startDate)', { startDate: startDate })

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

    // Actualiza un voyage
    async Update(dailyReport: DailyReport): Promise<DailyReport> {

        // Hacemos una busqueda por id
        return await this._dailyReportRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: dailyReport.id }
            ]
        }).then(resultFind => {

            // Validamos si encontro al SailingAnality.
            if (!resultFind) throw new Error('does_not_exist');

            // Actualizamos
            return this._dailyReportRepository.update(dailyReport.id, dailyReport);

        }).then(resultUpdate => {

            if (!resultUpdate) throw new Error('ERROR_TYPEORM_UPDATE_PORT');

            // Envio respuesta con el resultado recibido del ultimo paso
            return dailyReport;
        });
    }

    // Elimina a un voyage por id
    async Delete(dailyReport: DailyReport): Promise<DailyReport> {
        // Eliminamos de la base de dato al usuario.
        return await this._dailyReportRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: dailyReport.id }
            ]
        }).then(resultFind => {
            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('does_not_exist');

            resultFind.status = false;
            // verificamos que el email no este en uso, recordemos que el email es unico.
            return this._dailyReportRepository.update(dailyReport.id, resultFind);
        }).then(
            resultSave => {

                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_TYPEORM_UPDATE_PORT');

                return dailyReport;
            }
        );
    }


}
