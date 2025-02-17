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
const moment_assets_1 = require("../../assets/moment.assets");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async Get(id) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`SP_BuscarUsuarioPorId @userId= ${id}`);
            }
            else {
                return this.userRepository.find({
                    where: {
                        id: id,
                        status: (0, typeorm_4.Not)(false),
                    },
                });
            }
        })
            .then(resultFind => {
            if (!resultFind || resultFind.length == 0)
                throw 'NO_REGISTER';
            let usuario = resultFind[0];
            usuario.password = null;
            return usuario;
        });
    }
    async Gets(user) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`EXEC SP_BuscarUsuariosByFilter @userId =0,@nick = '${user.nick || ''}',@name = '${user.name || ''}',@role= '${user.role || ''}'
                    `);
            }
            else {
                return this.userRepository.find({
                    where: [
                        {
                            id: user.id || (0, typeorm_3.Like)('%' + '%'),
                            nick: (0, typeorm_3.Like)('%' + (user.nick || '') + '%'),
                            name: (0, typeorm_3.Like)('%' + (user.name || '') + '%'),
                            role: (0, typeorm_3.Like)('%' + (user.role || '') + '%'),
                            status: (0, typeorm_4.Not)(false),
                        },
                    ],
                });
            }
        })
            .then((result) => {
            if (!result)
                throw 'ERROR AL CONSULTAR USUARIO.';
            result.forEach(user => {
                user.password = '';
            });
            return result;
        });
    }
    async CreateUserNickUnique(user) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`
                    EXEC SP_GETEmailEstaEnUso @userId = 0, @nick = '${user.nick || ''}' 
                    `);
            }
            else {
                return this.userRepository.find({
                    where: [
                        {
                            nick: user.nick,
                            status: (0, typeorm_4.Not)(false),
                        },
                    ],
                });
            }
        })
            .then(resultFind => {
            if (resultFind && resultFind.length > 0)
                throw 'REPEAT_NICK';
            return bcrypt.hash(user.password, bcrypt_config_1.ROUNDS_BCRYPT);
        })
            .then(password => {
            user.password = password;
            delete user.id;
            user.years = JSON.stringify(user.years);
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`
                    EXEC SP_CreateNewUser
                    @nick ='${user.nick || ''}'
                    ,@name ='${user.name || ''}'
                    ,@filename ='${user.filename || ''}'
                    ,@password ='${user.password || ''}'
                    ,@language ='${user.language || ''}'
                    ,@role ='${user.role || ''}'
                    ,@years  ='${user.years || '[]'}'
                    ,@minSpeed  = ${user.minSpeed || 0}
                    ,@maxSpeed  = ${user.maxSpeed || 0}
                    ,@isConsumptionIFO  = ${user.isConsumptionIFO || 0}
                    ,@isConsumptionLSFO = ${user.isConsumptionLSFO || 0}
                    ,@isConsumptionVLSFO  = ${user.isConsumptionVLSFO || 0}
                    ,@isConsumptionMGO   = ${user.isConsumptionMGO || 0}
                    ,@maxIFOConsumption   = ${user.maxIFOConsumption || 0}
                    ,@maxMGOConsumption   = ${user.maxMGOConsumption || 0}
                    ,@minIFOConsumption   = ${user.minIFOConsumption || 0}
                    ,@minMGOConsumption   = ${user.minMGOConsumption || 0}
                    ,@isMEMGO   = ${user.isMEMGO || 0}
                    ,@isAEMGO   = ${user.isAEMGO || 0}
                    ,@isBoilerMGO   = ${user.isBoilerMGO || 0}
                    ,@isIGMGO   = ${user.isIGMGO || 0}
                    ,@isPowerPMGO   = ${user.isPowerPMGO || 0}
                    ,@isOtherMGO   = ${user.isOtherMGO || 0}
                    ,@isMEIFO   = ${user.isMEIFO || 0}
                    ,@isAEIFO   = ${user.isAEIFO || 0}
                    ,@isBoilerIFO   = ${user.isBoilerIFO || 0}
                    ,@isOtherIFO   = ${user.isOtherIFO || 0}
                    ,@contractSpeedSailingBallastMGO   = ${user.contractSpeedSailingBallastMGO || 0}
                    ,@contractSpeedSailingLadenMGO   = ${user.contractSpeedSailingLadenMGO || 0}
                    ,@contractSpeedSailingEconomicalMGO   = ${user.contractSpeedSailingEconomicalMGO || 0}
                    ,@loadingConsumptionMGO   = ${user.loadingConsumptionMGO || 0}
                    ,@dischargeConsumptionMGO   = ${user.dischargeConsumptionMGO || 0}
                    ,@sailingBallastConsumptionMGO   = ${user.sailingBallastConsumptionMGO || 0}
                    ,@sailingLoadConsumptionMGO   = ${user.sailingLoadConsumptionMGO || 0}
                    ,@sailingEconomicConsumptionMGO   = ${user.sailingEconomicConsumptionMGO || 0}
                    ,@anchoredConsumptionMGO   = ${user.anchoredConsumptionMGO || 0}
                    ,@maneuverConsumptionMGO   = ${user.maneuverConsumptionMGO || 0}
                    ,@otherConsumptionMGO   = ${user.otherConsumptionMGO || 0}
                    ,@contractSpeedSailingBallastIFO   = ${user.contractSpeedSailingBallastIFO || 0}
                    ,@contractSpeedSailingLadenIFO   = ${user.contractSpeedSailingLadenIFO || 0}
                    ,@contractSpeedSailingEconomicalIFO   = ${user.contractSpeedSailingEconomicalIFO || 0}
                    ,@loadingConsumptionIFO   = ${user.loadingConsumptionIFO || 0}
                    ,@dischargeConsumptionIFO   = ${user.dischargeConsumptionIFO || 0}
                    ,@sailingBallastConsumptionIFO   = ${user.sailingBallastConsumptionIFO || 0}
                    ,@sailingLoadConsumptionIFO   = ${user.sailingLoadConsumptionIFO || 0}
                    ,@sailingEconomicConsumptionIFO   = ${user.sailingEconomicConsumptionIFO || 0}
                    ,@anchoredConsumptionIFO   = ${user.anchoredConsumptionIFO || 0}
                    ,@maneuverConsumptionIFO   = ${user.maneuverConsumptionIFO || 0}
                    ,@otherConsumptionIFO   = ${user.otherConsumptionIFO || 0}
                    ,@isDisplayLSFOConsumption   = ${user.isDisplayLSFOConsumption || 0}
                    ,@isDisplayMGOConsumption   = ${user.isDisplayMGOConsumption || 0}
                    ,@isDisplayAverageSpeed   = ${user.isDisplayAverageSpeed || 0}
                    ,@isDisplayDataMGO   = ${user.isDisplayDataMGO || 0}
                    ,@isDisplayDataLSFO   = ${user.isDisplayDataLSFO || 0}
                    ,@isDisplayVesselPerformanceLSFO   = ${user.isDisplayVesselPerformanceLSFO || 0}
                    ,@isDisplayVesselPerformanceMGO   = ${user.isDisplayVesselPerformanceMGO || 0}
                    ,@consumptionEquipmentME_MGO   = ${user.consumptionEquipmentME_MGO || 0}
                    ,@consumptionEquipmentAE_MGO   = ${user.consumptionEquipmentAE_MGO || 0}
                    ,@consumptionEquipmentBOILER_MGO   = ${user.consumptionEquipmentBOILER_MGO || 0}
                    ,@consumptionEquipmentIG_MGO   = ${user.consumptionEquipmentIG_MGO || 0}
                    ,@consumptionEquipmentPP_MGO   = ${user.consumptionEquipmentPP_MGO || 0}
                    ,@consumptionEquipmentOther_MGO   = ${user.consumptionEquipmentOther_MGO || 0}
                    ,@consumptionEquipmentME_IFO   = ${user.consumptionEquipmentME_IFO || 0}
                    ,@consumptionEquipmentAE_IFO   = ${user.consumptionEquipmentAE_IFO || 0}
                    ,@consumptionEquipmentBOILER_IFO   = ${user.consumptionEquipmentBOILER_IFO || 0}
                    ,@consumptionEquipmentOther_IFO   = ${user.consumptionEquipmentOther_IFO || 0}
                    ,@userIdCreated   = ${user.userIdCreated || 0}
                    ,@dateCreated   = '${user.dateCreated || ''}'
                    ,@userIdUpdated   = ${user.userIdUpdated || 0}
                    ,@dateUpdated   = '${user.dateUpdated || ''}'
                    ,@status   = ${user.status || 0}
                    `);
            }
            else {
                return this.userRepository.save(user);
            }
        })
            .then((resultSave) => {
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
        });
    }
    async UpdateUserNickUnique(user) {
        let contraseniaOld = '';
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`
                        EXEC SP_BuscarUsuarioPorId
                        @userId ='${user.id || ''}'
                    `);
            }
            else {
                return this.userRepository.find({
                    where: [
                        { id: user.id },
                    ],
                });
            }
        })
            .then(resultFind => {
            if (!resultFind || resultFind.length == 0)
                throw new Error('user_does_not_exist');
            let userfind = resultFind[0];
            contraseniaOld = userfind.password;
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`
                EXEC SP_GETEmailEstaEnUso @userId = ${user.id || 0}, @nick = '${user.nick || ''}' 
                `);
            }
            else {
                return this.userRepository.find({
                    where: [
                        {
                            id: (0, typeorm_4.Not)(user.id),
                            nick: user.nick,
                            status: (0, typeorm_4.Not)(false),
                        },
                    ],
                });
            }
        })
            .then(result => {
            if (!result)
                throw 'REPEAT NICK ERROR:22323';
            if (result && result.length > 0)
                throw 'REPEAT_NICK';
            if (user.password) {
                return bcrypt.hash(user.password, bcrypt_config_1.ROUNDS_BCRYPT);
            }
            else {
                return contraseniaOld;
            }
        })
            .then((password) => {
            if (!password)
                throw new Error('Revisar User.service la funcion hash o el retun no, respondio como se esperaba.');
            user.password = password;
            user.years = JSON.stringify(user.years);
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`
                                        
                    EXEC SP_UpdateUser
                    @id = '${user.id}'
                    ,@nick ='${user.nick || ''}'
                    ,@name ='${user.name || ''}'
                    ,@filename ='${user.filename || ''}'
                    ,@password ='${user.password || ''}'
                    ,@language ='${user.language || ''}'
                    ,@role ='${user.role || ''}'
                    ,@years  ='${user.years || '[]'}'
                    ,@minSpeed  = ${user.minSpeed || 0}
                    ,@maxSpeed  = ${user.maxSpeed || 0}
                    ,@isConsumptionIFO  = ${user.isConsumptionIFO || 0}
                    ,@isConsumptionLSFO = ${user.isConsumptionLSFO || 0}
                    ,@isConsumptionVLSFO  = ${user.isConsumptionVLSFO || 0}
                    ,@isConsumptionMGO   = ${user.isConsumptionMGO || 0}
                    ,@maxIFOConsumption   = ${user.maxIFOConsumption || 0}
                    ,@maxMGOConsumption   = ${user.maxMGOConsumption || 0}
                    ,@minIFOConsumption   = ${user.minIFOConsumption || 0}
                    ,@minMGOConsumption   = ${user.minMGOConsumption || 0}
                    ,@isMEMGO   = ${user.isMEMGO || 0}
                    ,@isAEMGO   = ${user.isAEMGO || 0}
                    ,@isBoilerMGO   = ${user.isBoilerMGO || 0}
                    ,@isIGMGO   = ${user.isIGMGO || 0}
                    ,@isPowerPMGO   = ${user.isPowerPMGO || 0}
                    ,@isOtherMGO   = ${user.isOtherMGO || 0}
                    ,@isMEIFO   = ${user.isMEIFO || 0}
                    ,@isAEIFO   = ${user.isAEIFO || 0}
                    ,@isBoilerIFO   = ${user.isBoilerIFO || 0}
                    ,@isOtherIFO   = ${user.isOtherIFO || 0}
                    ,@contractSpeedSailingBallastMGO   = ${user.contractSpeedSailingBallastMGO || 0}
                    ,@contractSpeedSailingLadenMGO   = ${user.contractSpeedSailingLadenMGO || 0}
                    ,@contractSpeedSailingEconomicalMGO   = ${user.contractSpeedSailingEconomicalMGO || 0}
                    ,@loadingConsumptionMGO   = ${user.loadingConsumptionMGO || 0}
                    ,@dischargeConsumptionMGO   = ${user.dischargeConsumptionMGO || 0}
                    ,@sailingBallastConsumptionMGO   = ${user.sailingBallastConsumptionMGO || 0}
                    ,@sailingLoadConsumptionMGO   = ${user.sailingLoadConsumptionMGO || 0}
                    ,@sailingEconomicConsumptionMGO   = ${user.sailingEconomicConsumptionMGO || 0}
                    ,@anchoredConsumptionMGO   = ${user.anchoredConsumptionMGO || 0}
                    ,@maneuverConsumptionMGO   = ${user.maneuverConsumptionMGO || 0}
                    ,@otherConsumptionMGO   = ${user.otherConsumptionMGO || 0}
                    ,@contractSpeedSailingBallastIFO   = ${user.contractSpeedSailingBallastIFO || 0}
                    ,@contractSpeedSailingLadenIFO   = ${user.contractSpeedSailingLadenIFO || 0}
                    ,@contractSpeedSailingEconomicalIFO   = ${user.contractSpeedSailingEconomicalIFO || 0}
                    ,@loadingConsumptionIFO   = ${user.loadingConsumptionIFO || 0}
                    ,@dischargeConsumptionIFO   = ${user.dischargeConsumptionIFO || 0}
                    ,@sailingBallastConsumptionIFO   = ${user.sailingBallastConsumptionIFO || 0}
                    ,@sailingLoadConsumptionIFO   = ${user.sailingLoadConsumptionIFO || 0}
                    ,@sailingEconomicConsumptionIFO   = ${user.sailingEconomicConsumptionIFO || 0}
                    ,@anchoredConsumptionIFO   = ${user.anchoredConsumptionIFO || 0}
                    ,@maneuverConsumptionIFO   = ${user.maneuverConsumptionIFO || 0}
                    ,@otherConsumptionIFO   = ${user.otherConsumptionIFO || 0}
                    ,@isDisplayLSFOConsumption   = ${user.isDisplayLSFOConsumption || 0}
                    ,@isDisplayMGOConsumption   = ${user.isDisplayMGOConsumption || 0}
                    ,@isDisplayAverageSpeed   = ${user.isDisplayAverageSpeed || 0}
                    ,@isDisplayDataMGO   = ${user.isDisplayDataMGO || 0}
                    ,@isDisplayDataLSFO   = ${user.isDisplayDataLSFO || 0}
                    ,@isDisplayVesselPerformanceLSFO   = ${user.isDisplayVesselPerformanceLSFO || 0}
                    ,@isDisplayVesselPerformanceMGO   = ${user.isDisplayVesselPerformanceMGO || 0}
                    ,@consumptionEquipmentME_MGO   = ${user.consumptionEquipmentME_MGO || 0}
                    ,@consumptionEquipmentAE_MGO   = ${user.consumptionEquipmentAE_MGO || 0}
                    ,@consumptionEquipmentBOILER_MGO   = ${user.consumptionEquipmentBOILER_MGO || 0}
                    ,@consumptionEquipmentIG_MGO   = ${user.consumptionEquipmentIG_MGO || 0}
                    ,@consumptionEquipmentPP_MGO   = ${user.consumptionEquipmentPP_MGO || 0}
                    ,@consumptionEquipmentOther_MGO   = ${user.consumptionEquipmentOther_MGO || 0}
                    ,@consumptionEquipmentME_IFO   = ${user.consumptionEquipmentME_IFO || 0}
                    ,@consumptionEquipmentAE_IFO   = ${user.consumptionEquipmentAE_IFO || 0}
                    ,@consumptionEquipmentBOILER_IFO   = ${user.consumptionEquipmentBOILER_IFO || 0}
                    ,@consumptionEquipmentOther_IFO   = ${user.consumptionEquipmentOther_IFO || 0}
                    ,@userIdUpdated   = ${user.userIdUpdated || 0}
                    ,@dateUpdated   = '${user.dateUpdated || ''}'
                    ,@status   = ${user.status || 0}

`);
            }
            else {
                return this.userRepository.update(user.id, user);
            }
        })
            .then(resultUpdate => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (!resultUpdate || !resultUpdate.length)
                    throw new Error('userRepository.update no respondio como esperabamos.');
            }
            else {
                if (!resultUpdate)
                    throw new Error('userRepository.update no respondio como esperabamos.');
            }
            user.password = '';
            return user;
        });
    }
    async Delete(userId, deleteUserId) {
        let user = new user_entity_1.UserEntity();
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`SP_BuscarUsuarioPorId @userId= ${userId}`);
            }
            else {
                return this.userRepository.find({
                    where: [
                        { id: userId },
                    ],
                });
            }
        })
            .then(resultFind => {
            if (!resultFind || resultFind.length == 0)
                throw new Error('user_does_not_exist');
            user = resultFind[0];
            user.status = false;
            user.userIdUpdated = deleteUserId;
            user.dateUpdated = (0, moment_assets_1.GetDate)();
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`

                EXEC SP_UpdateUser
                @id = '${user.id}'
                ,@nick ='${user.nick || ''}'
                ,@name ='${user.name || ''}'
                ,@filename ='${user.filename || ''}'
                ,@password ='${user.password || ''}'
                ,@language ='${user.language || ''}'
                ,@role ='${user.role || ''}'
                ,@years  ='[]'
                ,@minSpeed  = ${user.minSpeed || 0}
                ,@maxSpeed  = ${user.maxSpeed || 0}
                ,@isConsumptionIFO  = ${user.isConsumptionIFO || 0}
                ,@isConsumptionLSFO = ${user.isConsumptionLSFO || 0}
                ,@isConsumptionVLSFO  = ${user.isConsumptionVLSFO || 0}
                ,@isConsumptionMGO   = ${user.isConsumptionMGO || 0}
                ,@maxIFOConsumption   = ${user.maxIFOConsumption || 0}
                ,@maxMGOConsumption   = ${user.maxMGOConsumption || 0}
                ,@minIFOConsumption   = ${user.minIFOConsumption || 0}
                ,@minMGOConsumption   = ${user.minMGOConsumption || 0}
                ,@isMEMGO   = ${user.isMEMGO || 0}
                ,@isAEMGO   = ${user.isAEMGO || 0}
                ,@isBoilerMGO   = ${user.isBoilerMGO || 0}
                ,@isIGMGO   = ${user.isIGMGO || 0}
                ,@isPowerPMGO   = ${user.isPowerPMGO || 0}
                ,@isOtherMGO   = ${user.isOtherMGO || 0}
                ,@isMEIFO   = ${user.isMEIFO || 0}
                ,@isAEIFO   = ${user.isAEIFO || 0}
                ,@isBoilerIFO   = ${user.isBoilerIFO || 0}
                ,@isOtherIFO   = ${user.isOtherIFO || 0}
                ,@contractSpeedSailingBallastMGO   = ${user.contractSpeedSailingBallastMGO || 0}
                ,@contractSpeedSailingLadenMGO   = ${user.contractSpeedSailingLadenMGO || 0}
                ,@contractSpeedSailingEconomicalMGO   = ${user.contractSpeedSailingEconomicalMGO || 0}
                ,@loadingConsumptionMGO   = ${user.loadingConsumptionMGO || 0}
                ,@dischargeConsumptionMGO   = ${user.dischargeConsumptionMGO || 0}
                ,@sailingBallastConsumptionMGO   = ${user.sailingBallastConsumptionMGO || 0}
                ,@sailingLoadConsumptionMGO   = ${user.sailingLoadConsumptionMGO || 0}
                ,@sailingEconomicConsumptionMGO   = ${user.sailingEconomicConsumptionMGO || 0}
                ,@anchoredConsumptionMGO   = ${user.anchoredConsumptionMGO || 0}
                ,@maneuverConsumptionMGO   = ${user.maneuverConsumptionMGO || 0}
                ,@otherConsumptionMGO   = ${user.otherConsumptionMGO || 0}
                ,@contractSpeedSailingBallastIFO   = ${user.contractSpeedSailingBallastIFO || 0}
                ,@contractSpeedSailingLadenIFO   = ${user.contractSpeedSailingLadenIFO || 0}
                ,@contractSpeedSailingEconomicalIFO   = ${user.contractSpeedSailingEconomicalIFO || 0}
                ,@loadingConsumptionIFO   = ${user.loadingConsumptionIFO || 0}
                ,@dischargeConsumptionIFO   = ${user.dischargeConsumptionIFO || 0}
                ,@sailingBallastConsumptionIFO   = ${user.sailingBallastConsumptionIFO || 0}
                ,@sailingLoadConsumptionIFO   = ${user.sailingLoadConsumptionIFO || 0}
                ,@sailingEconomicConsumptionIFO   = ${user.sailingEconomicConsumptionIFO || 0}
                ,@anchoredConsumptionIFO   = ${user.anchoredConsumptionIFO || 0}
                ,@maneuverConsumptionIFO   = ${user.maneuverConsumptionIFO || 0}
                ,@otherConsumptionIFO   = ${user.otherConsumptionIFO || 0}
                ,@isDisplayLSFOConsumption   = ${user.isDisplayLSFOConsumption || 0}
                ,@isDisplayMGOConsumption   = ${user.isDisplayMGOConsumption || 0}
                ,@isDisplayAverageSpeed   = ${user.isDisplayAverageSpeed || 0}
                ,@isDisplayDataMGO   = ${user.isDisplayDataMGO || 0}
                ,@isDisplayDataLSFO   = ${user.isDisplayDataLSFO || 0}
                ,@isDisplayVesselPerformanceLSFO   = ${user.isDisplayVesselPerformanceLSFO || 0}
                ,@isDisplayVesselPerformanceMGO   = ${user.isDisplayVesselPerformanceMGO || 0}
                ,@consumptionEquipmentME_MGO   = ${user.consumptionEquipmentME_MGO || 0}
                ,@consumptionEquipmentAE_MGO   = ${user.consumptionEquipmentAE_MGO || 0}
                ,@consumptionEquipmentBOILER_MGO   = ${user.consumptionEquipmentBOILER_MGO || 0}
                ,@consumptionEquipmentIG_MGO   = ${user.consumptionEquipmentIG_MGO || 0}
                ,@consumptionEquipmentPP_MGO   = ${user.consumptionEquipmentPP_MGO || 0}
                ,@consumptionEquipmentOther_MGO   = ${user.consumptionEquipmentOther_MGO || 0}
                ,@consumptionEquipmentME_IFO   = ${user.consumptionEquipmentME_IFO || 0}
                ,@consumptionEquipmentAE_IFO   = ${user.consumptionEquipmentAE_IFO || 0}
                ,@consumptionEquipmentBOILER_IFO   = ${user.consumptionEquipmentBOILER_IFO || 0}
                ,@consumptionEquipmentOther_IFO   = ${user.consumptionEquipmentOther_IFO || 0}
                ,@userIdUpdated   = ${user.userIdUpdated || 0}
                ,@dateUpdated   = '${user.dateUpdated || ''}'
                ,@status   = ${user.status || 0}

                `);
            }
            else {
                return this.userRepository.update(user.id, user);
            }
        })
            .then(resultSave => {
            if (!resultSave)
                throw new Error('error_user_save');
            user.password = '';
            return user;
        });
    }
    async GetUserByNick(nick) {
        return await (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`
                        EXEC SP_GetUserByNick
                            @nick = ${nick}
                    `);
            }
            else {
                return this.userRepository.find({
                    where: [
                        { nick: nick, status: (0, typeorm_4.Not)(false) },
                    ],
                });
            }
        })
            .then((resultUser) => {
            if (!resultUser || (resultUser && !resultUser.length))
                throw new Error('user_was_not_found');
            return resultUser[0];
        });
    }
    async UpdateImageUser(id, newFilename) {
        let urlImage = server_config_1.URL_Server.back + '/' + newFilename;
        return await (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.userRepository.query(`
                        EXEC SP_UpdateImageUser @id = ${id} ,@urlImage = '${urlImage}'
                    `);
            }
            else {
                return this.userRepository.update(id, { filename: urlImage });
            }
        })
            .then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('userRepository.update no respondio como esperabamos.');
            return urlImage;
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map