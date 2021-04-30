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
let AppController = class AppController {
    constructor(appService, authService) {
        this.appService = appService;
        this.authService = authService;
    }
    Pruebas(body) {
        return promises_assets_1.DummyPromise().then((result) => {
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
    getHello() {
        return this.appService.getHello();
    }
    async login(req) {
        const user = req.user;
        return await promises_assets_1.DummyPromise().then(result => {
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
        return await promises_assets_1.DummyPromise().then((resultDummy) => {
            return this.appService.IsUserLogeatedExit(loggedUser);
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
        return await promises_assets_1.DummyPromise().then(result => {
            return this.appService.GetLoggedUsers();
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
        return await promises_assets_1.DummyPromise().then((resultDummy) => {
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
};
__decorate([
    common_1.Get('pruebas'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "Pruebas", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    common_1.UseGuards(passport_1.AuthGuard('local')),
    common_1.Post('auth/login'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    common_1.Post('loggedUsers'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loggedUser_1.LoggedUser]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loggedUsers", null);
__decorate([
    common_1.Get('loggedUsers'),
    __param(0, common_1.Headers()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loggedUser_1.LoggedUser]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "GetLoggedUsers", null);
__decorate([
    common_1.Post('emitConnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "EmitConnect", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        auth_service_1.AuthService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map