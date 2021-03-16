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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const daily_report_entity_1 = require("../../../models/daily-report.entity");
const typeorm_2 = require("typeorm");
let DailyReportsService = class DailyReportsService {
    constructor(_dailyReportRepository) {
        this._dailyReportRepository = _dailyReportRepository;
    }
    async Create(dailyReport) {
        return await this._dailyReportRepository.save(dailyReport).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el viaje en la BD.');
            return resultSave;
        });
    }
    async Get(id) {
        return await this._dailyReportRepository.findOne({
            where: {
                id: id,
                status: typeorm_2.Not(false)
            }
        }).then((resultFind) => {
            if (!resultFind)
                throw new Error('does_not_exist');
            return resultFind;
        });
    }
    async Gets(dailyReport) {
        return await this._dailyReportRepository.find({
            where: [
                {
                    userId: typeorm_2.Like('%' + (dailyReport.userId || '') + '%'),
                    portId: typeorm_2.Like('%' + dailyReport.portId + '%'),
                    status: typeorm_2.Not(false)
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
        return await this._dailyReportRepository.findOne({
            where: [
                { id: dailyReport.id }
            ]
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('does_not_exist');
            return this._dailyReportRepository.update(dailyReport.id, dailyReport);
        }).then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('ERROR_TYPEORM_UPDATE_PORT');
            return dailyReport;
        });
    }
    async Delete(dailyReport) {
        return await this._dailyReportRepository.findOne({
            where: [
                { id: dailyReport.id }
            ]
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('does_not_exist');
            resultFind.status = false;
            return this._dailyReportRepository.update(dailyReport.id, resultFind);
        }).then(resultSave => {
            if (!resultSave)
                throw new Error('ERROR_TYPEORM_UPDATE_PORT');
            return dailyReport;
        });
    }
};
DailyReportsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(daily_report_entity_1.DailyReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DailyReportsService);
exports.DailyReportsService = DailyReportsService;
//# sourceMappingURL=daily-reports.service.js.map