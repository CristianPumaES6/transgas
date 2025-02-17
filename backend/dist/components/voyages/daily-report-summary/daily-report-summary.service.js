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
exports.DailyReportSummaryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mappingKeys_1 = require("../../../assets/mappingKeys");
const moment_assets_1 = require("../../../assets/moment.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const typeorm_2 = require("typeorm");
const dailyReportSummary_entity_1 = require("../../../models/dailyReportSummary.entity");
let DailyReportSummaryService = class DailyReportSummaryService {
    constructor(_dailyReportSummary) {
        this._dailyReportSummary = _dailyReportSummary;
    }
    async Create(dailyReportSummary) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            return this._dailyReportSummary.save(dailyReportSummary);
        })
            .then(resultSave => {
            if (!resultSave)
                throw new Error('No se puedo registrar.');
            return resultSave;
        });
    }
    async SaveList(MappingVoyages, MappingPorts, importDailyReportSummary) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        let mappingDailyReportSummaries = [];
        const addDailyReportSummaries = importDailyReportSummary.filter((dailyReport) => dailyReport.SyncStatus == 'added');
        const updateDailyReportSummaries = importDailyReportSummary.filter((dailyReport) => dailyReport.SyncStatus == 'updated');
        const deleteDailyReportSummaries = importDailyReportSummary.filter((dailyReport) => dailyReport.SyncStatus == 'deleted');
        let listDeResumentDeReportesRegistrados = [];
        try {
            for (var _k = true, addDailyReportSummaries_1 = __asyncValues(addDailyReportSummaries), addDailyReportSummaries_1_1; addDailyReportSummaries_1_1 = await addDailyReportSummaries_1.next(), _a = addDailyReportSummaries_1_1.done, !_a; _k = true) {
                _c = addDailyReportSummaries_1_1.value;
                _k = false;
                const addDailyReportSummary = _c;
                let searchMappingPort = (0, mappingKeys_1.searchKey)(MappingPorts, addDailyReportSummary.portId);
                let searchMappingVoyage = (0, mappingKeys_1.searchKey)(MappingVoyages, addDailyReportSummary.voyageId);
                let newDailyReportSummary = new dailyReportSummary_entity_1.DailyReportSummary();
                delete newDailyReportSummary.id;
                newDailyReportSummary.userId = addDailyReportSummary.userId;
                newDailyReportSummary.portId = addDailyReportSummary.portId;
                if (searchMappingPort) {
                    newDailyReportSummary.portId = searchMappingPort.value;
                }
                newDailyReportSummary.voyageId = addDailyReportSummary.voyageId;
                if (searchMappingVoyage) {
                    newDailyReportSummary.voyageId = searchMappingVoyage.value;
                }
                newDailyReportSummary.date = addDailyReportSummary.date;
                newDailyReportSummary.date_ETA = addDailyReportSummary.date_ETA;
                newDailyReportSummary.latitud_degree = addDailyReportSummary.latitud_degree;
                newDailyReportSummary.latitud_minutes = addDailyReportSummary.latitud_minutes;
                newDailyReportSummary.latitud_north_south = addDailyReportSummary.latitud_north_south;
                newDailyReportSummary.longitude_degree = addDailyReportSummary.longitude_degree;
                newDailyReportSummary.longitude_minutes = addDailyReportSummary.longitude_minutes;
                newDailyReportSummary.longitude_east_west = addDailyReportSummary.longitude_east_west;
                newDailyReportSummary.typeOfEvent = addDailyReportSummary.typeOfEvent;
                newDailyReportSummary.voyage = addDailyReportSummary.voyage;
                newDailyReportSummary.port_Departure = addDailyReportSummary.port_Departure;
                newDailyReportSummary.port_Arrive = addDailyReportSummary.port_Arrive;
                newDailyReportSummary.loadingCondition = addDailyReportSummary.loadingCondition;
                newDailyReportSummary.voyComment = addDailyReportSummary.voyComment;
                newDailyReportSummary.timeElapsed = addDailyReportSummary.timeElapsed;
                newDailyReportSummary.timeElapsedSailing = addDailyReportSummary.timeElapsedSailing;
                newDailyReportSummary.distanceSailed = addDailyReportSummary.distanceSailed;
                newDailyReportSummary.nauticalMile = addDailyReportSummary.nauticalMile;
                newDailyReportSummary.navigationObservations = addDailyReportSummary.navigationObservations;
                newDailyReportSummary.bunkeringIfo = addDailyReportSummary.bunkeringIfo;
                newDailyReportSummary.bunkeringMgo = addDailyReportSummary.bunkeringMgo;
                newDailyReportSummary.mplaIfo = addDailyReportSummary.mplaIfo;
                newDailyReportSummary.auxIfo = addDailyReportSummary.auxIfo;
                newDailyReportSummary.boilerIfo = addDailyReportSummary.boilerIfo;
                newDailyReportSummary.otherIfo = addDailyReportSummary.otherIfo;
                newDailyReportSummary.mplaMgo = addDailyReportSummary.mplaMgo;
                newDailyReportSummary.auxMgo = addDailyReportSummary.auxMgo;
                newDailyReportSummary.boilerMgo = addDailyReportSummary.boilerMgo;
                newDailyReportSummary.ppMgo = addDailyReportSummary.ppMgo;
                newDailyReportSummary.giMgo = addDailyReportSummary.giMgo;
                newDailyReportSummary.otherMgo = addDailyReportSummary.otherMgo;
                newDailyReportSummary.rob_Mgo = addDailyReportSummary.rob_Mgo;
                newDailyReportSummary.rob_Ifo = addDailyReportSummary.rob_Ifo;
                newDailyReportSummary.load_Power = addDailyReportSummary.load_Power;
                newDailyReportSummary.engine_Distance = addDailyReportSummary.engine_Distance;
                newDailyReportSummary.userIdCreated = addDailyReportSummary.userIdCreated;
                newDailyReportSummary.dateCreated = (0, moment_assets_1.GetDate)();
                delete newDailyReportSummary.userIdUpdated;
                delete newDailyReportSummary.dateUpdated;
                newDailyReportSummary.status = Boolean(addDailyReportSummary.status);
                let registers = await this.Create(newDailyReportSummary);
                mappingDailyReportSummaries.push(new mappingKeys_1.Mapping(addDailyReportSummary.id, registers.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = addDailyReportSummaries_1.return)) await _b.call(addDailyReportSummaries_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _l = true, updateDailyReportSummaries_1 = __asyncValues(updateDailyReportSummaries), updateDailyReportSummaries_1_1; updateDailyReportSummaries_1_1 = await updateDailyReportSummaries_1.next(), _d = updateDailyReportSummaries_1_1.done, !_d; _l = true) {
                _f = updateDailyReportSummaries_1_1.value;
                _l = false;
                const updateDailyReportSummary = _f;
                let searchMappingPort = (0, mappingKeys_1.searchKey)(MappingPorts, updateDailyReportSummary.portId);
                let searchMappingVoyage = (0, mappingKeys_1.searchKey)(MappingVoyages, updateDailyReportSummary.voyageId);
                let reportSummary = new dailyReportSummary_entity_1.DailyReportSummary();
                reportSummary.id = updateDailyReportSummary.id;
                reportSummary.userId = updateDailyReportSummary.userId;
                reportSummary.portId = updateDailyReportSummary.portId;
                if (searchMappingPort) {
                    reportSummary.portId = searchMappingPort.value;
                }
                reportSummary.voyageId = updateDailyReportSummary.voyageId;
                if (searchMappingVoyage) {
                    reportSummary.voyageId = searchMappingVoyage.value;
                }
                reportSummary.date = updateDailyReportSummary.date;
                reportSummary.date_ETA = updateDailyReportSummary.date_ETA;
                reportSummary.latitud_degree = updateDailyReportSummary.latitud_degree;
                reportSummary.latitud_minutes = updateDailyReportSummary.latitud_minutes;
                reportSummary.latitud_north_south = updateDailyReportSummary.latitud_north_south;
                reportSummary.longitude_degree = updateDailyReportSummary.longitude_degree;
                reportSummary.longitude_minutes = updateDailyReportSummary.longitude_minutes;
                reportSummary.longitude_east_west = updateDailyReportSummary.longitude_east_west;
                reportSummary.typeOfEvent = updateDailyReportSummary.typeOfEvent;
                reportSummary.voyage = updateDailyReportSummary.voyage;
                reportSummary.port_Departure = updateDailyReportSummary.port_Departure;
                reportSummary.port_Arrive = updateDailyReportSummary.port_Arrive;
                reportSummary.loadingCondition = updateDailyReportSummary.loadingCondition;
                reportSummary.voyComment = updateDailyReportSummary.voyComment;
                reportSummary.timeElapsed = updateDailyReportSummary.timeElapsed;
                reportSummary.timeElapsedSailing = updateDailyReportSummary.timeElapsedSailing;
                reportSummary.distanceSailed = updateDailyReportSummary.distanceSailed;
                reportSummary.nauticalMile = updateDailyReportSummary.nauticalMile;
                reportSummary.navigationObservations = updateDailyReportSummary.navigationObservations;
                reportSummary.bunkeringIfo = updateDailyReportSummary.bunkeringIfo;
                reportSummary.bunkeringMgo = updateDailyReportSummary.bunkeringMgo;
                reportSummary.mplaIfo = updateDailyReportSummary.mplaIfo;
                reportSummary.auxIfo = updateDailyReportSummary.auxIfo;
                reportSummary.boilerIfo = updateDailyReportSummary.boilerIfo;
                reportSummary.otherIfo = updateDailyReportSummary.otherIfo;
                reportSummary.mplaMgo = updateDailyReportSummary.mplaMgo;
                reportSummary.auxMgo = updateDailyReportSummary.auxMgo;
                reportSummary.boilerMgo = updateDailyReportSummary.boilerMgo;
                reportSummary.ppMgo = updateDailyReportSummary.ppMgo;
                reportSummary.giMgo = updateDailyReportSummary.giMgo;
                reportSummary.otherMgo = updateDailyReportSummary.otherMgo;
                reportSummary.rob_Mgo = updateDailyReportSummary.rob_Mgo;
                reportSummary.rob_Ifo = updateDailyReportSummary.rob_Ifo;
                reportSummary.load_Power = updateDailyReportSummary.load_Power;
                reportSummary.engine_Distance = updateDailyReportSummary.engine_Distance;
                reportSummary.userIdCreated = updateDailyReportSummary.userIdCreated;
                reportSummary.dateCreated = updateDailyReportSummary.dateCreated;
                reportSummary.userIdUpdated = updateDailyReportSummary.userIdUpdated;
                reportSummary.dateUpdated = updateDailyReportSummary.dateUpdated;
                reportSummary.status = Boolean(updateDailyReportSummary.status);
                await this._dailyReportSummary.save(reportSummary);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_l && !_d && (_e = updateDailyReportSummaries_1.return)) await _e.call(updateDailyReportSummaries_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _m = true, deleteDailyReportSummaries_1 = __asyncValues(deleteDailyReportSummaries), deleteDailyReportSummaries_1_1; deleteDailyReportSummaries_1_1 = await deleteDailyReportSummaries_1.next(), _g = deleteDailyReportSummaries_1_1.done, !_g; _m = true) {
                _j = deleteDailyReportSummaries_1_1.value;
                _m = false;
                let deleteDailyReportSummary = _j;
                let updateDailyReport = new dailyReportSummary_entity_1.DailyReportSummary();
                let searchMappingPort = (0, mappingKeys_1.searchKey)(MappingPorts, deleteDailyReportSummary.portId);
                let searchMappingVoyage = (0, mappingKeys_1.searchKey)(MappingVoyages, deleteDailyReportSummary.voyageId);
                let reportSummary = new dailyReportSummary_entity_1.DailyReportSummary();
                reportSummary.id = deleteDailyReportSummary.id;
                reportSummary.userId = deleteDailyReportSummary.userId;
                reportSummary.portId = deleteDailyReportSummary.portId;
                if (searchMappingPort) {
                    reportSummary.portId = searchMappingPort.value;
                }
                reportSummary.voyageId = deleteDailyReportSummary.voyageId;
                if (searchMappingVoyage) {
                    reportSummary.voyageId = searchMappingVoyage.value;
                }
                reportSummary.date = deleteDailyReportSummary.date;
                reportSummary.date_ETA = deleteDailyReportSummary.date_ETA;
                reportSummary.latitud_degree = deleteDailyReportSummary.latitud_degree;
                reportSummary.latitud_minutes = deleteDailyReportSummary.latitud_minutes;
                reportSummary.latitud_north_south = deleteDailyReportSummary.latitud_north_south;
                reportSummary.longitude_degree = deleteDailyReportSummary.longitude_degree;
                reportSummary.longitude_minutes = deleteDailyReportSummary.longitude_minutes;
                reportSummary.longitude_east_west = deleteDailyReportSummary.longitude_east_west;
                reportSummary.typeOfEvent = deleteDailyReportSummary.typeOfEvent;
                reportSummary.voyage = deleteDailyReportSummary.voyage;
                reportSummary.port_Departure = deleteDailyReportSummary.port_Departure;
                reportSummary.port_Arrive = deleteDailyReportSummary.port_Arrive;
                reportSummary.loadingCondition = deleteDailyReportSummary.loadingCondition;
                reportSummary.voyComment = deleteDailyReportSummary.voyComment;
                reportSummary.timeElapsed = deleteDailyReportSummary.timeElapsed;
                reportSummary.timeElapsedSailing = deleteDailyReportSummary.timeElapsedSailing;
                reportSummary.distanceSailed = deleteDailyReportSummary.distanceSailed;
                reportSummary.nauticalMile = deleteDailyReportSummary.nauticalMile;
                reportSummary.navigationObservations = deleteDailyReportSummary.navigationObservations;
                reportSummary.bunkeringIfo = deleteDailyReportSummary.bunkeringIfo;
                reportSummary.bunkeringMgo = deleteDailyReportSummary.bunkeringMgo;
                reportSummary.mplaIfo = deleteDailyReportSummary.mplaIfo;
                reportSummary.auxIfo = deleteDailyReportSummary.auxIfo;
                reportSummary.boilerIfo = deleteDailyReportSummary.boilerIfo;
                reportSummary.otherIfo = deleteDailyReportSummary.otherIfo;
                reportSummary.mplaMgo = deleteDailyReportSummary.mplaMgo;
                reportSummary.auxMgo = deleteDailyReportSummary.auxMgo;
                reportSummary.boilerMgo = deleteDailyReportSummary.boilerMgo;
                reportSummary.ppMgo = deleteDailyReportSummary.ppMgo;
                reportSummary.giMgo = deleteDailyReportSummary.giMgo;
                reportSummary.otherMgo = deleteDailyReportSummary.otherMgo;
                reportSummary.rob_Mgo = deleteDailyReportSummary.rob_Mgo;
                reportSummary.rob_Ifo = deleteDailyReportSummary.rob_Ifo;
                reportSummary.load_Power = deleteDailyReportSummary.load_Power;
                reportSummary.engine_Distance = deleteDailyReportSummary.engine_Distance;
                reportSummary.userIdCreated = deleteDailyReportSummary.userIdCreated;
                reportSummary.dateCreated = deleteDailyReportSummary.dateCreated;
                reportSummary.userIdUpdated = deleteDailyReportSummary.userIdUpdated;
                reportSummary.dateUpdated = deleteDailyReportSummary.dateUpdated;
                reportSummary.status = Boolean(deleteDailyReportSummary.status);
                await this._dailyReportSummary.save(reportSummary);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_g && (_h = deleteDailyReportSummaries_1.return)) await _h.call(deleteDailyReportSummaries_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return mappingDailyReportSummaries;
    }
};
exports.DailyReportSummaryService = DailyReportSummaryService;
exports.DailyReportSummaryService = DailyReportSummaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dailyReportSummary_entity_1.DailyReportSummary)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DailyReportSummaryService);
//# sourceMappingURL=daily-report-summary.service.js.map