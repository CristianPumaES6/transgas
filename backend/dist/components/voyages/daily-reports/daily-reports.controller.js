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
exports.DailyReportsController = void 0;
const common_1 = require("@nestjs/common");
const jwtDecode_assets_1 = require("../../../assets/jwtDecode.assets");
const moment_assets_1 = require("../../../assets/moment.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const daily_report_entity_1 = require("../../../models/daily-report.entity");
const user_entity_1 = require("../../../models/user.entity");
const daily_reports_service_1 = require("./daily-reports.service");
let DailyReportsController = class DailyReportsController {
    constructor(_dailyReportsService) {
        this._dailyReportsService = _dailyReportsService;
    }
    async Get(id) {
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(id)) {
                let userId = Number(id);
                return this._dailyReportsService.Get(userId);
            }
            else {
                throw 'MISSING_FIELS';
            }
        }).then((resultGet) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultGet
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    Gets(headers, dailyReport) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (dailyReport) {
                dailyReport.userId = Number(dailyReport.userId);
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                dailyReport.userId = null;
            }
            else if (dailyReport.userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
            return this._dailyReportsService.Gets(dailyReport);
        }).then((results) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: results
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    GetROBByBuque(headers, userId) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (userId) {
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                return true;
            }
            else if (Number(userId) !== Number(headerToken.id))
                throw new Error('ERROR_USERID_FAIL');
        }).then((resultValidate) => {
            return this._dailyReportsService.GetROBByUser(userId);
        }).then((results) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: results
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    GetBunkeringByBuque(headers, userId) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (userId) {
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                return true;
            }
            else if (userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
        }).then((resultValidate) => {
            return this._dailyReportsService.GetBunkeringByUserIFO(userId);
        }).then((results) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: results
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    Create(headers, dailyReport) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (dailyReport && dailyReport.userId && dailyReport.portId && dailyReport.date && dailyReport.hour && dailyReport.activityPerformed && headerToken && headerToken.id) {
                if (headerToken.role === 'BUQUE') {
                    if (Number(headerToken.id) !== Number(dailyReport.userId))
                        throw new Error('ERROR_USERID_FAIL');
                }
                delete dailyReport.id;
                dailyReport.bunkeringIfo = dailyReport.bunkeringIfo || 0;
                dailyReport.bunkeringMgo = dailyReport.bunkeringMgo || 0;
                dailyReport.mplaIfo = dailyReport.mplaIfo || 0;
                dailyReport.auxIfo = dailyReport.auxIfo || 0;
                dailyReport.boilerIfo = dailyReport.boilerIfo || 0;
                dailyReport.otherIfo = dailyReport.otherIfo || 0;
                dailyReport.mplaMgo = dailyReport.mplaMgo || 0;
                dailyReport.auxMgo = dailyReport.auxMgo || 0;
                dailyReport.boilerMgo = dailyReport.boilerMgo || 0;
                dailyReport.ppMgo = dailyReport.ppMgo || 0;
                dailyReport.giMgo = dailyReport.giMgo || 0;
                dailyReport.otherMgo = dailyReport.otherMgo || 0;
                dailyReport.steamingTime = dailyReport.steamingTime || 0;
                dailyReport.distance = dailyReport.distance || 0;
                dailyReport.userIdCreated = headerToken.id;
                dailyReport.dateCreated = moment_assets_1.GetDate();
                delete dailyReport.userIdUpdated;
                delete dailyReport.dateUpdated;
                dailyReport.status = Boolean(dailyReport.status);
                return this._dailyReportsService.Create(dailyReport);
            }
            else
                throw 'MISSING_FIELS';
        }).then((resultCreate) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultCreate
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
        ;
    }
    async Update(headers, id, dailyReport) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (dailyReport && dailyReport.userId && dailyReport.portId && dailyReport.date && dailyReport.hour && dailyReport.activityPerformed && headerToken && headerToken.id) {
                if (headerToken.role === 'SUPPORT' || headerToken.role === 'ADMIN') {
                }
                else if (Number(headerToken.id) !== Number(dailyReport.userId))
                    throw new Error('ERROR_USERID_FAIL');
                dailyReport.bunkeringIfo = dailyReport.bunkeringIfo || 0;
                dailyReport.bunkeringMgo = dailyReport.bunkeringMgo || 0;
                dailyReport.mplaIfo = dailyReport.mplaIfo || 0;
                dailyReport.auxIfo = dailyReport.auxIfo || 0;
                dailyReport.boilerIfo = dailyReport.boilerIfo || 0;
                dailyReport.otherIfo = dailyReport.otherIfo || 0;
                dailyReport.mplaMgo = dailyReport.mplaMgo || 0;
                dailyReport.auxMgo = dailyReport.auxMgo || 0;
                dailyReport.boilerMgo = dailyReport.boilerMgo || 0;
                dailyReport.ppMgo = dailyReport.ppMgo || 0;
                dailyReport.giMgo = dailyReport.giMgo || 0;
                dailyReport.otherMgo = dailyReport.otherMgo || 0;
                dailyReport.steamingTime = dailyReport.steamingTime || 0;
                dailyReport.distance = dailyReport.distance || 0;
                delete dailyReport.userIdCreated;
                delete dailyReport.dateCreated;
                dailyReport.userIdUpdated = headerToken.id;
                dailyReport.dateUpdated = moment_assets_1.GetDate();
                dailyReport.status = Boolean(dailyReport.status);
                return this._dailyReportsService.Update(dailyReport);
            }
            else {
                throw 'MISSING_FIELS';
            }
        }).then((resultUpdate) => {
            if (!resultUpdate)
                throw new Error('TYPEORM_UPDATE_VOYAGE_DETAIL');
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultUpdate
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    async Delete(headers, id) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(id)) {
                return this._dailyReportsService.Get(id);
            }
            else {
                throw new Error('MISSING_FIELS');
            }
        }).then((result) => {
            result.status = false;
            delete result.userIdCreated;
            delete result.dateCreated;
            result.userIdUpdated = headerToken.id;
            result.dateUpdated = moment_assets_1.GetDate();
            return this._dailyReportsService.Delete(result);
        }).then((resultDelete) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultDelete
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
};
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DailyReportsController.prototype, "Get", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Headers()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, daily_report_entity_1.DailyReport]),
    __metadata("design:returntype", Promise)
], DailyReportsController.prototype, "Gets", null);
__decorate([
    common_1.Get('get-rob/:userId'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DailyReportsController.prototype, "GetROBByBuque", null);
__decorate([
    common_1.Get('get-bunkering/:userId'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DailyReportsController.prototype, "GetBunkeringByBuque", null);
__decorate([
    common_1.Post('create'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, daily_report_entity_1.DailyReport]),
    __metadata("design:returntype", Promise)
], DailyReportsController.prototype, "Create", null);
__decorate([
    common_1.Put(':id/update'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, daily_report_entity_1.DailyReport]),
    __metadata("design:returntype", Promise)
], DailyReportsController.prototype, "Update", null);
__decorate([
    common_1.Delete(':id/delete'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DailyReportsController.prototype, "Delete", null);
DailyReportsController = __decorate([
    common_1.Controller('daily-reports'),
    __metadata("design:paramtypes", [daily_reports_service_1.DailyReportsService])
], DailyReportsController);
exports.DailyReportsController = DailyReportsController;
//# sourceMappingURL=daily-reports.controller.js.map