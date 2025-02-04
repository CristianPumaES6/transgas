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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const promises_assets_1 = require("../../assets/promises.assets");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateLogin(nick, password) {
        let user = {};
        return await this.usersService
            .GetUserByNick(nick)
            .then(resultfindUser => {
            if (!resultfindUser)
                throw new Error('there_is_no_email');
            if (!resultfindUser.status)
                throw 'account_status_false';
            user = resultfindUser;
            return bcrypt.compare(password, resultfindUser.password);
        })
            .then((checkComparePsw) => {
            if (checkComparePsw) {
                user.password = null;
            }
            else {
                throw new Error('there_is_no_password');
            }
            return user;
        });
    }
    async generateTokenForGuards(user) {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
        };
        return await (0, promises_assets_1.DummyPromise)().then(result => {
            if (!result)
                throw 'Error en la respuesta del DummyPromise.';
            return this.jwtService.sign(payload);
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map