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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const promises_assets_1 = require("../../assets/promises.assets");
const jwtDecode_assets_1 = require("../../assets/jwtDecode.assets");
const multer_1 = require("multer");
const moment_assets_1 = require("../../assets/moment.assets");
const user_entity_1 = require("../../models/user.entity");
const platform_express_1 = require("@nestjs/platform-express");
const image_middleware_1 = require("../../middleware/image.middleware");
const path_config_1 = require("../../config/path.config");
let UsersController = class UsersController {
    constructor(_usersService) {
        this._usersService = _usersService;
    }
    async Get(headers, id) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)()
            .then((result) => {
            let userId = Number(id);
            if (userId && headerToken.id) {
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                }
                else {
                    if (headerToken.id !== id)
                        throw new Error('ERROR_USERID_FAIL');
                }
                return this._usersService.Get(userId);
            }
            else {
                throw new Error('MISSING_FIELS');
            }
        })
            .then((resultGet) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultGet,
            };
        })
            .catch(err => {
            const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
            const errorMsg = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    async Gets(headers, user) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)()
            .then((resultDummy) => {
            if (headerToken && (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' || headerToken.role == 'OWNER') && user) {
                return this._usersService.Gets(user);
            }
            else {
                if (Number(user.id) === Number(headerToken.id)) {
                    return this._usersService.Gets(user);
                }
                else {
                    throw new Error('MISSING_FIELS');
                }
            }
        })
            .then((results) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: results,
            };
        })
            .catch(err => {
            const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
            const errorMsg = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    async Create(headers, user) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)()
            .then((resultDummy) => {
            if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                throw new Error('Se esta intentado registrar con un rol no valido.');
            }
            if (user && user.name && user.nick && user.password && user.role) {
                user.years = user.years || '[]';
                user.minSpeed = user.minSpeed || 0;
                user.maxSpeed = user.maxSpeed || 0;
                user.isConsumptionIFO = user.isConsumptionIFO || false;
                user.isConsumptionLSFO = user.isConsumptionLSFO || false;
                user.isConsumptionMGO = user.isConsumptionMGO || false;
                user.maxIFOConsumption = user.maxIFOConsumption || 0;
                user.maxMGOConsumption = user.maxMGOConsumption || 0;
                user.minIFOConsumption = user.minIFOConsumption || 0;
                user.minMGOConsumption = user.minMGOConsumption || 0;
                user.isMEMGO = user.isMEMGO || false;
                user.isAEMGO = user.isAEMGO || false;
                user.isBoilerMGO = user.isBoilerMGO || false;
                user.isIGMGO = user.isIGMGO || false;
                user.isPowerPMGO = user.isPowerPMGO || false;
                user.isOtherMGO = user.isOtherMGO || false;
                user.isMEIFO = user.isMEIFO || false;
                user.isAEIFO = user.isAEIFO || false;
                user.isBoilerIFO = user.isBoilerIFO || false;
                user.isOtherIFO = user.isOtherIFO || false;
                user.contractSpeedSailingBallastMGO = user.contractSpeedSailingBallastMGO || 0;
                user.contractSpeedSailingLadenMGO = user.contractSpeedSailingLadenMGO || 0;
                user.contractSpeedSailingEconomicalMGO = user.contractSpeedSailingEconomicalMGO || 0;
                user.loadingConsumptionMGO = user.loadingConsumptionMGO || 0;
                user.dischargeConsumptionMGO = user.dischargeConsumptionMGO || 0;
                user.sailingBallastConsumptionMGO = user.sailingBallastConsumptionMGO || 0;
                user.sailingLoadConsumptionMGO = user.sailingLoadConsumptionMGO || 0;
                user.sailingEconomicConsumptionMGO = user.sailingEconomicConsumptionMGO || 0;
                user.anchoredConsumptionMGO = user.anchoredConsumptionMGO || 0;
                user.maneuverConsumptionMGO = user.maneuverConsumptionMGO || 0;
                user.otherConsumptionMGO = user.otherConsumptionMGO || 0;
                user.contractSpeedSailingBallastIFO = user.contractSpeedSailingBallastIFO || 0;
                user.contractSpeedSailingLadenIFO = user.contractSpeedSailingLadenIFO || 0;
                user.contractSpeedSailingEconomicalIFO = user.contractSpeedSailingEconomicalIFO || 0;
                user.loadingConsumptionIFO = user.loadingConsumptionIFO || 0;
                user.dischargeConsumptionIFO = user.dischargeConsumptionIFO || 0;
                user.sailingBallastConsumptionIFO = user.sailingBallastConsumptionIFO || 0;
                user.sailingLoadConsumptionIFO = user.sailingLoadConsumptionIFO || 0;
                user.sailingEconomicConsumptionIFO = user.sailingEconomicConsumptionIFO || 0;
                user.anchoredConsumptionIFO = user.anchoredConsumptionIFO || 0;
                user.maneuverConsumptionIFO = user.maneuverConsumptionIFO || 0;
                user.otherConsumptionIFO = user.otherConsumptionIFO || 0;
                user.isDisplayLSFOConsumption = user.isDisplayLSFOConsumption || false;
                user.isDisplayMGOConsumption = user.isDisplayMGOConsumption || false;
                user.isDisplayAverageSpeed = user.isDisplayAverageSpeed || false;
                user.isDisplayDataMGO = user.isDisplayDataMGO || false;
                user.isDisplayDataLSFO = user.isDisplayDataLSFO || false;
                user.isDisplayVesselPerformanceLSFO = user.isDisplayVesselPerformanceLSFO || false;
                user.isDisplayVesselPerformanceMGO = user.isDisplayVesselPerformanceMGO || false;
                user.consumptionEquipmentME_MGO = user.consumptionEquipmentME_MGO || 0;
                user.consumptionEquipmentAE_MGO = user.consumptionEquipmentAE_MGO || 0;
                user.consumptionEquipmentBOILER_MGO = user.consumptionEquipmentBOILER_MGO || 0;
                user.consumptionEquipmentIG_MGO = user.consumptionEquipmentIG_MGO || 0;
                user.consumptionEquipmentPP_MGO = user.consumptionEquipmentPP_MGO || 0;
                user.consumptionEquipmentOther_MGO = user.consumptionEquipmentOther_MGO || 0;
                user.consumptionEquipmentME_IFO = user.consumptionEquipmentME_IFO || 0;
                user.consumptionEquipmentAE_IFO = user.consumptionEquipmentAE_IFO || 0;
                user.consumptionEquipmentBOILER_IFO = user.consumptionEquipmentBOILER_IFO || 0;
                user.consumptionEquipmentOther_IFO = user.consumptionEquipmentOther_IFO || 0;
                user.userIdCreated = headerToken.id;
                user.dateCreated = (0, moment_assets_1.GetDate)();
                delete user.userIdUpdated;
                delete user.dateUpdated;
                user.status = Boolean(user.status);
                return this._usersService.CreateUserNickUnique(user);
            }
            else {
                throw 'MISSING_FIELS';
            }
        })
            .then((resultCreate) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultCreate,
            };
        })
            .catch(err => {
            const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
            const errorMsg = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    async UpdateUser(headers, id, user) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)()
            .then((resultDummy) => {
            if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                throw new Error('Se esta intentado registrar con un rol no valido.');
            }
            if (!isNaN(id) && user && user.name && user.nick && user.password && user.role) {
                user.id = Number(id);
                user.years = user.years || '[]';
                user.minSpeed = user.minSpeed || 0;
                user.maxSpeed = user.maxSpeed || 0;
                user.isConsumptionIFO = user.isConsumptionIFO || false;
                user.isConsumptionLSFO = user.isConsumptionLSFO || false;
                user.isConsumptionMGO = user.isConsumptionMGO || false;
                user.maxIFOConsumption = user.maxIFOConsumption || 0;
                user.maxMGOConsumption = user.maxMGOConsumption || 0;
                user.minIFOConsumption = user.minIFOConsumption || 0;
                user.minMGOConsumption = user.minMGOConsumption || 0;
                user.isMEMGO = user.isMEMGO || false;
                user.isAEMGO = user.isAEMGO || false;
                user.isBoilerMGO = user.isBoilerMGO || false;
                user.isIGMGO = user.isIGMGO || false;
                user.isPowerPMGO = user.isPowerPMGO || false;
                user.isOtherMGO = user.isOtherMGO || false;
                user.isMEIFO = user.isMEIFO || false;
                user.isAEIFO = user.isAEIFO || false;
                user.isBoilerIFO = user.isBoilerIFO || false;
                user.isOtherIFO = user.isOtherIFO || false;
                user.contractSpeedSailingBallastMGO = user.contractSpeedSailingBallastMGO || 0;
                user.contractSpeedSailingLadenMGO = user.contractSpeedSailingLadenMGO || 0;
                user.contractSpeedSailingEconomicalMGO = user.contractSpeedSailingEconomicalMGO || 0;
                user.loadingConsumptionMGO = user.loadingConsumptionMGO || 0;
                user.dischargeConsumptionMGO = user.dischargeConsumptionMGO || 0;
                user.sailingBallastConsumptionMGO = user.sailingBallastConsumptionMGO || 0;
                user.sailingLoadConsumptionMGO = user.sailingLoadConsumptionMGO || 0;
                user.sailingEconomicConsumptionMGO = user.sailingEconomicConsumptionMGO || 0;
                user.anchoredConsumptionMGO = user.anchoredConsumptionMGO || 0;
                user.maneuverConsumptionMGO = user.maneuverConsumptionMGO || 0;
                user.otherConsumptionMGO = user.otherConsumptionMGO || 0;
                user.contractSpeedSailingBallastIFO = user.contractSpeedSailingBallastIFO || 0;
                user.contractSpeedSailingLadenIFO = user.contractSpeedSailingLadenIFO || 0;
                user.contractSpeedSailingEconomicalIFO = user.contractSpeedSailingEconomicalIFO || 0;
                user.loadingConsumptionIFO = user.loadingConsumptionIFO || 0;
                user.dischargeConsumptionIFO = user.dischargeConsumptionIFO || 0;
                user.sailingBallastConsumptionIFO = user.sailingBallastConsumptionIFO || 0;
                user.sailingLoadConsumptionIFO = user.sailingLoadConsumptionIFO || 0;
                user.sailingEconomicConsumptionIFO = user.sailingEconomicConsumptionIFO || 0;
                user.anchoredConsumptionIFO = user.anchoredConsumptionIFO || 0;
                user.maneuverConsumptionIFO = user.maneuverConsumptionIFO || 0;
                user.otherConsumptionIFO = user.otherConsumptionIFO || 0;
                user.isDisplayLSFOConsumption = user.isDisplayLSFOConsumption || false;
                user.isDisplayMGOConsumption = user.isDisplayMGOConsumption || false;
                user.isDisplayAverageSpeed = user.isDisplayAverageSpeed || false;
                user.isDisplayDataMGO = user.isDisplayDataMGO || false;
                user.isDisplayDataLSFO = user.isDisplayDataLSFO || false;
                user.isDisplayVesselPerformanceLSFO = user.isDisplayVesselPerformanceLSFO || false;
                user.isDisplayVesselPerformanceMGO = user.isDisplayVesselPerformanceMGO || false;
                user.consumptionEquipmentME_MGO = user.consumptionEquipmentME_MGO || 0;
                user.consumptionEquipmentAE_MGO = user.consumptionEquipmentAE_MGO || 0;
                user.consumptionEquipmentBOILER_MGO = user.consumptionEquipmentBOILER_MGO || 0;
                user.consumptionEquipmentIG_MGO = user.consumptionEquipmentIG_MGO || 0;
                user.consumptionEquipmentPP_MGO = user.consumptionEquipmentPP_MGO || 0;
                user.consumptionEquipmentOther_MGO = user.consumptionEquipmentOther_MGO || 0;
                user.consumptionEquipmentME_IFO = user.consumptionEquipmentME_IFO || 0;
                user.consumptionEquipmentAE_IFO = user.consumptionEquipmentAE_IFO || 0;
                user.consumptionEquipmentBOILER_IFO = user.consumptionEquipmentBOILER_IFO || 0;
                user.consumptionEquipmentOther_IFO = user.consumptionEquipmentOther_IFO || 0;
                delete user.userIdCreated;
                delete user.dateCreated;
                user.userIdUpdated = headerToken.id;
                user.dateUpdated = (0, moment_assets_1.GetDate)();
                user.status = Boolean(user.status);
                return this._usersService.UpdateUserNickUnique(user);
            }
            else {
                throw 'MISSING_FIELS';
            }
        })
            .then((resultUpdate) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultUpdate,
            };
        })
            .catch(err => {
            const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
            const errorMsg = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    async delete(headers, id) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)()
            .then((resultDummy) => {
            if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                throw new Error('Se esta intentado registrar con un rol no valido.');
            }
            if (Number(id)) {
                return this._usersService.Delete(id, headerToken.id);
            }
            else {
                throw new Error('MISSING_FIELS');
            }
        })
            .then((resultUpdate) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultUpdate,
            };
        })
            .catch(err => {
            const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
            const errorMsg = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
    async UploadImagePerfil(headers, id, file) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)()
            .then((resultDummy) => {
            if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                throw new Error('Se esta intentado registrar con un rol no valido.');
            }
            if (!file || !file.filename) {
                throw 'MISSING_IMAGE';
            }
            return this._usersService.UpdateImageUser(id, file.filename);
        })
            .then((resultFilenameUpdate) => {
            if (!resultFilenameUpdate)
                throw new Error('No se guardo la imagen correctamente.');
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultFilenameUpdate,
            };
        })
            .catch(err => {
            const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
            const errorMsg = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "Get", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "Gets", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "Create", null);
__decorate([
    (0, common_1.Put)(':id/update'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "UpdateUser", null);
__decorate([
    (0, common_1.Delete)(':id/delete'),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: path_config_1.FOLDER_UPLOADS,
            filename: image_middleware_1.EditFileName,
        }),
        fileFilter: image_middleware_1.ImageFileFilter,
    })),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "UploadImagePerfil", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map