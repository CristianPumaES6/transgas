import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyReport } from 'src/models/daily-report.entity';
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
