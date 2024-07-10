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
exports.OilsController = void 0;
const common_1 = require("@nestjs/common");
const oils_service_1 = require("./oils.service");
const promises_assets_1 = require("../../assets/promises.assets");
const oil_entity_1 = require("../../models/oil.entity");
const jwtDecode_assets_1 = require("../../assets/jwtDecode.assets");
const moment_assets_1 = require("../../assets/moment.assets");
const group_oils_service_1 = require("./group-oils/group-oils.service");
const equipment_system_service_1 = require("./equipment-system/equipment-system.service");
const consumption_equipment_service_1 = require("./consumption-equipment/consumption-equipment.service");
const bunker_oil_service_1 = require("./bunker-oil/bunker-oil.service");
const nodemailer_assets_1 = require("../../assets/nodemailer.assets");
const equipment_oil_compatibility_service_1 = require("./equipment-oil-compatibility/equipment-oil-compatibility.service");
const equipment_oil_compatibility_entity_1 = require("../../models/equipment-oil-compatibility.entity");
let OilsController = class OilsController {
    constructor(_OilsService, _GroupOilEntityService, _EquipmentSystemService, _ConsumptionEquipmentService, _BunkerOilService, _EquipmentOilCompatibilityService) {
        this._OilsService = _OilsService;
        this._GroupOilEntityService = _GroupOilEntityService;
        this._EquipmentSystemService = _EquipmentSystemService;
        this._ConsumptionEquipmentService = _ConsumptionEquipmentService;
        this._BunkerOilService = _BunkerOilService;
        this._EquipmentOilCompatibilityService = _EquipmentOilCompatibilityService;
    }
    Gets(headers, oilEntity) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (oilEntity) {
                oilEntity.userId = Number(oilEntity.userId);
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (oilEntity.userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
            return this._OilsService.Gets(oilEntity);
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
    GetsDataServer(headers, oilEntity) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        let listOils = [];
        let listGroups = [];
        let listEquipmentSystem = [];
        let listConsumptionEquipment = [];
        let listBunkerOil = [];
        let listEquipmentOilCompatibilityEntity = [];
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (oilEntity) {
                oilEntity.userId = Number(oilEntity.userId);
                return true;
            }
            else
                throw new Error('MISSING_FIELS2222');
        }).then((resultValidate) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (oilEntity.userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
            let oilEntityFilter = {};
            oilEntityFilter.userId = oilEntity.userId;
            return this._OilsService.Gets(oilEntityFilter);
        }).then((Oils) => {
            listOils = Oils;
            let groupOilEntity = {};
            groupOilEntity.userId = oilEntity.userId;
            return this._GroupOilEntityService.Gets(groupOilEntity);
        }).then((GroupsOilEntity) => {
            listGroups = GroupsOilEntity;
            let equipmentSystemEntity = {};
            equipmentSystemEntity.userId = oilEntity.userId;
            return this._EquipmentSystemService.Gets(equipmentSystemEntity);
        }).then((EquipmentSystemsEntity) => {
            listEquipmentSystem = EquipmentSystemsEntity;
            let consumptionEquipmentEntity = {};
            consumptionEquipmentEntity.userId = oilEntity.userId;
            return this._ConsumptionEquipmentService.Gets(consumptionEquipmentEntity);
        }).then((ConsumptionsEquipmentEntity) => {
            listConsumptionEquipment = ConsumptionsEquipmentEntity;
            let bunkersOilEntity = {};
            bunkersOilEntity.userId = oilEntity.userId;
            return this._BunkerOilService.Gets(bunkersOilEntity);
        }).then((bunkersOilEntity) => {
            listBunkerOil = bunkersOilEntity;
            let equipmentOilCompatibility = {};
            equipmentOilCompatibility.userId = oilEntity.userId;
            return this._EquipmentOilCompatibilityService.Gets(equipmentOilCompatibility);
        }).then((equipmentOilCompatibilityEntity) => {
            listEquipmentOilCompatibilityEntity = equipmentOilCompatibilityEntity;
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: {
                    listOils: listOils,
                    listGroups: listGroups,
                    listEquipmentSystem: listEquipmentSystem,
                    listBunkerOil: listBunkerOil,
                    listEquipmentOilCompatibility: listEquipmentOilCompatibilityEntity,
                    listConsumptionEquipment: listConsumptionEquipment
                }
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
    async getDataBuque(buqueId) {
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(buqueId)) {
                let userId = Number(buqueId);
                return this._OilsService.ConsultarListaDeConsumosPorBuque(buqueId);
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
    async Get(id) {
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(id)) {
                let userId = Number(id);
                return this._OilsService.Get(userId);
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
    Create(headers, oilEntity) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (oilEntity && oilEntity.userId && oilEntity.name) {
                delete oilEntity.id;
                oilEntity.userIdCreated = headerToken.id;
                oilEntity.dateCreated = moment_assets_1.GetDate();
                delete oilEntity.userIdUpdated;
                delete oilEntity.dateUpdated;
                oilEntity.status = Boolean(oilEntity.status);
                return this._OilsService.Create(oilEntity);
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
    }
    async Update(headers, id, oilEntity) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (oilEntity && oilEntity.name && headerToken && headerToken.id) {
                oilEntity.id = Number(id);
                if (headerToken.role === 'SUPPORT' || headerToken.role === 'ADMIN') {
                }
                else if (Number(headerToken.id) !== Number(oilEntity.userId))
                    throw new Error('ERROR_USERID_FAIL');
                oilEntity.name = oilEntity.name || '';
                delete oilEntity.userIdCreated;
                delete oilEntity.dateCreated;
                oilEntity.userIdUpdated = headerToken.id;
                oilEntity.dateUpdated = moment_assets_1.GetDate();
                oilEntity.status = Boolean(oilEntity.status);
                return this._OilsService.Update(oilEntity);
            }
            else {
                throw 'MISSING_FIELS';
            }
        }).then((resultUpdate) => {
            if (!resultUpdate)
                throw new Error('TYPEORM_UPDATE_OIL_DETAIL');
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
                return this._OilsService.Get(id);
            }
            else {
                throw new Error('MISSING_FIELS');
            }
        }).then((result) => {
            result.status = false;
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (Number(headerToken.id) !== Number(result.userId))
                throw new Error('ERROR_USERID_FAIL');
            return this._OilsService.Delete(result, headerToken.id);
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
    async SaveDataLubricante(headers, saveDateOils) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        let mappingGroupOils = [];
        let mappingOils = [];
        let mappingBunkersOil = [];
        let mappingEquipmentSystems = [];
        let mappingEquipmentOilCompatibility = [];
        let mappingConsumptionsEquipment = [];
        let listConsumosValidarSendMail = [];
        console.log('--------------------------');
        console.log('-----------[   START saveModuleOils   ]---------------');
        console.log(JSON.stringify(saveDateOils));
        console.log('-----------[   END saveModuleOils   ]---------------');
        console.log('--------------------------');
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (saveDateOils) {
                if (saveDateOils.listGroups) {
                    return this._GroupOilEntityService.SaveList(saveDateOils.listGroups);
                }
                else {
                    return [];
                }
            }
            else
                throw 'MISSING_FIELS';
        }).then((resultMappingGroupOils) => {
            mappingGroupOils = resultMappingGroupOils;
            if (saveDateOils.listOils) {
                return this._OilsService.SaveList(saveDateOils.listOils);
            }
            else {
                return [];
            }
        }).then((resultMappingOil) => {
            mappingOils = resultMappingOil;
            if (saveDateOils.listBunkerOil) {
                return this._BunkerOilService.SaveList(mappingOils, saveDateOils.listBunkerOil);
            }
            else {
                return [];
            }
        }).then((resultBunkerOil) => {
            mappingBunkersOil = resultBunkerOil;
            if (saveDateOils.listEquipmentSystem) {
                return this._EquipmentSystemService.SaveList(mappingGroupOils, saveDateOils.listEquipmentSystem);
            }
            else {
                return [];
            }
        }).then((resultMappingEquipmentSystem) => {
            mappingEquipmentSystems = resultMappingEquipmentSystem;
            if (saveDateOils.listEquipmentOilCompatibility) {
                return this._EquipmentOilCompatibilityService.SaveList(mappingOils, mappingEquipmentSystems, saveDateOils.listEquipmentOilCompatibility);
            }
            else {
                return [];
            }
        }).then((resultMappingEquipmentOilCompatibility) => {
            mappingEquipmentOilCompatibility = resultMappingEquipmentOilCompatibility;
            if (saveDateOils.listConsumptionEquipment) {
                return this._ConsumptionEquipmentService.SaveList(mappingEquipmentOilCompatibility, saveDateOils.listConsumptionEquipment);
            }
            else {
                return {
                    MappingConsumptionsEquipment: [],
                    listConsumosValidarSendMail: []
                };
            }
        }).then((resultConsumptionEquipment) => {
            mappingConsumptionsEquipment = resultConsumptionEquipment.MappingConsumptionsEquipment;
            listConsumosValidarSendMail = resultConsumptionEquipment.listConsumosValidarSendMail;
            if (listConsumosValidarSendMail && listConsumosValidarSendMail.length && listConsumosValidarSendMail.length > 0) {
                console.log('Se realiza la consulta de consumos registrados');
                return this._OilsService.ConsultarListaDeConsumosRegistrados(listConsumosValidarSendMail);
            }
            else {
                return [];
            }
        }).then((listaDeConsumosRegistrados) => {
            if (listaDeConsumosRegistrados && listaDeConsumosRegistrados.length > 0) {
                return nodemailer_assets_1.SendMailHTMLOverCosumption('cristian.puma.es6@gmail.com; cpuma@transgas.com.pe; hcamasca@transgas.com.pe; agarcia@transgas.com.pe; eviana@transgas.com.pe;', headerToken.name, moment_assets_1.FormatDateUTCToDate(moment_assets_1.GetDate()), listaDeConsumosRegistrados);
            }
            else {
                return true;
            }
        }).then((resultSendMail) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: {
                    mappingGroupOils: mappingGroupOils,
                    mappingEquipmentSystems: mappingEquipmentSystems,
                    mappingConsumptionsEquipment: mappingConsumptionsEquipment,
                    mappingOils: mappingOils,
                    mappingBunkersOil: mappingBunkersOil,
                    mappingEquipmentOilCompatibility: mappingEquipmentOilCompatibility
                }
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
    common_1.Get(),
    __param(0, common_1.Headers()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, oil_entity_1.OilEntity]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Gets", null);
__decorate([
    common_1.Get('loadModuleOils'),
    __param(0, common_1.Headers()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, oil_entity_1.OilEntity]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "GetsDataServer", null);
__decorate([
    common_1.Get('getDataBuque/:userId'),
    __param(0, common_1.Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "getDataBuque", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Get", null);
__decorate([
    common_1.Post('create'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, oil_entity_1.OilEntity]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Create", null);
__decorate([
    common_1.Put(':id/update'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, oil_entity_1.OilEntity]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Update", null);
__decorate([
    common_1.Delete(':id/delete'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Delete", null);
__decorate([
    common_1.Post('saveModuleOils'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, oil_entity_1.DataModuleOils]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "SaveDataLubricante", null);
OilsController = __decorate([
    common_1.Controller('oils'),
    __metadata("design:paramtypes", [oils_service_1.OilsService,
        group_oils_service_1.GroupOilsService,
        equipment_system_service_1.EquipmentSystemService,
        consumption_equipment_service_1.ConsumptionEquipmentService,
        bunker_oil_service_1.BunkerOilService,
        equipment_oil_compatibility_service_1.EquipmentOilCompatibilityService])
], OilsController);
exports.OilsController = OilsController;
//# sourceMappingURL=oils.controller.js.map