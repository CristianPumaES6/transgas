import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DailyReport,
  GetInfoBunkering,
  GetInfoVoyageROBBunkering,
  GetReportVoyagePortDaily,
  GetROBByUser,
  InfoReport_IFO_AND_MGO,
} from '../../../models/daily-report.entity';
import { getManager, Like, Not, Repository } from 'typeorm';
import { URL_Server } from '../../../config/server.config';
import { DummyPromise } from '../../../assets/promises.assets';
import { FormatDateSumDays, FormatDateUTCToDateHour, GetDate } from '../../../assets/moment.assets';
import { Mapping, searchKey } from '../../../assets/mappingKeys';

@Injectable()
export class DailyReportsService {
  constructor(
    @InjectRepository(DailyReport)
    private _dailyReportRepository: Repository<DailyReport>,
  ) {}

  // Registra un nuevo reporte diario
  async Create(dailyReport: DailyReport): Promise<DailyReport> {
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          // Buscamos el viaje
          return this._dailyReportRepository.query(` EXEC SP_CreateNewDailyReport @userId = ${dailyReport.userId} ,@portId = ${
            dailyReport.portId
          } ,@activityPerformed = '${dailyReport.activityPerformed}' ,@speedStraction = '${dailyReport.speedStraction}' ,@date ='${
            dailyReport.date
          }' ,@hour = '${dailyReport.hour}' ,@bunkeringIfo = ${dailyReport.bunkeringIfo} ,@bunkeringMgo = ${dailyReport.bunkeringMgo} ,@mplaIfo  = ${
            dailyReport.mplaIfo
          } ,@auxIfo  = ${dailyReport.auxIfo} ,@boilerIfo  = ${dailyReport.boilerIfo} ,@otherIfo = ${dailyReport.otherIfo} ,@mplaMgo = ${
            dailyReport.mplaMgo
          } ,@auxMgo   = ${dailyReport.auxMgo} ,@boilerMgo   = ${dailyReport.boilerMgo} ,@ppMgo = ${dailyReport.ppMgo} ,@giMgo = ${
            dailyReport.giMgo
          } ,@otherMgo  = ${dailyReport.otherMgo} ,@steamingTime  = ${dailyReport.steamingTime} ,@distance =${dailyReport.distance} ,@beaufour = '${
            dailyReport.beaufour
          }' ,@observation ='${dailyReport.observation}'  ,@userIdCreated = ${dailyReport.userIdCreated} ,@dateCreated = '${
            dailyReport.dateCreated
          }' ,@userIdUpdated = ${dailyReport.userIdUpdated || 0} ,@dateUpdated = '${dailyReport.dateUpdated || null}' ,@status = ${dailyReport.status}
                    `);
        } else {
          return this._dailyReportRepository.save(dailyReport);
        }
      })
      .then(resultSave => {
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
      })
      .catch(err => {
        throw err;
      });
  }

  // Retorna a un objeto por id.
  async Get(id: Number): Promise<DailyReport> {
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          // Buscamos el viaje
          return this._dailyReportRepository.query(`
                     EXEC SP_BuscarReportePorId 
                    @dailyReportId = ${id} 
                    `);
        } else {
          return this._dailyReportRepository.find({
            where: [
              {
                id: id,
              },
            ],
          });
        }
      })
      .then((resultFind: DailyReport[]) => {
        // Validamos si encontro al usuario.
        if (!resultFind) throw new Error('does_not_exist');
        if (resultFind && resultFind.length == 0) throw new Error('does_not_exist');

        let returnDailyReport = resultFind[0];
        // retornamos el objeto.
        return returnDailyReport;
      });
  }

  // Retorna todos los viajes segun filtro.
  async Gets(dailyReport: DailyReport): Promise<DailyReport[]> {
    // Hacemos where por todos los campos de la entidad
    return await this._dailyReportRepository
      .find({
        where: [
          // name && surname && nick && email
          {
            userId: Like('%' + (dailyReport.userId || '') + '%'),
            portId: Like('%' + dailyReport.portId + '%'),
            status: Not(false),
          },
        ],
        order: {
          date: 'ASC',
          hour: 'ASC',
        },
      })
      .then((result: DailyReport[]) => {
        // No lo validamos por que puede llegar vacio.

        return result;
      });
  }

  // Actualiza un voyage
  async Update(dailyReport: DailyReport): Promise<DailyReport> {
    return DummyPromise()
      .then(result => {
        return this.Get(dailyReport.id);
      })
      .then(resultFind => {
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
      })
      .then(resultUpdate => {
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
    return DummyPromise()
      .then(result => {
        return this.Get(dailyReport.id);
      })
      .then(resultFind => {
        // Validamos si encontro al usuario.
        if (!resultFind) throw new Error('does_not_exist');

        resultFind.userIdUpdated = usuarioDelete;
        resultFind.dateUpdated = GetDate();
        resultFind.status = false;
        // verificamos que el email no este en uso, recordemos que el email es unico.
        return this.Update(resultFind);
      })
      .then(resultSave => {
        // Validamos si encontro al usuario.
        if (!resultSave) throw new Error('ERROR_TYPEORM_UPDATE_PORT');

        return dailyReport;
      });
  }

  // QUERY PERSONALIZATE
  // Retorna todos los viajes segun filtro.
  async GetROBByUser(userId: number): Promise<GetROBByUser> {
    // Hacemos where por todos los campos de la entidad
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

      .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
      .addSelect(
        ' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ',
        'total_mgo',
      )
      .addSelect(' SUM( daily_report.bunkeringIfo )', 'total_bunkering_ifo')
      .addSelect(' SUM( daily_report.bunkeringMgo )', 'total_bunkering_mgo')

      .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })

      .getRawOne()
      .then((result: any) => {
        let getROBByUser: GetROBByUser = <GetROBByUser>{};

        // Si no existen valores le doy cero por defecto.
        getROBByUser.total_ifo = result.total_ifo || 0;
        getROBByUser.total_mgo = result.total_mgo || 0;
        getROBByUser.total_bunkering_ifo = result.total_bunkering_ifo || 0;
        getROBByUser.total_bunkering_mgo = result.total_bunkering_mgo || 0;

        return getROBByUser;
      });
  }

  // Retorna todos los viajes segun filtro.
  async GetStartEndROByFilterDate(startDate: Date, endDate: Date, userId: number): Promise<GetROBByUser[]> {
    // Este arreglo contendra la info del rob del inicio del viaje y cuanto consumio en el rango de fecha.
    let StartEndROB: any[] = [];

    // Hacemos where por todos los campos de la entidad
    // Buscamos la info del rob asta antes del inicio de fecha
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

      .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
      .addSelect(
        ' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ',
        'total_mgo',
      )
      .addSelect(' SUM( daily_report.bunkeringIfo ) ', 'total_bunkering_ifo')
      .addSelect(' SUM( daily_report.bunkeringMgo ) ', 'total_bunkering_mgo')

      .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })

      .andWhere('datetime(daily_report.date) < datetime(:startDate)', {
        startDate: startDate,
      })

      .getRawOne()
      .then((result: GetROBByUser) => {
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
        return this._dailyReportRepository
          .createQueryBuilder('daily_report')
          .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
          .addSelect(
            ' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ',
            'total_mgo',
          )
          .addSelect(' SUM( daily_report.bunkeringIfo )', 'total_bunkering_ifo')
          .addSelect(' SUM( daily_report.bunkeringMgo )', 'total_bunkering_mgo')

          .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
          .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

          .where('daily_report.status = :status', { status: 1 })
          .andWhere('port.status = :status', { status: 1 })
          .andWhere('voyage.status = :status', { status: 1 })

          .andWhere('daily_report.userId = :userId', { userId: userId })

          .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
            startDate: startDate,
          })
          .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
            endDate: endDate,
          })
          .getRawOne();
      })
      .then((result: GetROBByUser) => {
        if (!result) throw 'ERROR GetEndROBByUser';

        let getEndROBByUser = <GetROBByUser>{};

        // Si no existen valores le doy cero por defecto.
        getEndROBByUser.total_ifo = result.total_ifo || 0;
        getEndROBByUser.total_mgo = result.total_mgo || 0;
        getEndROBByUser.total_bunkering_ifo = result.total_bunkering_ifo || 0;
        getEndROBByUser.total_bunkering_mgo = result.total_bunkering_mgo || 0;

        StartEndROB.push(getEndROBByUser);

        return StartEndROB;
      });
  }

  // Retorna todos los viajes segun filtro.
  async GetBunkeringByUserIFO(userId: number): Promise<GetROBByUser> {
    // Hacemos where por todos los campos de la entidad
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')
      .select('daily_report.date', 'date')
      .addSelect('daily_report.hour', 'hour')
      .addSelect('daily_report.activityPerformed', 'activityPerformed')
      .addSelect('daily_report.bunkeringIfo', 'bunkeringIfo')

      .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })
      .andWhere('daily_report.bunkeringIfo > 0', {})
      .orderBy('daily_report.date', 'DESC')
      .limit(5)
      .getRawMany()
      .then((result: any) => {
        return result;
      });
  }

  // Retorna todos los viajes segun filtro.
  async GetBunkeringByUserMGO(userId: number): Promise<GetROBByUser> {
    // Hacemos where por todos los campos de la entidad
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

      .select('daily_report.date', 'date')
      .addSelect('daily_report.hour', 'hour')
      .addSelect('daily_report.activityPerformed', 'activityPerformed')
      .addSelect('daily_report.bunkeringMgo', 'bunkeringMgo')

      .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })
      .andWhere('daily_report.bunkeringMgo > 0', {})
      .orderBy('daily_report.date', 'DESC')
      .limit(5)
      .getRawMany()
      .then((result: any) => {
        return result;
      });
  }

  // Retorna todos los viajes segun filtro de feca o por viaje id
  async GetReportVoyagePortDaily(userId: number, startDate: Date, endDate: Date, filterByVoyage: number): Promise<GetReportVoyagePortDaily[]> {
    // Hacemos where por todos los campos de la entidad
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

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
      .addSelect('daily_report.typeActivityPerformed', 'typeActivityPerformed')
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

      // UBICACION.
      .addSelect('daily_report.north_degree', 'north_degree')
      .addSelect('daily_report.north_minutes', 'north_minutes')
      .addSelect('daily_report.north_north_south', 'north_north_south')
      // UBICACION
      .addSelect('daily_report.east_degree', 'east_degree')
      .addSelect('daily_report.east_minutes', 'east_minutes')
      .addSelect('daily_report.east_east_west', 'east_east_west')

      .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })

      .andWhere(
        '(( datetime(daily_report.date) >= datetime(:startDate) AND datetime(daily_report.date) <= datetime(:endDate) ) OR voyage.id = :voyageId)',
        {
          startDate: startDate,
          endDate: endDate,
          voyageId: filterByVoyage,
        },
      )

      .orderBy('daily_report.date', 'ASC')
      .getRawMany()
      .then((result: any) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetReportVoyagePortDaily';

        return result;
      });
  }

  // Retorna todos los viajes segun filtro.
  async GetReportByUser(userId: number): Promise<GetReportVoyagePortDaily[]> {
    // Hacemos where por todos los campos de la entidad
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

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

      .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })

      .getRawMany()
      .then((result: any) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetReportVoyagePortDaily';

        return result;
      });
  }

  // Obtener la informacion de combustible, consumo y faena.
  async GetInfoVoyageROBAndBunkeringByBuqueAndDate(startDate: Date, endDate: Date, userId: number): Promise<GetInfoVoyageROBBunkering[]> {
    // Este arreglo contendra la info del rob del inicio del viaje y cuanto consumio en el rango de fecha.
    let firstResultInfoVoyage: GetInfoVoyageROBBunkering[] = [];

    // Hacemos where por todos los campos de la entidad
    // Buscamos la info del rob asta antes del inicio de fecha
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

      .select(' voyage.id ', 'voyageId')
      .addSelect(' voyage.voyageNumber ', 'voyageNumber')
      .addSelect(' MIN(daily_report.date) ', 'minDate')
      .addSelect(' MAX(daily_report.date) ', 'maxDate')
      .addSelect(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'totalIFO')
      .addSelect(
        ' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ',
        'totalMGO',
      )

      .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })
      .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
        startDate: startDate,
      })
      .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
        endDate: endDate,
      })

      .groupBy('voyage.id, voyage.voyageNumber')

      .getRawMany()

      .then((result: GetInfoVoyageROBBunkering[]) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetROBByUser';

        firstResultInfoVoyage = result;

        return this._dailyReportRepository
          .createQueryBuilder('daily_report')
          .select(' voyage.id ', 'voyageId')
          .addSelect(' voyage.voyageNumber ', 'voyageNumber')
          .addSelect(' port.id ', 'portId')
          .addSelect(' port.voyageId ', 'voyageId')
          .addSelect(' port.portNumber ', 'portNumber')
          .addSelect(' port.departurePort ', 'portDeparture')
          .addSelect(' daily_report.id ', 'daily_reportId')
          .addSelect(' daily_report.date ', 'dailyReportDate')
          .addSelect(' daily_report.bunkeringIfo ', 'bunkeringIfo')
          .addSelect(' daily_report.bunkeringMgo ', 'bunkeringMgo')
          .addSelect(' daily_report.observation ', 'observation')

          .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
          .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

          .where('daily_report.status = :status', { status: 1 })
          .andWhere('port.status = :status', { status: 1 })
          .andWhere('voyage.status = :status', { status: 1 })

          .andWhere('daily_report.userId = :userId', { userId: userId })
          .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
            startDate: startDate,
          })
          .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
            endDate: endDate,
          })
          .andWhere('daily_report.bunkeringIfo > :bunkeringIFO OR daily_report.bunkeringMgo > :bunkeringMGO', { bunkeringIFO: 0, bunkeringMGO: 0 })

          .getRawMany();
      })
      .then((listInfoBunkering: GetInfoBunkering[]) => {
        let listGetInfoVoyageROBBunkering: GetInfoVoyageROBBunkering[] = [];

        // Recorremos el primer resultado.
        firstResultInfoVoyage.forEach((itemInfoVoyage: GetInfoVoyageROBBunkering) => {
          // Armamos el objeto.
          let getInfoVoyageROBBunkering = new GetInfoVoyageROBBunkering();
          getInfoVoyageROBBunkering.voyageId = itemInfoVoyage.voyageId;
          getInfoVoyageROBBunkering.voyageNumber = itemInfoVoyage.voyageNumber;
          getInfoVoyageROBBunkering.minDate = itemInfoVoyage.minDate;
          getInfoVoyageROBBunkering.maxDate = itemInfoVoyage.maxDate;
          getInfoVoyageROBBunkering.totalIFO = itemInfoVoyage.totalIFO;
          getInfoVoyageROBBunkering.totalMGO = itemInfoVoyage.totalMGO;

          let filterInfoBunkering = listInfoBunkering.filter((item: any) => item.voyageId === itemInfoVoyage.voyageId);

          filterInfoBunkering.forEach(item => {
            let getInfoBunkering: GetInfoBunkering = new GetInfoBunkering();

            getInfoBunkering.portId = item.portId;
            getInfoBunkering.portNumber = item.portNumber;
            getInfoBunkering.portDeparture = item.portDeparture;
            getInfoBunkering.daily_reportId = item.daily_reportId;
            getInfoBunkering.dailyReportDate = item.dailyReportDate;
            getInfoBunkering.bunkeringIfo = item.bunkeringIfo;
            getInfoBunkering.bunkeringMgo = item.bunkeringMgo;
            getInfoBunkering.observation = item.observation;

            getInfoVoyageROBBunkering.listInfoBunkering.push(getInfoBunkering);
          });

          listGetInfoVoyageROBBunkering.push(getInfoVoyageROBBunkering);
        });

        return listGetInfoVoyageROBBunkering;
      });
  }

  // NUEVOS QUERY CON OTRA CALIDA [o]v[o]
  // Esta servicio prove el total de los parametros que tiene el viaje puerto y reporte.
  async GetTotalByActivityFilterByUserIdAndDateAndType(
    userId: number,
    startDate: string,
    endDate: string,
    filterBy: string,
  ): Promise<GetReportVoyagePortDaily[]> {
    // Si la fecha es null en automatico enviara los ultimos 40 registros.
    let startDateRegister = startDate == 'null' ? null : startDate;
    let endDateRegister = endDate == 'null' ? null : endDate;
    let cantUltimosDias = 40;

    // Inicio de la promesa.
    return await DummyPromise()
      .then(result => {
        // Solo si la fecha es null, obtenedremos el ultimo registro ingresado
        if (!startDateRegister && !endDateRegister) {
          // Buscamos el ultimo reporte.
          return (
            this._dailyReportRepository
              .createQueryBuilder('daily_report')
              .addSelect('daily_report.date', 'date')

              // UNION DE TABLAS
              .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
              .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
              // Where status
              .where('daily_report.status = :status', { status: 1 })
              .andWhere('voyage.status = :status', { status: 1 })
              .andWhere('port.status = :status', { status: 1 })
              // Filtro por el usuario seleccionado.
              .andWhere('daily_report.userId = :userId', { userId: userId })
              .andWhere('port.userId = :userId', { userId: userId })
              .andWhere('voyage.userId = :userId', { userId: userId })
              .orderBy('daily_report.date', 'DESC')
              .limit(1)
              .getRawMany()
          );
        } else {
          return null;
        }
      })
      .then(resultFind => {
        // Si recibimos una fecha, hacemos la jugada para obtener los ultimos 40 dias
        if (resultFind) {
          // Embase al la ultima fecha mostramos los ultimos 40 dias.
          endDateRegister = resultFind[0].date;
          startDateRegister = FormatDateSumDays(endDateRegister, cantUltimosDias);
        }

        return true;
      })
      .then(result => {
        let addSelectDinamic =
          filterBy === 'MONTHS'
            ? "strftime('%Y-%m', 'daily_report'.'date')"
            : filterBy === 'DAYS'
            ? "strftime('%Y-%m-%d', 'daily_report'.'date')"
            : 'daily_report.date';

        let groupByDinamic =
          filterBy === 'VOYAGES'
            ? 'activityPerformed, voyage.id'
            : filterBy === 'PORTS'
            ? 'activityPerformed, voyage.id, port.id'
            : filterBy === 'MONTHS'
            ? "activityPerformed, strftime('%Y-%m', 'daily_report'.'date')"
            : filterBy === 'DAYS'
            ? "activityPerformed, strftime('%Y-%m-%d', 'daily_report'.'date')"
            : 'activityPerformed, voyage.year, voyage.id';

        let orderBy =
          filterBy === 'VOYAGES'
            ? 'voyage.id'
            : filterBy === 'PORTS'
            ? 'voyage.id, port.id'
            : filterBy === 'MONTHS'
            ? "voyage.id,  strftime('%Y-%m', 'daily_report'.'date')"
            : filterBy === 'DAYS'
            ? "'daily_report'.'date'"
            : 'voyage.id';

        return (
          this._dailyReportRepository
            .createQueryBuilder('daily_report')
            .select('voyage.userId', 'userId')

            // -- Datos del viaje
            .addSelect('voyage.year', 'year')
            .addSelect('voyage.id', 'voyageId')
            .addSelect('voyage.voyageNumber', 'voyageNumber')

            //-- Informacion del puerto
            .addSelect('port.id', 'portId')
            .addSelect('port.portNumber', 'portNumber')
            //.addSelect('port.departurePort', 'departurePort')
            //.addSelect('port.arrivalPort', 'arrivalPort')
            .addSelect('min(port.departurePort)', 'departurePort')
            .addSelect('max(port.arrivalPort)', 'arrivalPort')

            // -- Informacion del reporte.
            .addSelect('daily_report.id', 'dailyReportId')
            .addSelect(addSelectDinamic, 'date')
            .addSelect('min(daily_report.date)', 'dayStart')
            .addSelect('max(daily_report.date)', 'dayEnd')
            .addSelect('daily_report.hour', 'hour')
            .addSelect('daily_report.activityPerformed', 'activityPerformed')
            .addSelect('daily_report.speedStraction', 'speedStraction')
            .addSelect('daily_report.observation', 'observation')

            // -- Cantidad de reportes
            .addSelect('COUNT(*)', 'countReports')
            .addSelect('COUNT(DISTINCT "port"."id")', 'countPorts')
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

            .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

            .where('daily_report.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })

            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('port.userId = :userId', { userId: userId })
            .andWhere('voyage.userId = :userId', { userId: userId })

            .andWhere(
              ' (daily_report.mplaIfo > :mplaIfo OR daily_report.auxIfo > :auxIfo OR daily_report.boilerIfo > :boilerIfo OR daily_report.otherIfo > :otherIfo OR daily_report.bunkeringIfo > :bunkeringIfo )',
              {
                mplaIfo: 0,
                auxIfo: 0,
                boilerIfo: 0,
                otherIfo: 0,
                bunkeringIfo: 0,
              },
            )

            .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
              startDate: startDateRegister,
            })
            .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
              endDate: endDateRegister,
            })

            .groupBy(groupByDinamic)
            .orderBy(orderBy)
            .getRawMany()
        );
      })
      .then((result: any) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetReportVoyagePortDaily';

        return result;
      });
  }

  async GetTotalConsumptionByActivityFilterByUserIdAndDateAndType(
    userId: number,
    startDate: string,
    endDate: string,
    typeSummary: string,
  ): Promise<InfoReport_IFO_AND_MGO> {
    // Si la fecha es null en automatico enviara los ultimos 40 registros.
    let startDateRegister = startDate == 'null' ? null : startDate;
    let endDateRegister = endDate == 'null' ? null : endDate;
    let cantUltimosDias = 40;

    let result_IFO_AND_MGO: InfoReport_IFO_AND_MGO = new InfoReport_IFO_AND_MGO();

    // Inicio de la promesa.
    return await DummyPromise()
      .then(result => {
        // Solo si la fecha es null, obtenedremos el ultimo registro ingresado
        if (!startDateRegister && !endDateRegister) {
          // Buscamos el ultimo reporte.
          return (
            this._dailyReportRepository
              .createQueryBuilder('daily_report')
              .addSelect('daily_report.date', 'date')

              // UNION DE TABLAS
              .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
              .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

              // Where status
              .where('daily_report.status = :status', { status: 1 })
              .andWhere('voyage.status = :status', { status: 1 })
              .andWhere('port.status = :status', { status: 1 })
              // Filtro por el usuario seleccionado.
              .andWhere('daily_report.userId = :userId', { userId: userId })
              .andWhere('port.userId = :userId', { userId: userId })
              .andWhere('voyage.userId = :userId', { userId: userId })
              .orderBy('daily_report.date', 'DESC')
              .limit(1)
              .getRawMany()
          );
        } else {
          return null;
        }
      })
      .then(resultFind => {
        // Si recibimos una fecha, hacemos la jugada para obtener los ultimos 40 dias
        if (resultFind) {
          // Embase al la ultima fecha mostramos solo los ultimos 40 dias.
          endDateRegister = resultFind[0].date;
          startDateRegister = FormatDateSumDays(endDateRegister, cantUltimosDias);
        }

        return true;
      })
      .then(result => {
        let addSelectDinamic =
          typeSummary === 'MONTHS'
            ? "strftime('%Y-%m', 'daily_report'.'date')"
            : typeSummary === 'DAYS'
            ? "strftime('%Y-%m-%d', 'daily_report'.'date')"
            : 'daily_report.date';

        let groupByDinamic =
          typeSummary === 'VOYAGES'
            ? 'activityPerformed, voyage.id'
            : typeSummary === 'PORTS'
            ? 'activityPerformed, voyage.id, port.id'
            : typeSummary === 'MONTHS'
            ? "activityPerformed, strftime('%Y-%m', 'daily_report'.'date')"
            : typeSummary === 'DAYS'
            ? "activityPerformed, strftime('%Y-%m-%d', 'daily_report'.'date')"
            : 'activityPerformed, voyage.year, voyage.id';

        let orderBy =
          typeSummary === 'VOYAGES'
            ? 'voyage.id'
            : typeSummary === 'PORTS'
            ? 'voyage.id, port.id'
            : typeSummary === 'MONTHS'
            ? "voyage.id,  strftime('%Y-%m', 'daily_report'.'date')"
            : typeSummary === 'DAYS'
            ? "'daily_report'.'date'"
            : 'voyage.id';

        return (
          this._dailyReportRepository
            .createQueryBuilder('daily_report')
            .select('voyage.userId', 'userId')

            // -- Datos del viaje
            .addSelect('voyage.year', 'year')
            .addSelect('voyage.id', 'voyageId')
            .addSelect('voyage.voyageNumber', 'voyageNumber')

            //-- Informacion del puerto
            .addSelect('port.id', 'portId')
            .addSelect('port.portNumber', 'portNumber')
            //.addSelect('port.departurePort', 'departurePort')
            //.addSelect('port.arrivalPort', 'arrivalPort')
            .addSelect('min(port.departurePort)', 'departurePort')
            .addSelect('max(port.arrivalPort)', 'arrivalPort')

            // -- Informacion del reporte.
            .addSelect('daily_report.id', 'dailyReportId')
            .addSelect(addSelectDinamic, 'date')
            .addSelect('min(daily_report.date)', 'dayStart')
            .addSelect('max(daily_report.date)', 'dayEnd')
            .addSelect('daily_report.hour', 'hour')
            .addSelect('daily_report.activityPerformed', 'activityPerformed')
            .addSelect('daily_report.speedStraction', 'speedStraction')
            .addSelect('daily_report.observation', 'observation')

            // -- Cantidad de reportes
            .addSelect('COUNT(*)', 'countReports')
            .addSelect('COUNT(DISTINCT "port"."id")', 'countPorts')
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
            .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

            .where('daily_report.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })

            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('port.userId = :userId', { userId: userId })
            .andWhere('voyage.userId = :userId', { userId: userId })

            // Comprobamos que halla algun consumo del tipo de combustible.
            .andWhere(
              '(daily_report.mplaIfo > :mplaIfo OR daily_report.auxIfo > :auxIfo OR daily_report.boilerIfo > :boilerIfo OR daily_report.otherIfo > :otherIfo OR daily_report.bunkeringIfo > :bunkeringIfo )',
              {
                mplaIfo: 0,
                auxIfo: 0,
                boilerIfo: 0,
                otherIfo: 0,
                bunkeringIfo: 0,
              },
            )

            .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
              startDate: startDateRegister,
            })
            .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
              endDate: endDateRegister,
            })

            .groupBy(groupByDinamic)
            .orderBy(orderBy)
            .getRawMany()
        );
      })
      .then((result: any) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetReportVoyagePortDaily';

        // LA info del ifo lo guardamos en la primera posicion.
        result_IFO_AND_MGO.ifo = result;

        let addSelectDinamic =
          typeSummary === 'MONTHS'
            ? "strftime('%Y-%m', 'daily_report'.'date')"
            : typeSummary === 'DAYS'
            ? "strftime('%Y-%m-%d', 'daily_report'.'date')"
            : 'daily_report.date';

        let groupByDinamic =
          typeSummary === 'VOYAGES'
            ? 'activityPerformed, voyage.id'
            : typeSummary === 'PORTS'
            ? 'activityPerformed, voyage.id, port.id'
            : typeSummary === 'MONTHS'
            ? "activityPerformed, strftime('%Y-%m', 'daily_report'.'date')"
            : typeSummary === 'DAYS'
            ? "activityPerformed, strftime('%Y-%m-%d', 'daily_report'.'date')"
            : 'activityPerformed, voyage.year, voyage.id';

        let orderBy =
          typeSummary === 'VOYAGES'
            ? 'voyage.id'
            : typeSummary === 'PORTS'
            ? 'voyage.id, port.id'
            : typeSummary === 'MONTHS'
            ? "voyage.id,  strftime('%Y-%m', 'daily_report'.'date')"
            : typeSummary === 'DAYS'
            ? "'daily_report'.'date'"
            : 'voyage.id';

        return (
          this._dailyReportRepository
            .createQueryBuilder('daily_report')
            .select('voyage.userId', 'userId')

            // -- Datos del viaje
            .addSelect('voyage.year', 'year')
            .addSelect('voyage.id', 'voyageId')
            .addSelect('voyage.voyageNumber', 'voyageNumber')

            //-- Informacion del puerto
            .addSelect('port.id', 'portId')
            .addSelect('port.portNumber', 'portNumber')
            //.addSelect('port.departurePort', 'departurePort')
            //.addSelect('port.arrivalPort', 'arrivalPort')
            .addSelect('min(port.departurePort)', 'departurePort')
            .addSelect('max(port.arrivalPort)', 'arrivalPort')

            // -- Informacion del reporte.
            .addSelect('daily_report.id', 'dailyReportId')
            .addSelect(addSelectDinamic, 'date')
            .addSelect('min(daily_report.date)', 'dayStart')
            .addSelect('max(daily_report.date)', 'dayEnd')
            .addSelect('daily_report.hour', 'hour')
            .addSelect('daily_report.activityPerformed', 'activityPerformed')
            .addSelect('daily_report.speedStraction', 'speedStraction')
            .addSelect('daily_report.observation', 'observation')

            // -- Cantidad de reportes
            .addSelect('COUNT(*)', 'countReports')
            .addSelect('COUNT(DISTINCT "port"."id")', 'countPorts')
            // -- Suma total de tiempo
            .addSelect('SUM(daily_report.steamingTime)', 'steamingTime')
            // -- Suma total de distancia
            .addSelect('SUM(daily_report.distance)', 'distance')
            // Beaufour
            .addSelect('daily_report.beaufour', 'beaufour')

            // Suma total de consumo por maquina
            .addSelect('SUM(daily_report.mplaMgo)', 'mplaMgo')
            .addSelect('SUM(daily_report.auxMgo)', 'auxMgo')
            .addSelect('SUM(daily_report.boilerMgo)', 'boilerMgo')
            .addSelect('SUM(daily_report.giMgo)', 'giMgo')
            .addSelect('SUM(daily_report.ppMgo)', 'ppMgo')
            .addSelect('SUM(daily_report.otherMgo)', 'otherMgo')

            // Suma total de bunkering
            .addSelect('SUM(daily_report.bunkeringMgo)', 'bunkeringMgo')

            // UNION DE TABLAS
            .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

            .where('daily_report.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })

            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('port.userId = :userId', { userId: userId })
            .andWhere('voyage.userId = :userId', { userId: userId })

            // Comprobamos que halla algun consumo del tipo de combustible.
            .andWhere(
              '(daily_report.mplaMgo > :mplaMgo OR daily_report.auxMgo > :auxMgo OR daily_report.boilerMgo > :boilerMgo OR daily_report.giMgo > :giMgo OR daily_report.ppMgo > :ppMgo OR daily_report.otherMgo > :otherMgo OR daily_report.bunkeringMgo > :bunkeringMgo )',
              {
                mplaMgo: 0,
                auxMgo: 0,
                boilerMgo: 0,
                giMgo: 0,
                ppMgo: 0,
                otherMgo: 0,
                bunkeringMgo: 0,
              },
            )

            .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
              startDate: startDateRegister,
            })
            .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
              endDate: endDateRegister,
            })

            .groupBy(groupByDinamic)
            .orderBy(orderBy)
            .getRawMany()
        );
      })
      .then((result: any) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetReportVoyagePortDaily';

        // LA info del ifo lo guardamos en la primera posicion.
        result_IFO_AND_MGO.mgo = result;

        return result_IFO_AND_MGO;
      });
  }

  async GetReportDNVByUser(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]> {
    // Hacemos where por todos los campos de la entidad
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

      .select('MAX(voyage.userId)', 'userId')
      .addSelect('MAX(voyage.year)', 'year')
      .addSelect('MAX(voyage.id)', 'voyageId')
      .addSelect('MAX(voyage.voyageNumber)', 'voyageNumber')

      .addSelect('MAX(port.id)', 'portId')
      .addSelect('MAX(port.portNumber)', 'portNumber')
      .addSelect('MAX(port.departurePort)', 'departurePort')
      .addSelect('MAX(port.arrivalPort)', 'arrivalPort')

      .addSelect('MAX(daily_report.id)', 'dailyReportId')
      .addSelect('daily_report.date', 'date')
      .addSelect('MAX(daily_report.hour)', 'hour')

      .addSelect('SUM(daily_report.steamingTime)', 'steamingTime')
      .addSelect('MAX(daily_report.activityPerformed)', 'activityPerformed')
      .addSelect('MAX(daily_report.speedStraction)', 'speedStraction')
      .addSelect('MAX(daily_report.observation)', 'observation')

      .addSelect('SUM(daily_report.distance)', 'distance')
      .addSelect('MAX(daily_report.beaufour)', 'beaufour')

      .addSelect('SUM(daily_report.mplaIfo)', 'mplaIfo')
      .addSelect('SUM(daily_report.auxIfo)', 'auxIfo')
      .addSelect('SUM(daily_report.boilerIfo)', 'boilerIfo')
      .addSelect('SUM(daily_report.otherIfo)', 'otherIfo')
      .addSelect('SUM(daily_report.bunkeringIfo)', 'bunkeringIfo')

      .addSelect('SUM(daily_report.mplaMgo)', 'mplaMgo')
      .addSelect('SUM(daily_report.auxMgo)', 'auxMgo')
      .addSelect('SUM(daily_report.boilerMgo)', 'boilerMgo')
      .addSelect('SUM(daily_report.ppMgo)', 'ppMgo')
      .addSelect('SUM(daily_report.giMgo)', 'giMgo')
      .addSelect('SUM(daily_report.otherMgo)', 'otherMgo')
      .addSelect('SUM(daily_report.bunkeringMgo)', 'bunkeringMgo')

      // UBICACION.
      .addSelect('MAX(daily_report.north_degree)', 'north_degree')
      .addSelect('MAX(daily_report.north_minutes)', 'north_minutes')
      .addSelect('MAX(daily_report.north_north_south)', 'north_north_south')
      // UBICACION
      .addSelect('MAX(daily_report.east_degree)', 'east_degree')
      .addSelect('MAX(daily_report.east_minutes)', 'east_minutes')
      .addSelect('MAX(daily_report.east_east_west)', 'east_east_west')

      .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })

      .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
        startDate: startDate,
      })
      .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
        endDate: endDate,
      })
      .groupBy("strftime('%Y-%m-%d', 'daily_report'.'date')")
      .getRawMany()
      .then((result: any) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetReportVoyagePortDaily';
        return result;
      });
  }

  async GetReportDNVByUserNOON(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]> {
    let stringGroupBY = "datetime('daily_report'.'date','+8.999999 hour')";
    let stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+8.999999 hour')";

    //PILARGAS
    if (userId == 7) {
      stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
    }

    // si el usuario es TAUROGAS
    if (userId == 14) {
      stringGroupBY = "datetime('daily_report'.'date','+7.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+7.999999 hour')";
    }

    // si el usuario es Huntegas
    if (userId == 10) {
      stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
    }

    // CHAVIN NO SE PUDO

    // si el usuario es CARAL
    if (userId == 21) {
      stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
    }

    if (userId == 2) {
      stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
    }

    // buque camila
    if (userId == 15) {
      stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
    }

    // buque LEONARDO
    if (userId == 13) {
      stringGroupBY = "datetime('daily_report'.'date','+8.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+8.999999 hour')";
    }

    //
    if (userId == 27) {
      stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
    }

    // Permite obtener en el tiempo de nagacion de las ultimas 24 hrs.
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

      .select('MAX(voyage.userId)', 'userId')
      .addSelect('MAX(voyage.year)', 'year')
      .addSelect('MAX(voyage.id)', 'voyageId')
      .addSelect('MAX(voyage.voyageNumber)', 'voyageNumber')

      .addSelect('MAX(port.id)', 'portId')
      .addSelect('MAX(port.portNumber)', 'portNumber')
      .addSelect('MAX(port.departurePort)', 'departurePort')
      .addSelect('MAX(port.arrivalPort)', 'arrivalPort')

      .addSelect('MAX(daily_report.id)', 'dailyReportId')
      .addSelect(stringGroupBY, 'date')
      .addSelect('MAX(daily_report.hour)', 'hour')

      .addSelect('SUM(daily_report.steamingTime)', 'steamingTime')
      .addSelect('MAX(daily_report.activityPerformed)', 'activityPerformed')
      .addSelect('MAX(daily_report.speedStraction)', 'speedStraction')
      .addSelect('MAX(daily_report.observation)', 'observation')

      .addSelect('SUM(daily_report.distance)', 'distance')
      .addSelect('MAX(daily_report.beaufour)', 'beaufour')

      .addSelect('SUM(daily_report.mplaIfo)', 'mplaIfo')
      .addSelect('SUM(daily_report.auxIfo)', 'auxIfo')
      .addSelect('SUM(daily_report.boilerIfo)', 'boilerIfo')
      .addSelect('SUM(daily_report.otherIfo)', 'otherIfo')
      .addSelect('SUM(daily_report.bunkeringIfo)', 'bunkeringIfo')

      .addSelect('SUM(daily_report.mplaMgo)', 'mplaMgo')
      .addSelect('SUM(daily_report.auxMgo)', 'auxMgo')
      .addSelect('SUM(daily_report.boilerMgo)', 'boilerMgo')
      .addSelect('SUM(daily_report.ppMgo)', 'ppMgo')
      .addSelect('SUM(daily_report.giMgo)', 'giMgo')
      .addSelect('SUM(daily_report.otherMgo)', 'otherMgo')
      .addSelect('SUM(daily_report.bunkeringMgo)', 'bunkeringMgo')

      // UBICACION.
      .addSelect('MAX(daily_report.north_degree)', 'north_degree')
      .addSelect('MAX(daily_report.north_minutes)', 'north_minutes')
      .addSelect('MAX(daily_report.north_north_south)', 'north_north_south')
      // UBICACION
      .addSelect('MAX(daily_report.east_degree)', 'east_degree')
      .addSelect('MAX(daily_report.east_minutes)', 'east_minutes')
      .addSelect('MAX(daily_report.east_east_west)', 'east_east_west')
      .addSelect(subQuery => {
        return subQuery
          .select('SUM(daily_report2.steamingTime)', 'steamingTime')
          .from(DailyReport, 'daily_report2')
          .innerJoin('port', 'port2', 'port2.id = daily_report2.portId AND port2.status = 1 AND daily_report2.status = 1')
          .innerJoin('voyage', 'voyage2', 'voyage2.id = port2.voyageId AND voyage2.status = 1')

          .where('daily_report2.status = :status', { status: 1 })
          .andWhere('daily_report2.distance > :distance', { distance: 0 })
          .andWhere('port2.status = :status', { status: 1 })
          .andWhere('voyage2.status = :status', { status: 1 })
          .andWhere("strftime('%Y-%m-%d'," + stringGroupBY + ") = strftime('%Y-%m-%d'," + stringGroupBY_TwoSelect + ')')

          .andWhere('daily_report2.userId = :userId', { userId: userId })
          .limit(1);
      }, 'navigatedTime')

      .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })

      .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
        startDate: startDate,
      })
      .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
        endDate: endDate,
      })
      .groupBy("strftime('%Y-%m-%d'," + stringGroupBY + ')')
      .getRawMany()
      .then((result: any) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetReportVoyagePortDaily';
        return result;
      });
  }

  async GetReportBuroBerita(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]> {
    let stringGroupBY = "datetime('daily_report'.'date','+8.999999 hour')";
    let stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+8.999999 hour')";

    // si el usuario es TAUROGAS
    if (userId == 14) {
      stringGroupBY = "datetime('daily_report'.'date','+7.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+7.999999 hour')";
    }

    // si el usuario es Huntegas
    if (userId == 10) {
      stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
    }

    // CHAVIN NO SE PUDO

    // si el usuario es CARAL
    if (userId == 21) {
      stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
    }

    if (userId == 2) {
      stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
    }

    // buque camila
    if (userId == 15) {
      stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
    }

    // buque LEONARDO
    if (userId == 13) {
      stringGroupBY = "datetime('daily_report'.'date','+8.999999 hour')";
      stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+8.999999 hour')";
    }

    // Permite obtener en el tiempo de nagacion de las ultimas 24 hrs.
    return await this._dailyReportRepository
      .createQueryBuilder('daily_report')

      .select('MAX(voyage.userId)', 'userId')
      .addSelect('MAX(voyage.year)', 'year')
      .addSelect('MAX(voyage.id)', 'voyageId')
      .addSelect('MAX(voyage.voyageNumber)', 'voyageNumber')

      .addSelect('MAX(port.id)', 'portId')
      .addSelect('MAX(port.portNumber)', 'portNumber')
      .addSelect('MAX(port.departurePort)', 'departurePort')
      .addSelect('MAX(port.arrivalPort)', 'arrivalPort')

      .addSelect('MAX(daily_report.id)', 'dailyReportId')
      .addSelect(stringGroupBY, 'date')
      .addSelect('MAX(daily_report.hour)', 'hour')

      .addSelect('SUM(daily_report.steamingTime)', 'steamingTime')
      .addSelect('MAX(daily_report.activityPerformed)', 'activityPerformed')
      .addSelect('MAX(daily_report.speedStraction)', 'speedStraction')
      .addSelect('MAX(daily_report.observation)', 'observation')

      .addSelect('SUM(daily_report.distance)', 'distance')
      .addSelect('MAX(daily_report.beaufour)', 'beaufour')

      .addSelect('SUM(daily_report.mplaIfo)', 'mplaIfo')
      .addSelect('SUM(daily_report.auxIfo)', 'auxIfo')
      .addSelect('SUM(daily_report.boilerIfo)', 'boilerIfo')
      .addSelect('SUM(daily_report.otherIfo)', 'otherIfo')
      .addSelect('SUM(daily_report.bunkeringIfo)', 'bunkeringIfo')

      .addSelect('SUM(daily_report.mplaMgo)', 'mplaMgo')
      .addSelect('SUM(daily_report.auxMgo)', 'auxMgo')
      .addSelect('SUM(daily_report.boilerMgo)', 'boilerMgo')
      .addSelect('SUM(daily_report.ppMgo)', 'ppMgo')
      .addSelect('SUM(daily_report.giMgo)', 'giMgo')
      .addSelect('SUM(daily_report.otherMgo)', 'otherMgo')
      .addSelect('SUM(daily_report.bunkeringMgo)', 'bunkeringMgo')

      // UBICACION.
      .addSelect('MAX(daily_report.north_degree)', 'north_degree')
      .addSelect('MAX(daily_report.north_minutes)', 'north_minutes')
      .addSelect('MAX(daily_report.north_north_south)', 'north_north_south')
      // UBICACION
      .addSelect('MAX(daily_report.east_degree)', 'east_degree')
      .addSelect('MAX(daily_report.east_minutes)', 'east_minutes')
      .addSelect('MAX(daily_report.east_east_west)', 'east_east_west')
      .addSelect(subQuery => {
        return subQuery
          .select('SUM(daily_report2.steamingTime)', 'steamingTime')
          .from(DailyReport, 'daily_report2')
          .innerJoin('port', 'port2', 'port2.id = daily_report2.portId AND port2.status = 1 AND daily_report2.status = 1')
          .innerJoin('voyage', 'voyage2', 'voyage2.id = port2.voyageId AND voyage2.status = 1')

          .where('daily_report2.status = :status', { status: 1 })
          .andWhere('daily_report2.distance > :distance', { distance: 0 })
          .andWhere('port2.status = :status', { status: 1 })
          .andWhere('voyage2.status = :status', { status: 1 })
          .andWhere("strftime('%Y-%m-%d'," + stringGroupBY + ") = strftime('%Y-%m-%d'," + stringGroupBY_TwoSelect + ')')

          .andWhere('daily_report2.userId = :userId', { userId: userId })
          .limit(1);
      }, 'navigatedTime')

      .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
      .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')

      .where('daily_report.status = :status', { status: 1 })
      .andWhere('port.status = :status', { status: 1 })
      .andWhere('voyage.status = :status', { status: 1 })

      .andWhere('daily_report.userId = :userId', { userId: userId })

      .andWhere('datetime(daily_report.date) >= datetime(:startDate)', {
        startDate: startDate,
      })
      .andWhere('datetime(daily_report.date) <= datetime(:endDate)', {
        endDate: endDate,
      })
      .groupBy("strftime('%Y-%m-%d'," + stringGroupBY + ')')
      .getRawMany()
      .then((result: any) => {
        // Verificamos que el resultado no este vacio.
        if (!result) throw 'ERROR GetReportVoyagePortDaily';
        return result;
      });
  }

  async SaveList(MappingPorts: Mapping[], importDailyReport: DailyReport[]) {
    // Mapping
    let mappingDailyReports: Mapping[] = [];
    // Filtramos los datos que faltan aggregar y actualizar.
    const addDailyReports = importDailyReport.filter((dailyReport: DailyReport) => dailyReport.SyncStatus == 'added');
    const updateDailyReports = importDailyReport.filter((dailyReport: DailyReport) => dailyReport.SyncStatus == 'updated');
    const deleteDailyReports = importDailyReport.filter((dailyReport: DailyReport) => dailyReport.SyncStatus == 'deleted');

    let listDeReportesRegistrados = [];

    for await (const addDailyReport of addDailyReports) {
      let searchMappingPort = searchKey(MappingPorts, addDailyReport.portId);

      // Armamos al nuevo aceite
      let newDailyReport = new DailyReport();

      delete newDailyReport.id;
      newDailyReport.userId = addDailyReport.userId;
      newDailyReport.portId = addDailyReport.portId;
      if (searchMappingPort) {
        newDailyReport.portId = searchMappingPort.value;
      }

      newDailyReport.north_degree = addDailyReport.north_degree;
      newDailyReport.north_minutes = addDailyReport.north_minutes;
      newDailyReport.north_north_south = addDailyReport.north_north_south;
      newDailyReport.east_degree = addDailyReport.east_degree;
      newDailyReport.east_minutes = addDailyReport.east_minutes;
      newDailyReport.east_east_west = addDailyReport.east_east_west;

      newDailyReport.activityPerformed = addDailyReport.activityPerformed;
      newDailyReport.typeActivityPerformed = addDailyReport.typeActivityPerformed;
      newDailyReport.nextActivityPerformed = addDailyReport.nextActivityPerformed;

      newDailyReport.speedStraction = addDailyReport.speedStraction;
      console.log('ADD DAILY');
      console.log(addDailyReport.date);

      newDailyReport.date = addDailyReport.date;
      newDailyReport.hour = addDailyReport.hour;
      newDailyReport.bunkeringIfo = addDailyReport.bunkeringIfo;
      newDailyReport.bunkeringMgo = addDailyReport.bunkeringMgo;

      newDailyReport.mplaIfo = addDailyReport.mplaIfo;
      newDailyReport.auxIfo = addDailyReport.auxIfo;
      newDailyReport.boilerIfo = addDailyReport.boilerIfo;
      newDailyReport.otherIfo = addDailyReport.otherIfo;

      newDailyReport.mplaMgo = addDailyReport.mplaMgo;
      newDailyReport.auxMgo = addDailyReport.auxMgo;
      newDailyReport.boilerMgo = addDailyReport.boilerMgo;
      newDailyReport.ppMgo = addDailyReport.ppMgo;
      newDailyReport.giMgo = addDailyReport.giMgo;
      newDailyReport.otherMgo = addDailyReport.otherMgo;

      newDailyReport.steamingTime = addDailyReport.steamingTime;
      newDailyReport.distance = addDailyReport.distance;
      newDailyReport.beaufour = addDailyReport.beaufour;
      newDailyReport.observation = addDailyReport.observation;

      // Auditoria
      newDailyReport.userIdCreated = addDailyReport.userIdCreated;
      newDailyReport.dateCreated = GetDate();
      delete newDailyReport.userIdUpdated;
      delete newDailyReport.dateUpdated;
      newDailyReport.status = Boolean(addDailyReport.status);

      // Registramos grupo de aceite
      let registers = await this.Create(newDailyReport);

      // solo si esta activo guardaremos su Id para proximas evaluaciones
      if (newDailyReport.status) {
        listDeReportesRegistrados.push(registers.id);
      }
      // Lo agregamos al mapping
      mappingDailyReports.push(new Mapping(addDailyReport.id, registers.id));
    }

    for await (const dailyReport of updateDailyReports) {
      let searchMappingPort = searchKey(MappingPorts, dailyReport.portId);

      let updateDailyReport = new DailyReport();

      updateDailyReport.id = dailyReport.id;
      updateDailyReport.userId = dailyReport.userId;

      updateDailyReport.portId = dailyReport.portId;
      if (searchMappingPort) {
        updateDailyReport.portId = searchMappingPort.value;
      }

      updateDailyReport.north_degree = dailyReport.north_degree;
      updateDailyReport.north_minutes = dailyReport.north_minutes;
      updateDailyReport.north_north_south = dailyReport.north_north_south;
      updateDailyReport.east_degree = dailyReport.east_degree;
      updateDailyReport.east_minutes = dailyReport.east_minutes;
      updateDailyReport.east_east_west = dailyReport.east_east_west;

      updateDailyReport.activityPerformed = dailyReport.activityPerformed;
      updateDailyReport.typeActivityPerformed = dailyReport.typeActivityPerformed;
      updateDailyReport.nextActivityPerformed = dailyReport.nextActivityPerformed;

      updateDailyReport.speedStraction = dailyReport.speedStraction;

      updateDailyReport.date = dailyReport.date;

      console.log('updateDailyReport');
      console.log(dailyReport.date);
      updateDailyReport.hour = dailyReport.hour;
      updateDailyReport.bunkeringIfo = dailyReport.bunkeringIfo;
      updateDailyReport.bunkeringMgo = dailyReport.bunkeringMgo;

      updateDailyReport.mplaIfo = dailyReport.mplaIfo;
      updateDailyReport.auxIfo = dailyReport.auxIfo;
      updateDailyReport.boilerIfo = dailyReport.boilerIfo;
      updateDailyReport.otherIfo = dailyReport.otherIfo;

      updateDailyReport.mplaMgo = dailyReport.mplaMgo;
      updateDailyReport.auxMgo = dailyReport.auxMgo;
      updateDailyReport.boilerMgo = dailyReport.boilerMgo;
      updateDailyReport.ppMgo = dailyReport.ppMgo;
      updateDailyReport.giMgo = dailyReport.giMgo;
      updateDailyReport.otherMgo = dailyReport.otherMgo;

      updateDailyReport.steamingTime = dailyReport.steamingTime;
      updateDailyReport.distance = dailyReport.distance;
      updateDailyReport.beaufour = dailyReport.beaufour;
      updateDailyReport.observation = dailyReport.observation;

      // Auditoria
      updateDailyReport.userIdCreated = dailyReport.userIdCreated;
      updateDailyReport.dateCreated = dailyReport.dateCreated;
      updateDailyReport.userIdUpdated = dailyReport.userIdUpdated;
      updateDailyReport.dateUpdated = dailyReport.dateUpdated;
      updateDailyReport.status = Boolean(dailyReport.status);

      await this._dailyReportRepository.save(updateDailyReport);

      if (updateDailyReport.status) {
        listDeReportesRegistrados.push(updateDailyReport.id);
      }
    }

    for await (let dailyReport of deleteDailyReports) {
      let searchMappingPort = searchKey(MappingPorts, dailyReport.portId);

      let deletePortEntity = new DailyReport();

      deletePortEntity.id = dailyReport.id;
      deletePortEntity.userId = dailyReport.userId;

      deletePortEntity.portId = dailyReport.portId;
      if (searchMappingPort) {
        deletePortEntity.portId = searchMappingPort.value;
      }

      deletePortEntity.north_degree = dailyReport.north_degree;
      deletePortEntity.north_minutes = dailyReport.north_minutes;
      deletePortEntity.north_north_south = dailyReport.north_north_south;
      deletePortEntity.east_degree = dailyReport.east_degree;
      deletePortEntity.east_minutes = dailyReport.east_minutes;
      deletePortEntity.east_east_west = dailyReport.east_east_west;

      deletePortEntity.activityPerformed = dailyReport.activityPerformed;
      deletePortEntity.typeActivityPerformed = dailyReport.typeActivityPerformed;
      deletePortEntity.nextActivityPerformed = dailyReport.nextActivityPerformed;

      deletePortEntity.speedStraction = dailyReport.speedStraction;

      deletePortEntity.date = dailyReport.date;
      deletePortEntity.hour = dailyReport.hour;
      deletePortEntity.bunkeringIfo = dailyReport.bunkeringIfo;
      deletePortEntity.bunkeringMgo = dailyReport.bunkeringMgo;

      deletePortEntity.mplaIfo = dailyReport.mplaIfo;
      deletePortEntity.auxIfo = dailyReport.auxIfo;
      deletePortEntity.boilerIfo = dailyReport.boilerIfo;
      deletePortEntity.otherIfo = dailyReport.otherIfo;

      deletePortEntity.mplaMgo = dailyReport.mplaMgo;
      deletePortEntity.auxMgo = dailyReport.auxMgo;
      deletePortEntity.boilerMgo = dailyReport.boilerMgo;
      deletePortEntity.ppMgo = dailyReport.ppMgo;
      deletePortEntity.giMgo = dailyReport.giMgo;
      deletePortEntity.otherMgo = dailyReport.otherMgo;

      deletePortEntity.steamingTime = dailyReport.steamingTime;
      deletePortEntity.distance = dailyReport.distance;
      deletePortEntity.beaufour = dailyReport.beaufour;
      deletePortEntity.observation = dailyReport.observation;

      // Auditoria.
      deletePortEntity.userIdCreated = dailyReport.userIdCreated;
      deletePortEntity.dateCreated = dailyReport.dateCreated;
      deletePortEntity.userIdUpdated = dailyReport.userIdUpdated;
      deletePortEntity.dateUpdated = dailyReport.dateUpdated;
      deletePortEntity.status = Boolean(dailyReport.status);

      await this._dailyReportRepository.save(deletePortEntity);
    }

    return mappingDailyReports;
  }
}

export interface SaveListDailyReport {
  mappingReport: Mapping[];
  registeredReportsList: DailyReport[];
}
