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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentOilCompatibilityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
const server_config_1 = require("../../../config/server.config");
const promises_assets_1 = require("../../../assets/promises.assets");
const moment_assets_1 = require("../../../assets/moment.assets");
const mappingKeys_1 = require("../../../assets/mappingKeys");
const equipment_oil_compatibility_entity_1 = require("../../../models/equipment-oil-compatibility.entity");
let EquipmentOilCompatibilityService = class EquipmentOilCompatibilityService {
    constructor(_EquipmentOilCompatibilityEntity) {
        this._EquipmentOilCompatibilityEntity = _EquipmentOilCompatibilityEntity;
    }
    async Gets(equipmentOilCompatibility) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._EquipmentOilCompatibilityEntity.find({
                    where: [
                        {
                            id: equipmentOilCompatibility.id || (0, typeorm_3.Like)('%' + '%'),
                            userId: equipmentOilCompatibility.userId || (0, typeorm_3.Like)('%' + '%'),
                            status: (0, typeorm_4.Not)(false),
                        },
                    ],
                });
            }
        })
            .then((result) => {
            if (!result)
                throw 'ERROR AL CONSULTAR LOS aceites compatibles con el equipo.';
            return result;
        });
    }
    async Create(equipmentOilCompatibility) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._EquipmentOilCompatibilityEntity.query("SP_CheckTheLastRecordedTrip @userId='" +
                    equipmentOilCompatibility.userId +
                    "', @year='");
            }
            else {
                return this._EquipmentOilCompatibilityEntity.save(equipmentOilCompatibility);
            }
        })
            .then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el aceite compatible.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el aceite compatible.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async SaveList(MappingOils, MappingEquipmentSystems, equipmentOilCompatibilitys) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        let MappingConsumptionsEquipment = [];
        const addEquipmentOilCompatibilitys = equipmentOilCompatibilitys.filter((equipmentOilCompatibility) => equipmentOilCompatibility.SyncStatus == 'added');
        const updateEquipmentOilCompatibilitys = equipmentOilCompatibilitys.filter((equipmentOilCompatibility) => equipmentOilCompatibility.SyncStatus == 'updated');
        const deleteEquipmentOilCompatibilitys = equipmentOilCompatibilitys.filter((equipmentOilCompatibility) => equipmentOilCompatibility.SyncStatus == 'deleted');
        let listDeConsumosRegistrados = [];
        try {
            for (var _k = true, addEquipmentOilCompatibilitys_1 = __asyncValues(addEquipmentOilCompatibilitys), addEquipmentOilCompatibilitys_1_1; addEquipmentOilCompatibilitys_1_1 = await addEquipmentOilCompatibilitys_1.next(), _a = addEquipmentOilCompatibilitys_1_1.done, !_a; _k = true) {
                _c = addEquipmentOilCompatibilitys_1_1.value;
                _k = false;
                const addEquipmentOilCompatibility = _c;
                let searchMappingOils = (0, mappingKeys_1.searchKey)(MappingOils, addEquipmentOilCompatibility.entityOilId);
                let searchMappingEquipmentSystems = (0, mappingKeys_1.searchKey)(MappingEquipmentSystems, addEquipmentOilCompatibility.entityEquipmentId);
                let newEquipmentOilCompatibilityEntity = new equipment_oil_compatibility_entity_1.EquipmentOilCompatibilityEntity();
                delete newEquipmentOilCompatibilityEntity.id;
                newEquipmentOilCompatibilityEntity.userId =
                    addEquipmentOilCompatibility.userId;
                newEquipmentOilCompatibilityEntity.entityOilId =
                    addEquipmentOilCompatibility.entityOilId;
                if (searchMappingOils) {
                    newEquipmentOilCompatibilityEntity.entityOilId =
                        searchMappingOils.value;
                }
                newEquipmentOilCompatibilityEntity.entityEquipmentId =
                    addEquipmentOilCompatibility.entityEquipmentId;
                if (searchMappingEquipmentSystems) {
                    newEquipmentOilCompatibilityEntity.entityEquipmentId =
                        searchMappingEquipmentSystems.value;
                }
                newEquipmentOilCompatibilityEntity.userIdCreated =
                    addEquipmentOilCompatibility.userIdCreated;
                newEquipmentOilCompatibilityEntity.dateCreated = (0, moment_assets_1.GetDate)();
                delete newEquipmentOilCompatibilityEntity.userIdUpdated;
                delete newEquipmentOilCompatibilityEntity.dateUpdated;
                newEquipmentOilCompatibilityEntity.status = Boolean(addEquipmentOilCompatibility.status);
                let registeredConsumptionEquipmentEntity = await this.Create(newEquipmentOilCompatibilityEntity);
                MappingConsumptionsEquipment.push(new mappingKeys_1.Mapping(addEquipmentOilCompatibility.id, registeredConsumptionEquipmentEntity.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = addEquipmentOilCompatibilitys_1.return)) await _b.call(addEquipmentOilCompatibilitys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _l = true, updateEquipmentOilCompatibilitys_1 = __asyncValues(updateEquipmentOilCompatibilitys), updateEquipmentOilCompatibilitys_1_1; updateEquipmentOilCompatibilitys_1_1 = await updateEquipmentOilCompatibilitys_1.next(), _d = updateEquipmentOilCompatibilitys_1_1.done, !_d; _l = true) {
                _f = updateEquipmentOilCompatibilitys_1_1.value;
                _l = false;
                const updateEquipmentOilCompatibility = _f;
                let searchMappingOils = (0, mappingKeys_1.searchKey)(MappingOils, updateEquipmentOilCompatibility.entityOilId);
                let searchMappingEquipmentSystems = (0, mappingKeys_1.searchKey)(MappingEquipmentSystems, updateEquipmentOilCompatibility.entityEquipmentId);
                let equipmentOilCompatibility = new equipment_oil_compatibility_entity_1.EquipmentOilCompatibilityEntity();
                equipmentOilCompatibility.id = updateEquipmentOilCompatibility.id;
                equipmentOilCompatibility.userId = updateEquipmentOilCompatibility.userId;
                equipmentOilCompatibility.entityOilId =
                    updateEquipmentOilCompatibility.entityOilId;
                if (searchMappingOils) {
                    equipmentOilCompatibility.entityOilId = searchMappingOils.value;
                }
                equipmentOilCompatibility.entityEquipmentId =
                    updateEquipmentOilCompatibility.entityEquipmentId;
                if (searchMappingEquipmentSystems) {
                    equipmentOilCompatibility.entityEquipmentId =
                        searchMappingEquipmentSystems.value;
                }
                equipmentOilCompatibility.userIdCreated =
                    updateEquipmentOilCompatibility.userIdCreated;
                equipmentOilCompatibility.dateCreated =
                    updateEquipmentOilCompatibility.dateCreated;
                equipmentOilCompatibility.userIdUpdated =
                    updateEquipmentOilCompatibility.userIdUpdated;
                equipmentOilCompatibility.dateUpdated =
                    updateEquipmentOilCompatibility.dateUpdated;
                equipmentOilCompatibility.status = Boolean(updateEquipmentOilCompatibility.status);
                if (equipmentOilCompatibility.status) {
                    listDeConsumosRegistrados.push(equipmentOilCompatibility.id);
                }
                await this._EquipmentOilCompatibilityEntity.save(equipmentOilCompatibility);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_l && !_d && (_e = updateEquipmentOilCompatibilitys_1.return)) await _e.call(updateEquipmentOilCompatibilitys_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _m = true, deleteEquipmentOilCompatibilitys_1 = __asyncValues(deleteEquipmentOilCompatibilitys), deleteEquipmentOilCompatibilitys_1_1; deleteEquipmentOilCompatibilitys_1_1 = await deleteEquipmentOilCompatibilitys_1.next(), _g = deleteEquipmentOilCompatibilitys_1_1.done, !_g; _m = true) {
                _j = deleteEquipmentOilCompatibilitys_1_1.value;
                _m = false;
                let deleteEquipmentOilCompatibility = _j;
                let searchMappingOils = (0, mappingKeys_1.searchKey)(MappingOils, deleteEquipmentOilCompatibility.entityOilId);
                let searchMappingEquipmentSystems = (0, mappingKeys_1.searchKey)(MappingEquipmentSystems, deleteEquipmentOilCompatibility.entityEquipmentId);
                let equipmentOilCompatibility = new equipment_oil_compatibility_entity_1.EquipmentOilCompatibilityEntity();
                equipmentOilCompatibility.id = deleteEquipmentOilCompatibility.id;
                equipmentOilCompatibility.userId = deleteEquipmentOilCompatibility.userId;
                equipmentOilCompatibility.entityOilId =
                    deleteEquipmentOilCompatibility.entityOilId;
                if (searchMappingOils) {
                    equipmentOilCompatibility.entityOilId = searchMappingOils.value;
                }
                equipmentOilCompatibility.entityEquipmentId =
                    deleteEquipmentOilCompatibility.entityEquipmentId;
                if (searchMappingEquipmentSystems) {
                    equipmentOilCompatibility.entityEquipmentId =
                        searchMappingEquipmentSystems.value;
                }
                equipmentOilCompatibility.userIdCreated =
                    deleteEquipmentOilCompatibility.userIdCreated;
                equipmentOilCompatibility.dateCreated =
                    deleteEquipmentOilCompatibility.dateCreated;
                equipmentOilCompatibility.userIdUpdated =
                    deleteEquipmentOilCompatibility.userIdUpdated;
                equipmentOilCompatibility.dateUpdated =
                    deleteEquipmentOilCompatibility.dateUpdated;
                equipmentOilCompatibility.status = Boolean(deleteEquipmentOilCompatibility.status);
                await this._EquipmentOilCompatibilityEntity.save(equipmentOilCompatibility);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_g && (_h = deleteEquipmentOilCompatibilitys_1.return)) await _h.call(deleteEquipmentOilCompatibilitys_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return MappingConsumptionsEquipment;
    }
};
exports.EquipmentOilCompatibilityService = EquipmentOilCompatibilityService;
exports.EquipmentOilCompatibilityService = EquipmentOilCompatibilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(equipment_oil_compatibility_entity_1.EquipmentOilCompatibilityEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EquipmentOilCompatibilityService);
//# sourceMappingURL=equipment-oil-compatibility.service.js.map