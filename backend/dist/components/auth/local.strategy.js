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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStrategy = void 0;
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const promises_assets_1 = require("../../assets/promises.assets");
const user_entity_1 = require("../../models/user.entity");
let LocalStrategy = class LocalStrategy extends passport_1.PassportStrategy(passport_local_1.Strategy) {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    async validate(username, password) {
        return await promises_assets_1.DummyPromise().then(result => {
            if (!result)
                throw Error('Revisar la funcion DummyPromise(); no retorna lo esperado.');
            return this.authService.validateLogin(username, password);
        }).then((resultValidateLogin) => {
            if (!resultValidateLogin)
                throw Error('El servicio de authenticacion no retorno lo esperado.');
            return resultValidateLogin;
        }).catch((err) => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.UnauthorizedException(errorMsg, clientMsg);
        });
    }
};
LocalStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;
//# sourceMappingURL=local.strategy.js.map