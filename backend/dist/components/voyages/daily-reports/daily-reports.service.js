"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const daily_report_entity_1 = require("../../../models/daily-report.entity");
const typeorm_2 = require("typeorm");
const server_config_1 = require("../../../config/server.config");
const promises_assets_1 = require("../../../assets/promises.assets");
const moment_assets_1 = require("../../../assets/moment.assets");
const mappingKeys_1 = require("../../../assets/mappingKeys");
let DailyReportsService = class DailyReportsService {
    constructor(_dailyReportRepository) {
        this._dailyReportRepository = _dailyReportRepository;
    }
    async Create(dailyReport) {
        return (0, promises_assets_1.DummyPromise)().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._dailyReportRepository.query(` EXEC SP_CreateNewDailyReport @userId = ${dailyReport.userId} ,@portId = ${dailyReport.portId} ,@activityPerformed = '${dailyReport.activityPerformed}' ,@speedStraction = '${dailyReport.speedStraction}' ,@date ='${dailyReport.date}' ,@hour = '${dailyReport.hour}' ,@bunkeringIfo = ${dailyReport.bunkeringIfo} ,@bunkeringMgo = ${dailyReport.bunkeringMgo} ,@mplaIfo  = ${dailyReport.mplaIfo} ,@auxIfo  = ${dailyReport.auxIfo} ,@boilerIfo  = ${dailyReport.boilerIfo} ,@otherIfo = ${dailyReport.otherIfo} ,@mplaMgo = ${dailyReport.mplaMgo} ,@auxMgo   = ${dailyReport.auxMgo} ,@boilerMgo   = ${dailyReport.boilerMgo} ,@ppMgo = ${dailyReport.ppMgo} ,@giMgo = ${dailyReport.giMgo} ,@otherMgo  = ${dailyReport.otherMgo} ,@steamingTime  = ${dailyReport.steamingTime} ,@distance =${dailyReport.distance} ,@beaufour = '${dailyReport.beaufour}' ,@observation ='${dailyReport.observation}'  ,@userIdCreated = ${dailyReport.userIdCreated} ,@dateCreated = '${dailyReport.dateCreated}' ,@userIdUpdated = ${dailyReport.userIdUpdated || 0} ,@dateUpdated = '${dailyReport.dateUpdated || null}' ,@status = ${dailyReport.status}
                    `);
            }
            else {
                return this._dailyReportRepository.save(dailyReport);
            }
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el viaje en la BD.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el viaje en la BD.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        }).catch(err => {
            throw err;
        });
    }
    async Get(id) {
        return (0, promises_assets_1.DummyPromise)().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._dailyReportRepository.query(`
                     EXEC SP_BuscarReportePorId 
                    @dailyReportId = ${id} 
                    `);
            }
            else {
                return this._dailyReportRepository.find({
                    where: [{
                            id: id,
                        }]
                });
            }
        }).then((resultFind) => {
            if (!resultFind)
                throw new Error('does_not_exist');
            if (resultFind && resultFind.length == 0)
                throw new Error('does_not_exist');
            let returnDailyReport = resultFind[0];
            return returnDailyReport;
        });
    }
    async Gets(dailyReport) {
        return await this._dailyReportRepository.find({
            where: [
                {
                    userId: (0, typeorm_2.Like)('%' + (dailyReport.userId || '') + '%'),
                    portId: (0, typeorm_2.Like)('%' + dailyReport.portId + '%'),
                    status: (0, typeorm_2.Not)(false)
                }
            ],
            order: {
                date: 'ASC',
                hour: 'ASC'
            },
        }).then((result) => {
            return result;
        });
    }
    async Update(dailyReport) {
        return (0, promises_assets_1.DummyPromise)().then(result => {
            return this.Get(dailyReport.id);
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('does_not_exist');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._dailyReportRepository.query(`
                    EXEC SP_UpdateDailyReport  
                        @id = ${dailyReport.userId} 
                        ,@userId = ${dailyReport.userId} 
                        ,@portId = ${dailyReport.portId} 
                        ,@activityPerformed = '${dailyReport.activityPerformed}' 
                        ,@speedStraction = '${dailyReport.speedStraction}' 
                        ,@date ='${dailyReport.date ? (0, moment_assets_1.FormatDateUTCToDateHour)(dailyReport.date) : ''}' 
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
            }
            else {
                return this._dailyReportRepository.update(dailyReport.id, dailyReport);
            }
        }).then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('ERROR_TYPEORM_UPDATE_PORT');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
            }
            return dailyReport;
        });
    }
    async Delete(dailyReport, usuarioDelete) {
        return (0, promises_assets_1.DummyPromise)().then(result => {
            return this.Get(dailyReport.id);
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('does_not_exist');
            resultFind.userIdUpdated = usuarioDelete;
            resultFind.dateUpdated = (0, moment_assets_1.GetDate)();
            resultFind.status = false;
            return this.Update(resultFind);
        }).then(resultSave => {
            if (!resultSave)
                throw new Error('ERROR_TYPEORM_UPDATE_PORT');
            return dailyReport;
        });
    }
    async GetROBByUser(userId) {
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
            .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
            .addSelect(' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ', 'total_mgo')
            .addSelect(' SUM( daily_report.bunkeringIfo )', "total_bunkering_ifo")
            .addSelect(' SUM( daily_report.bunkeringMgo )', "total_bunkering_mgo")
            .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('daily_report.userId = :userId', { userId: userId })
            .getRawOne()
            .then((result) => {
            let getROBByUser = {};
            getROBByUser.total_ifo = result.total_ifo || 0;
            getROBByUser.total_mgo = result.total_mgo || 0;
            getROBByUser.total_bunkering_ifo = result.total_bunkering_ifo || 0;
            getROBByUser.total_bunkering_mgo = result.total_bunkering_mgo || 0;
            return getROBByUser;
        });
    }
    async GetStartEndROByFilterDate(startDate, endDate, userId) {
        let StartEndROB = [];
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
            .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
            .addSelect(' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ', 'total_mgo')
            .addSelect(' SUM( daily_report.bunkeringIfo ) ', "total_bunkering_ifo")
            .addSelect(' SUM( daily_report.bunkeringMgo ) ', "total_bunkering_mgo")
            .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('datetime(daily_report.date) < datetime(:startDate)', { startDate: startDate })
            .getRawOne()
            .then((result) => {
            if (!result)
                throw 'ERROR GetROBByUser';
            let getStartROB = {};
            getStartROB.total_ifo = result.total_ifo || 0;
            getStartROB.total_mgo = result.total_mgo || 0;
            getStartROB.total_bunkering_ifo = result.total_bunkering_ifo || 0;
            getStartROB.total_bunkering_mgo = result.total_bunkering_mgo || 0;
            StartEndROB.push(getStartROB);
            return this._dailyReportRepository.createQueryBuilder('daily_report')
                .select(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', 'total_ifo')
                .addSelect(' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ', 'total_mgo')
                .addSelect(' SUM( daily_report.bunkeringIfo )', "total_bunkering_ifo")
                .addSelect(' SUM( daily_report.bunkeringMgo )', "total_bunkering_mgo")
                .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
                .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
                .where('daily_report.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })
                .andWhere('daily_report.userId = :userId', { userId: userId })
                .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
                .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
                .getRawOne();
        }).then((result) => {
            if (!result)
                throw 'ERROR GetEndROBByUser';
            let getEndROBByUser = {};
            getEndROBByUser.total_ifo = result.total_ifo || 0;
            getEndROBByUser.total_mgo = result.total_mgo || 0;
            getEndROBByUser.total_bunkering_ifo = result.total_bunkering_ifo || 0;
            getEndROBByUser.total_bunkering_mgo = result.total_bunkering_mgo || 0;
            StartEndROB.push(getEndROBByUser);
            return StartEndROB;
        });
    }
    async GetBunkeringByUserIFO(userId) {
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
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
            .then((result) => {
            return result;
        });
    }
    async GetBunkeringByUserMGO(userId) {
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
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
            .then((result) => {
            return result;
        });
    }
    async GetReportVoyagePortDaily(userId, startDate, endDate, filterByVoyage) {
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
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
            .addSelect('daily_report.north_degree', 'north_degree')
            .addSelect('daily_report.north_minutes', 'north_minutes')
            .addSelect('daily_report.north_north_south', 'north_north_south')
            .addSelect('daily_report.east_degree', 'east_degree')
            .addSelect('daily_report.east_minutes', 'east_minutes')
            .addSelect('daily_report.east_east_west', 'east_east_west')
            .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('(( datetime(daily_report.date) >= datetime(:startDate) AND datetime(daily_report.date) <= datetime(:endDate) ) OR voyage.id = :voyageId)', { startDate: startDate, endDate: endDate, voyageId: filterByVoyage })
            .orderBy('daily_report.date', 'ASC')
            .getRawMany()
            .then((result) => {
            if (!result)
                throw 'ERROR GetReportVoyagePortDaily';
            return result;
        });
    }
    async GetReportByUser(userId) {
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
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
            .then((result) => {
            if (!result)
                throw 'ERROR GetReportVoyagePortDaily';
            return result;
        });
    }
    async GetInfoVoyageROBAndBunkeringByBuqueAndDate(startDate, endDate, userId) {
        let firstResultInfoVoyage = [];
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
            .select(' voyage.id ', 'voyageId')
            .addSelect(' voyage.voyageNumber ', 'voyageNumber')
            .addSelect(' MIN(daily_report.date) ', "minDate")
            .addSelect(' MAX(daily_report.date) ', "maxDate")
            .addSelect(' SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) ', "totalIFO")
            .addSelect(' SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) ', "totalMGO")
            .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
            .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
            .groupBy('voyage.id, voyage.voyageNumber')
            .getRawMany()
            .then((result) => {
            if (!result)
                throw 'ERROR GetROBByUser';
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
                .innerJoinAndSelect('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
                .innerJoinAndSelect('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
                .where('daily_report.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })
                .andWhere('daily_report.userId = :userId', { userId: userId })
                .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
                .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
                .andWhere('daily_report.bunkeringIfo > :bunkeringIFO OR daily_report.bunkeringMgo > :bunkeringMGO', { bunkeringIFO: 0, bunkeringMGO: 0 })
                .getRawMany();
        })
            .then((listInfoBunkering) => {
            let listGetInfoVoyageROBBunkering = [];
            firstResultInfoVoyage.forEach((itemInfoVoyage) => {
                let getInfoVoyageROBBunkering = new daily_report_entity_1.GetInfoVoyageROBBunkering();
                getInfoVoyageROBBunkering.voyageId = itemInfoVoyage.voyageId;
                getInfoVoyageROBBunkering.voyageNumber = itemInfoVoyage.voyageNumber;
                getInfoVoyageROBBunkering.minDate = itemInfoVoyage.minDate;
                getInfoVoyageROBBunkering.maxDate = itemInfoVoyage.maxDate;
                getInfoVoyageROBBunkering.totalIFO = itemInfoVoyage.totalIFO;
                getInfoVoyageROBBunkering.totalMGO = itemInfoVoyage.totalMGO;
                let filterInfoBunkering = listInfoBunkering.filter((item) => item.voyageId === itemInfoVoyage.voyageId);
                filterInfoBunkering.forEach(item => {
                    let getInfoBunkering = new daily_report_entity_1.GetInfoBunkering();
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
    async GetTotalByActivityFilterByUserIdAndDateAndType(userId, startDate, endDate, filterBy) {
        let startDateRegister = startDate == 'null' ? null : startDate;
        let endDateRegister = endDate == 'null' ? null : endDate;
        let cantUltimosDias = 40;
        return await (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (!startDateRegister && !endDateRegister) {
                return this._dailyReportRepository.createQueryBuilder('daily_report')
                    .addSelect('daily_report.date', 'date')
                    .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
                    .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
                    .where('daily_report.status = :status', { status: 1 })
                    .andWhere('voyage.status = :status', { status: 1 })
                    .andWhere('port.status = :status', { status: 1 })
                    .andWhere('daily_report.userId = :userId', { userId: userId })
                    .andWhere('port.userId = :userId', { userId: userId })
                    .andWhere('voyage.userId = :userId', { userId: userId })
                    .orderBy('daily_report.date', 'DESC')
                    .limit(1)
                    .getRawMany();
            }
            else {
                return null;
            }
        }).then(resultFind => {
            if (resultFind) {
                endDateRegister = resultFind[0].date;
                startDateRegister = (0, moment_assets_1.FormatDateSumDays)(endDateRegister, cantUltimosDias);
            }
            return true;
        }).then(result => {
            let addSelectDinamic = filterBy === 'MONTHS' ? "strftime('%Y-%m', 'daily_report'.'date')" :
                filterBy === 'DAYS' ? "strftime('%Y-%m-%d', 'daily_report'.'date')" :
                    'daily_report.date';
            let groupByDinamic = filterBy === 'VOYAGES' ? 'activityPerformed, voyage.id' :
                filterBy === 'PORTS' ? 'activityPerformed, voyage.id, port.id' :
                    filterBy === 'MONTHS' ? "activityPerformed, strftime('%Y-%m', 'daily_report'.'date')" :
                        filterBy === 'DAYS' ? "activityPerformed, strftime('%Y-%m-%d', 'daily_report'.'date')" :
                            'activityPerformed, voyage.year, voyage.id';
            let orderBy = filterBy === 'VOYAGES' ? 'voyage.id' :
                filterBy === 'PORTS' ? 'voyage.id, port.id' :
                    filterBy === 'MONTHS' ? "voyage.id,  strftime('%Y-%m', 'daily_report'.'date')" :
                        filterBy === 'DAYS' ? "'daily_report'.'date'" :
                            'voyage.id';
            return this._dailyReportRepository.createQueryBuilder('daily_report')
                .select('voyage.userId', 'userId')
                .addSelect('voyage.year', 'year')
                .addSelect('voyage.id', 'voyageId')
                .addSelect('voyage.voyageNumber', 'voyageNumber')
                .addSelect('port.id', 'portId')
                .addSelect('port.portNumber', 'portNumber')
                .addSelect('min(port.departurePort)', 'departurePort')
                .addSelect('max(port.arrivalPort)', 'arrivalPort')
                .addSelect('daily_report.id', 'dailyReportId')
                .addSelect(addSelectDinamic, 'date')
                .addSelect('min(daily_report.date)', 'dayStart')
                .addSelect('max(daily_report.date)', 'dayEnd')
                .addSelect('daily_report.hour', 'hour')
                .addSelect('daily_report.activityPerformed', 'activityPerformed')
                .addSelect('daily_report.speedStraction', 'speedStraction')
                .addSelect('daily_report.observation', 'observation')
                .addSelect('COUNT(*)', 'countReports')
                .addSelect('COUNT(DISTINCT "port"."id")', 'countPorts')
                .addSelect('SUM(daily_report.steamingTime)', 'steamingTime')
                .addSelect('SUM(daily_report.distance)', 'distance')
                .addSelect('daily_report.beaufour', 'beaufour')
                .addSelect('SUM(daily_report.mplaIfo)', 'mplaIfo')
                .addSelect('SUM(daily_report.auxIfo)', 'auxIfo')
                .addSelect('SUM(daily_report.boilerIfo)', 'boilerIfo')
                .addSelect('SUM(daily_report.otherIfo)', 'otherIfo')
                .addSelect('SUM(daily_report.bunkeringIfo)', 'bunkeringIfo')
                .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
                .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
                .where('daily_report.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('daily_report.userId = :userId', { userId: userId })
                .andWhere('port.userId = :userId', { userId: userId })
                .andWhere('voyage.userId = :userId', { userId: userId })
                .andWhere(' (daily_report.mplaIfo > :mplaIfo OR daily_report.auxIfo > :auxIfo OR daily_report.boilerIfo > :boilerIfo OR daily_report.otherIfo > :otherIfo OR daily_report.bunkeringIfo > :bunkeringIfo )', { mplaIfo: 0, auxIfo: 0, boilerIfo: 0, otherIfo: 0, bunkeringIfo: 0 })
                .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDateRegister })
                .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDateRegister })
                .groupBy(groupByDinamic)
                .orderBy(orderBy)
                .getRawMany();
        }).then((result) => {
            if (!result)
                throw 'ERROR GetReportVoyagePortDaily';
            return result;
        });
    }
    async GetTotalConsumptionByActivityFilterByUserIdAndDateAndType(userId, startDate, endDate, typeSummary) {
        let startDateRegister = startDate == 'null' ? null : startDate;
        let endDateRegister = endDate == 'null' ? null : endDate;
        let cantUltimosDias = 40;
        let result_IFO_AND_MGO = new daily_report_entity_1.InfoReport_IFO_AND_MGO();
        return await (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (!startDateRegister && !endDateRegister) {
                return this._dailyReportRepository.createQueryBuilder('daily_report')
                    .addSelect('daily_report.date', 'date')
                    .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
                    .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
                    .where('daily_report.status = :status', { status: 1 })
                    .andWhere('voyage.status = :status', { status: 1 })
                    .andWhere('port.status = :status', { status: 1 })
                    .andWhere('daily_report.userId = :userId', { userId: userId })
                    .andWhere('port.userId = :userId', { userId: userId })
                    .andWhere('voyage.userId = :userId', { userId: userId })
                    .orderBy('daily_report.date', 'DESC')
                    .limit(1)
                    .getRawMany();
            }
            else {
                return null;
            }
        }).then(resultFind => {
            if (resultFind) {
                endDateRegister = resultFind[0].date;
                startDateRegister = (0, moment_assets_1.FormatDateSumDays)(endDateRegister, cantUltimosDias);
            }
            return true;
        }).then(result => {
            let addSelectDinamic = typeSummary === 'MONTHS' ? "strftime('%Y-%m', 'daily_report'.'date')" :
                typeSummary === 'DAYS' ? "strftime('%Y-%m-%d', 'daily_report'.'date')" :
                    'daily_report.date';
            let groupByDinamic = typeSummary === 'VOYAGES' ? 'activityPerformed, voyage.id' :
                typeSummary === 'PORTS' ? 'activityPerformed, voyage.id, port.id' :
                    typeSummary === 'MONTHS' ? "activityPerformed, strftime('%Y-%m', 'daily_report'.'date')" :
                        typeSummary === 'DAYS' ? "activityPerformed, strftime('%Y-%m-%d', 'daily_report'.'date')" :
                            'activityPerformed, voyage.year, voyage.id';
            let orderBy = typeSummary === 'VOYAGES' ? 'voyage.id' :
                typeSummary === 'PORTS' ? 'voyage.id, port.id' :
                    typeSummary === 'MONTHS' ? "voyage.id,  strftime('%Y-%m', 'daily_report'.'date')" :
                        typeSummary === 'DAYS' ? "'daily_report'.'date'" :
                            'voyage.id';
            return this._dailyReportRepository.createQueryBuilder('daily_report')
                .select('voyage.userId', 'userId')
                .addSelect('voyage.year', 'year')
                .addSelect('voyage.id', 'voyageId')
                .addSelect('voyage.voyageNumber', 'voyageNumber')
                .addSelect('port.id', 'portId')
                .addSelect('port.portNumber', 'portNumber')
                .addSelect('min(port.departurePort)', 'departurePort')
                .addSelect('max(port.arrivalPort)', 'arrivalPort')
                .addSelect('daily_report.id', 'dailyReportId')
                .addSelect(addSelectDinamic, 'date')
                .addSelect('min(daily_report.date)', 'dayStart')
                .addSelect('max(daily_report.date)', 'dayEnd')
                .addSelect('daily_report.hour', 'hour')
                .addSelect('daily_report.activityPerformed', 'activityPerformed')
                .addSelect('daily_report.speedStraction', 'speedStraction')
                .addSelect('daily_report.observation', 'observation')
                .addSelect('COUNT(*)', 'countReports')
                .addSelect('COUNT(DISTINCT "port"."id")', 'countPorts')
                .addSelect('SUM(daily_report.steamingTime)', 'steamingTime')
                .addSelect('SUM(daily_report.distance)', 'distance')
                .addSelect('daily_report.beaufour', 'beaufour')
                .addSelect('SUM(daily_report.mplaIfo)', 'mplaIfo')
                .addSelect('SUM(daily_report.auxIfo)', 'auxIfo')
                .addSelect('SUM(daily_report.boilerIfo)', 'boilerIfo')
                .addSelect('SUM(daily_report.otherIfo)', 'otherIfo')
                .addSelect('SUM(daily_report.bunkeringIfo)', 'bunkeringIfo')
                .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
                .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
                .where('daily_report.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('daily_report.userId = :userId', { userId: userId })
                .andWhere('port.userId = :userId', { userId: userId })
                .andWhere('voyage.userId = :userId', { userId: userId })
                .andWhere('(daily_report.mplaIfo > :mplaIfo OR daily_report.auxIfo > :auxIfo OR daily_report.boilerIfo > :boilerIfo OR daily_report.otherIfo > :otherIfo OR daily_report.bunkeringIfo > :bunkeringIfo )', { mplaIfo: 0, auxIfo: 0, boilerIfo: 0, otherIfo: 0, bunkeringIfo: 0 })
                .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDateRegister })
                .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDateRegister })
                .groupBy(groupByDinamic)
                .orderBy(orderBy)
                .getRawMany();
        }).then((result) => {
            if (!result)
                throw 'ERROR GetReportVoyagePortDaily';
            result_IFO_AND_MGO.ifo = result;
            let addSelectDinamic = typeSummary === 'MONTHS' ? "strftime('%Y-%m', 'daily_report'.'date')" :
                typeSummary === 'DAYS' ? "strftime('%Y-%m-%d', 'daily_report'.'date')" :
                    'daily_report.date';
            let groupByDinamic = typeSummary === 'VOYAGES' ? 'activityPerformed, voyage.id' :
                typeSummary === 'PORTS' ? 'activityPerformed, voyage.id, port.id' :
                    typeSummary === 'MONTHS' ? "activityPerformed, strftime('%Y-%m', 'daily_report'.'date')" :
                        typeSummary === 'DAYS' ? "activityPerformed, strftime('%Y-%m-%d', 'daily_report'.'date')" :
                            'activityPerformed, voyage.year, voyage.id';
            let orderBy = typeSummary === 'VOYAGES' ? 'voyage.id' :
                typeSummary === 'PORTS' ? 'voyage.id, port.id' :
                    typeSummary === 'MONTHS' ? "voyage.id,  strftime('%Y-%m', 'daily_report'.'date')" :
                        typeSummary === 'DAYS' ? "'daily_report'.'date'" :
                            'voyage.id';
            return this._dailyReportRepository.createQueryBuilder('daily_report')
                .select('voyage.userId', 'userId')
                .addSelect('voyage.year', 'year')
                .addSelect('voyage.id', 'voyageId')
                .addSelect('voyage.voyageNumber', 'voyageNumber')
                .addSelect('port.id', 'portId')
                .addSelect('port.portNumber', 'portNumber')
                .addSelect('min(port.departurePort)', 'departurePort')
                .addSelect('max(port.arrivalPort)', 'arrivalPort')
                .addSelect('daily_report.id', 'dailyReportId')
                .addSelect(addSelectDinamic, 'date')
                .addSelect('min(daily_report.date)', 'dayStart')
                .addSelect('max(daily_report.date)', 'dayEnd')
                .addSelect('daily_report.hour', 'hour')
                .addSelect('daily_report.activityPerformed', 'activityPerformed')
                .addSelect('daily_report.speedStraction', 'speedStraction')
                .addSelect('daily_report.observation', 'observation')
                .addSelect('COUNT(*)', 'countReports')
                .addSelect('COUNT(DISTINCT "port"."id")', 'countPorts')
                .addSelect('SUM(daily_report.steamingTime)', 'steamingTime')
                .addSelect('SUM(daily_report.distance)', 'distance')
                .addSelect('daily_report.beaufour', 'beaufour')
                .addSelect('SUM(daily_report.mplaMgo)', 'mplaMgo')
                .addSelect('SUM(daily_report.auxMgo)', 'auxMgo')
                .addSelect('SUM(daily_report.boilerMgo)', 'boilerMgo')
                .addSelect('SUM(daily_report.giMgo)', 'giMgo')
                .addSelect('SUM(daily_report.ppMgo)', 'ppMgo')
                .addSelect('SUM(daily_report.otherMgo)', 'otherMgo')
                .addSelect('SUM(daily_report.bunkeringMgo)', 'bunkeringMgo')
                .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
                .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
                .where('daily_report.status = :status', { status: 1 })
                .andWhere('voyage.status = :status', { status: 1 })
                .andWhere('port.status = :status', { status: 1 })
                .andWhere('daily_report.userId = :userId', { userId: userId })
                .andWhere('port.userId = :userId', { userId: userId })
                .andWhere('voyage.userId = :userId', { userId: userId })
                .andWhere('(daily_report.mplaMgo > :mplaMgo OR daily_report.auxMgo > :auxMgo OR daily_report.boilerMgo > :boilerMgo OR daily_report.giMgo > :giMgo OR daily_report.ppMgo > :ppMgo OR daily_report.otherMgo > :otherMgo OR daily_report.bunkeringMgo > :bunkeringMgo )', { mplaMgo: 0, auxMgo: 0, boilerMgo: 0, giMgo: 0, ppMgo: 0, otherMgo: 0, bunkeringMgo: 0 })
                .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDateRegister })
                .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDateRegister })
                .groupBy(groupByDinamic)
                .orderBy(orderBy)
                .getRawMany();
        }).then((result) => {
            if (!result)
                throw 'ERROR GetReportVoyagePortDaily';
            result_IFO_AND_MGO.mgo = result;
            return result_IFO_AND_MGO;
        });
    }
    async GetReportDNVByUser(userId, startDate, endDate) {
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
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
            .addSelect('MAX(daily_report.north_degree)', 'north_degree')
            .addSelect('MAX(daily_report.north_minutes)', 'north_minutes')
            .addSelect('MAX(daily_report.north_north_south)', 'north_north_south')
            .addSelect('MAX(daily_report.east_degree)', 'east_degree')
            .addSelect('MAX(daily_report.east_minutes)', 'east_minutes')
            .addSelect('MAX(daily_report.east_east_west)', 'east_east_west')
            .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
            .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
            .groupBy("strftime('%Y-%m-%d', 'daily_report'.'date')")
            .getRawMany()
            .then((result) => {
            if (!result)
                throw 'ERROR GetReportVoyagePortDaily';
            return result;
        });
    }
    async GetReportDNVByUserNOON(userId, startDate, endDate) {
        let stringGroupBY = "datetime('daily_report'.'date','+8.999999 hour')";
        let stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+8.999999 hour')";
        if (userId == 7) {
            stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
        }
        if (userId == 14) {
            stringGroupBY = "datetime('daily_report'.'date','+7.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+7.999999 hour')";
        }
        if (userId == 10) {
            stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
        }
        if (userId == 21) {
            stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
        }
        if (userId == 2) {
            stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
        }
        if (userId == 15) {
            stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
        }
        if (userId == 13) {
            stringGroupBY = "datetime('daily_report'.'date','+8.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+8.999999 hour')";
        }
        if (userId == 27) {
            stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
        }
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
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
            .addSelect('MAX(daily_report.north_degree)', 'north_degree')
            .addSelect('MAX(daily_report.north_minutes)', 'north_minutes')
            .addSelect('MAX(daily_report.north_north_south)', 'north_north_south')
            .addSelect('MAX(daily_report.east_degree)', 'east_degree')
            .addSelect('MAX(daily_report.east_minutes)', 'east_minutes')
            .addSelect('MAX(daily_report.east_east_west)', 'east_east_west')
            .addSelect((subQuery) => {
            return subQuery.select('SUM(daily_report2.steamingTime)', 'steamingTime')
                .from(daily_report_entity_1.DailyReport, "daily_report2")
                .innerJoin('port', 'port2', 'port2.id = daily_report2.portId AND port2.status = 1 AND daily_report2.status = 1')
                .innerJoin('voyage', 'voyage2', 'voyage2.id = port2.voyageId AND voyage2.status = 1')
                .where('daily_report2.status = :status', { status: 1 })
                .andWhere('daily_report2.distance > :distance', { distance: 0 })
                .andWhere('port2.status = :status', { status: 1 })
                .andWhere('voyage2.status = :status', { status: 1 })
                .andWhere("strftime('%Y-%m-%d'," + stringGroupBY + ") = strftime('%Y-%m-%d'," + stringGroupBY_TwoSelect + ")")
                .andWhere('daily_report2.userId = :userId', { userId: userId })
                .limit(1);
        }, "navigatedTime")
            .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
            .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
            .groupBy("strftime('%Y-%m-%d'," + stringGroupBY + ")")
            .getRawMany()
            .then((result) => {
            if (!result)
                throw 'ERROR GetReportVoyagePortDaily';
            return result;
        });
    }
    async GetReportBuroBerita(userId, startDate, endDate) {
        let stringGroupBY = "datetime('daily_report'.'date','+8.999999 hour')";
        let stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+8.999999 hour')";
        if (userId == 14) {
            stringGroupBY = "datetime('daily_report'.'date','+7.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+7.999999 hour')";
        }
        if (userId == 10) {
            stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
        }
        if (userId == 21) {
            stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
        }
        if (userId == 2) {
            stringGroupBY = "datetime('daily_report'.'date','+10.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+10.999999 hour')";
        }
        if (userId == 15) {
            stringGroupBY = "datetime('daily_report'.'date','+15.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+15.999999 hour')";
        }
        if (userId == 13) {
            stringGroupBY = "datetime('daily_report'.'date','+8.999999 hour')";
            stringGroupBY_TwoSelect = "datetime('daily_report2'.'date','+8.999999 hour')";
        }
        return await this._dailyReportRepository.createQueryBuilder('daily_report')
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
            .addSelect('MAX(daily_report.north_degree)', 'north_degree')
            .addSelect('MAX(daily_report.north_minutes)', 'north_minutes')
            .addSelect('MAX(daily_report.north_north_south)', 'north_north_south')
            .addSelect('MAX(daily_report.east_degree)', 'east_degree')
            .addSelect('MAX(daily_report.east_minutes)', 'east_minutes')
            .addSelect('MAX(daily_report.east_east_west)', 'east_east_west')
            .addSelect((subQuery) => {
            return subQuery.select('SUM(daily_report2.steamingTime)', 'steamingTime')
                .from(daily_report_entity_1.DailyReport, "daily_report2")
                .innerJoin('port', 'port2', 'port2.id = daily_report2.portId AND port2.status = 1 AND daily_report2.status = 1')
                .innerJoin('voyage', 'voyage2', 'voyage2.id = port2.voyageId AND voyage2.status = 1')
                .where('daily_report2.status = :status', { status: 1 })
                .andWhere('daily_report2.distance > :distance', { distance: 0 })
                .andWhere('port2.status = :status', { status: 1 })
                .andWhere('voyage2.status = :status', { status: 1 })
                .andWhere("strftime('%Y-%m-%d'," + stringGroupBY + ") = strftime('%Y-%m-%d'," + stringGroupBY_TwoSelect + ")")
                .andWhere('daily_report2.userId = :userId', { userId: userId })
                .limit(1);
        }, "navigatedTime")
            .innerJoin('port', 'port', 'port.id = daily_report.portId AND port.status = 1 AND daily_report.status = 1')
            .innerJoin('voyage', 'voyage', 'voyage.id = port.voyageId AND voyage.status = 1')
            .where('daily_report.status = :status', { status: 1 })
            .andWhere('port.status = :status', { status: 1 })
            .andWhere('voyage.status = :status', { status: 1 })
            .andWhere('daily_report.userId = :userId', { userId: userId })
            .andWhere('datetime(daily_report.date) >= datetime(:startDate)', { startDate: startDate })
            .andWhere('datetime(daily_report.date) <= datetime(:endDate)', { endDate: endDate })
            .groupBy("strftime('%Y-%m-%d'," + stringGroupBY + ")")
            .getRawMany()
            .then((result) => {
            if (!result)
                throw 'ERROR GetReportVoyagePortDaily';
            return result;
        });
    }
    async SaveList(MappingPorts, importDailyReport) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        let mappingDailyReports = [];
        const addDailyReports = importDailyReport.filter((dailyReport) => dailyReport.SyncStatus == 'added');
        const updateDailyReports = importDailyReport.filter((dailyReport) => dailyReport.SyncStatus == 'updated');
        const deleteDailyReports = importDailyReport.filter((dailyReport) => dailyReport.SyncStatus == 'deleted');
        let listDeReportesRegistrados = [];
        try {
            for (var _k = true, addDailyReports_1 = __asyncValues(addDailyReports), addDailyReports_1_1; addDailyReports_1_1 = await addDailyReports_1.next(), _a = addDailyReports_1_1.done, !_a; _k = true) {
                _c = addDailyReports_1_1.value;
                _k = false;
                const addDailyReport = _c;
                let searchMappingPort = (0, mappingKeys_1.searchKey)(MappingPorts, addDailyReport.portId);
                let newDailyReport = new daily_report_entity_1.DailyReport();
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
                newDailyReport.userIdCreated = addDailyReport.userIdCreated;
                newDailyReport.dateCreated = (0, moment_assets_1.GetDate)();
                delete newDailyReport.userIdUpdated;
                delete newDailyReport.dateUpdated;
                newDailyReport.status = Boolean(addDailyReport.status);
                let registers = await this.Create(newDailyReport);
                if (newDailyReport.status) {
                    listDeReportesRegistrados.push(registers.id);
                }
                mappingDailyReports.push(new mappingKeys_1.Mapping(addDailyReport.id, registers.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = addDailyReports_1.return)) await _b.call(addDailyReports_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _l = true, updateDailyReports_1 = __asyncValues(updateDailyReports), updateDailyReports_1_1; updateDailyReports_1_1 = await updateDailyReports_1.next(), _d = updateDailyReports_1_1.done, !_d; _l = true) {
                _f = updateDailyReports_1_1.value;
                _l = false;
                const dailyReport = _f;
                let searchMappingPort = (0, mappingKeys_1.searchKey)(MappingPorts, dailyReport.portId);
                let updateDailyReport = new daily_report_entity_1.DailyReport();
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
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_l && !_d && (_e = updateDailyReports_1.return)) await _e.call(updateDailyReports_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _m = true, deleteDailyReports_1 = __asyncValues(deleteDailyReports), deleteDailyReports_1_1; deleteDailyReports_1_1 = await deleteDailyReports_1.next(), _g = deleteDailyReports_1_1.done, !_g; _m = true) {
                _j = deleteDailyReports_1_1.value;
                _m = false;
                let dailyReport = _j;
                let searchMappingPort = (0, mappingKeys_1.searchKey)(MappingPorts, dailyReport.portId);
                let deletePortEntity = new daily_report_entity_1.DailyReport();
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
                deletePortEntity.userIdCreated = dailyReport.userIdCreated;
                deletePortEntity.dateCreated = dailyReport.dateCreated;
                deletePortEntity.userIdUpdated = dailyReport.userIdUpdated;
                deletePortEntity.dateUpdated = dailyReport.dateUpdated;
                deletePortEntity.status = Boolean(dailyReport.status);
                await this._dailyReportRepository.save(deletePortEntity);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_g && (_h = deleteDailyReports_1.return)) await _h.call(deleteDailyReports_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return mappingDailyReports;
    }
};
exports.DailyReportsService = DailyReportsService;
exports.DailyReportsService = DailyReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_report_entity_1.DailyReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DailyReportsService);
//# sourceMappingURL=daily-reports.service.js.map