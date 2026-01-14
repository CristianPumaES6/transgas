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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const app_service_1 = require("./app.service");
const auth_service_1 = require("./components/auth/auth.service");
const promises_assets_1 = require("./assets/promises.assets");
const loggedUser_1 = require("./models/loggedUser");
const server_config_1 = require("./config/server.config");
const app_gateway_1 = require("./app.gateway");
const consumption_equipment_service_1 = require("./components/oils/consumption-equipment/consumption-equipment.service");
let AppController = class AppController {
    constructor(appService, authService, _ConsumptionEquipmentService, _AppGateway) {
        this.appService = appService;
        this.authService = authService;
        this._ConsumptionEquipmentService = _ConsumptionEquipmentService;
        this._AppGateway = _AppGateway;
    }
    Pruebas(body) {
        return (0, promises_assets_1.DummyPromise)().then((result) => {
            return 'PRUEBA :)';
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
    GetVersionPlataform() {
        let version = server_config_1.URL_Server.version;
        return {
            status: common_1.HttpStatus.OK,
            data: version
        };
    }
    getHello() {
        let version = server_config_1.URL_Server.version;
        return {
            status: common_1.HttpStatus.OK,
            data: version
        };
    }
    async login(req) {
        const user = req.user;
        return await (0, promises_assets_1.DummyPromise)().then(result => {
            if (!result)
                throw Error('Error DummyPromise()');
            if (!user)
                throw Error('No tiene dato el objUser');
            return this.authService.generateTokenForGuards(user);
        }).then((resultGenerateToken) => {
            if (!resultGenerateToken)
                throw Error('Revisar la funcion this.authService.generateTokenForGuards(req.user);');
            return {
                status: common_1.HttpStatus.CREATED,
                message: 'OK',
                data: user,
                token: resultGenerateToken
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
    async loggedUsers(headers, loggedUser) {
        return await (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            return this._AppGateway.IsUserLogeatedExit(loggedUser);
        }).then((results) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK REGISTER',
                data: results,
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
    async GetLoggedUsers(headers, loggedUser) {
        return await (0, promises_assets_1.DummyPromise)().then(result => {
            return this._AppGateway.GetLoggedUsers();
        }).then((resultLoggedUsers) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK REGISTER',
                data: resultLoggedUsers,
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
    async EmitConnect() {
        return await (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            return this.appService.EmitConnect();
        }).then((resultEmitConnect) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'Send Emit Connect',
                data: resultEmitConnect,
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
    async ConsultaGeneral(buqueId, startDate, endDate) {
        return await (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            let userId = Number(buqueId);
            console.log("buqueId : " + buqueId);
            console.log("startDate : " + startDate);
            console.log("endDate : " + endDate);
            return this.appService.ListConsumptionLubricantPerMonth(userId, startDate, endDate);
        });
    }
    async ConsultEquipmentConsumptionByMonthUser(buqueId, EquipmentId, YEAR_MONTH) {
        return await (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            let userId = Number(buqueId);
            let entityEquipmentId = Number(EquipmentId);
            let DateYEAR_MONTH = YEAR_MONTH;
            return this.appService.consultEquipmentConsumptionByMonthUser(userId, entityEquipmentId, DateYEAR_MONTH);
        });
    }
    async GetShips() {
        return await (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            return this.appService.GetShips();
        });
    }
    async GetStatusOilStartEnd(userId, startDate, endDate) {
        return await (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            return this._ConsumptionEquipmentService.GetStatusOilStartEnd(userId, startDate, endDate);
        });
    }
    async GetInfoAllVessel(userId, startDate, endDate) {
        return await (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            return this._ConsumptionEquipmentService.GetInfoAllVessel(startDate, endDate);
        });
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('pruebas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "Pruebas", null);
__decorate([
    (0, common_1.Get)('platform-version'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "GetVersionPlataform", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('testToken'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('loggedUsers'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loggedUser_1.LoggedUser]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loggedUsers", null);
__decorate([
    (0, common_1.Get)('loggedUsers'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loggedUser_1.LoggedUser]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "GetLoggedUsers", null);
__decorate([
    (0, common_1.Post)('emitConnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "EmitConnect", null);
__decorate([
    (0, common_1.Get)('ListConsumptionLubricantPerMonth/:userId/:startDate/:endDate'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('startDate')),
    __param(2, (0, common_1.Param)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "ConsultaGeneral", null);
__decorate([
    (0, common_1.Get)('ConsultEquipmentConsumptionByMonthUser/:userId/:EquipmentId/:YEAR_MONTH'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('EquipmentId')),
    __param(2, (0, common_1.Param)('YEAR_MONTH')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "ConsultEquipmentConsumptionByMonthUser", null);
__decorate([
    (0, common_1.Get)('Ships'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "GetShips", null);
__decorate([
    (0, common_1.Get)('GetStatusOilStartEndDate/:userId/:startDate/:endDate'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('startDate')),
    __param(2, (0, common_1.Param)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "GetStatusOilStartEnd", null);
__decorate([
    (0, common_1.Get)('GetInfoAllVessel/:startDate/:endDate'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('startDate')),
    __param(2, (0, common_1.Param)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "GetInfoAllVessel", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        auth_service_1.AuthService,
        consumption_equipment_service_1.ConsumptionEquipmentService,
        app_gateway_1.AppGateway])
], AppController);
//# sourceMappingURL=app.controller.js.map