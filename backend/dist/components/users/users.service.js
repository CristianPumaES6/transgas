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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
const bcrypt = require("bcrypt");
const bcrypt_config_1 = require("../../config/bcrypt.config");
const server_config_1 = require("../../config/server.config");
const user_entity_1 = require("../../models/user.entity");
const promises_assets_1 = require("../../assets/promises.assets");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async Get(id) {
        return await this.userRepository.findOne({
            where: {
                id: id,
                status: typeorm_4.Not(false)
            }
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('user_does_not_exist');
            resultFind.password = null;
            return resultFind;
        });
    }
    async Gets(user) {
        return await this.userRepository.find({
            where: [
                {
                    id: (user.id || typeorm_3.Like('%' + '%')),
                    nick: typeorm_3.Like('%' + (user.nick || '') + '%'),
                    name: typeorm_3.Like('%' + (user.name || '') + '%'),
                    role: typeorm_3.Like('%' + (user.role || '') + '%'),
                    status: typeorm_4.Not(false)
                }
            ]
        }).then((result) => {
            result.forEach(user => {
                user.password = '';
            });
            return result;
        });
    }
    async CreateUserNickUnique(user) {
        return await this.userRepository.findOne({
            where: [
                {
                    nick: user.nick
                }
            ]
        }).then((result) => {
            if (result) {
                throw 'REPEAT_NICK';
            }
            return bcrypt.hash(user.password, bcrypt_config_1.ROUNDS_BCRYPT);
        }).then(password => {
            user.password = password;
            delete user.id;
            return this.userRepository.save(user);
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('ERROR_USER_SERVICE_CREATE_USER_SAVE_USER');
            resultSave.password = '';
            return resultSave;
        });
    }
    async UpdateUserNickUnique(user) {
        let contraseniaOld = '';
        return await this.userRepository.findOne({
            where: [
                { id: user.id }
            ]
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('user_does_not_exist');
            contraseniaOld = resultFind.password;
            return this.userRepository.findOne({
                where: [
                    {
                        id: typeorm_4.Not(resultFind.id),
                        nick: user.nick
                    }
                ]
            });
        }).then(result => {
            if (result) {
                throw 'REPEAT_NICK';
            }
            if (user.password) {
                return bcrypt.hash(user.password, bcrypt_config_1.ROUNDS_BCRYPT);
            }
            else {
                return contraseniaOld;
            }
        }).then((password) => {
            if (!password)
                throw new Error('Revisar User.service la funcion hash o el retun no, respondio como se esperaba.');
            user.password = password;
            return this.userRepository.update(user.id, user);
        }).then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('userRepository.update no respondio como esperabamos.');
            user.password = '';
            return user;
        });
    }
    async Delete(userId) {
        let user = new user_entity_1.UserEntity();
        return await this.userRepository.findOne({
            where: [
                { id: userId }
            ]
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('user_does_not_exist');
            user = resultFind;
            user.status = false;
            return this.userRepository.update(user.id, user);
        }).then(resultSave => {
            if (!resultSave)
                throw new Error('error_user_save');
            user.password = '';
            return user;
        });
    }
    async GetUserByNick(nick) {
        return await promises_assets_1.DummyPromise().then(result => {
            return this.userRepository.findOne({
                where: [
                    { nick: nick }
                ]
            });
        }).then((resultUser) => {
            if (!resultUser)
                throw new Error('user_was_not_found');
            return resultUser;
        });
    }
    async UpdateImageUser(id, newFilename) {
        let urlImage = server_config_1.URL_Server.back + '/' + newFilename;
        return await this.userRepository.update(id, { filename: urlImage }).then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('userRepository.update no respondio como esperabamos.');
            return urlImage;
        });
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map