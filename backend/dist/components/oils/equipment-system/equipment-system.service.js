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
exports.EquipmentSystemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mappingKeys_1 = require("../../../assets/mappingKeys");
const moment_assets_1 = require("../../../assets/moment.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const server_config_1 = require("../../../config/server.config");
const equipment_system_entity_1 = require("../../../models/equipment-system.entity");
const typeorm_2 = require("typeorm");
let EquipmentSystemService = class EquipmentSystemService {
    constructor(_EquipmentSystemEntity) {
        this._EquipmentSystemEntity = _EquipmentSystemEntity;
    }
    async Gets(equipmentSystemEntity) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._EquipmentSystemEntity.find({
                    where: [
                        {
                            id: equipmentSystemEntity.id || (0, typeorm_2.Like)('%' + '%'),
                            userId: equipmentSystemEntity.userId || (0, typeorm_2.Like)('%' + '%'),
                            status: (0, typeorm_2.Not)(false),
                        },
                    ],
                });
            }
        })
            .then((result) => {
            if (!result)
                throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.';
            return result;
        });
    }
    async Create(equipmentSystemEntity) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._EquipmentSystemEntity.query("SP_CheckTheLastRecordedTrip @userId='" +
                    equipmentSystemEntity.userId +
                    "', @year='");
            }
            else {
                return this._EquipmentSystemEntity.save(equipmentSystemEntity);
            }
        })
            .then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el tipo de aceite.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el tipo de aceite.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async SaveList(MappingGroupOils, typesOfOilEquipmentEntity) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        let MappingEquipmentSystems = [];
        const addEquipmentSystems = typesOfOilEquipmentEntity.filter((equipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'added');
        const updateEquipmentSystems = typesOfOilEquipmentEntity.filter((equipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'updated');
        const deleteEquipmentSystems = typesOfOilEquipmentEntity.filter((equipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'deleted');
        try {
            for (var _k = true, addEquipmentSystems_1 = __asyncValues(addEquipmentSystems), addEquipmentSystems_1_1; addEquipmentSystems_1_1 = await addEquipmentSystems_1.next(), _a = addEquipmentSystems_1_1.done, !_a; _k = true) {
                _c = addEquipmentSystems_1_1.value;
                _k = false;
                const addEquipmentSystem = _c;
                let searchMappingGroupOils = (0, mappingKeys_1.searchKey)(MappingGroupOils, addEquipmentSystem.entityGroupId);
                let newEquipmentSystemEntity = new equipment_system_entity_1.EquipmentSystemEntity();
                delete newEquipmentSystemEntity.id;
                newEquipmentSystemEntity.userId = addEquipmentSystem.userId;
                newEquipmentSystemEntity.equipment = addEquipmentSystem.equipment;
                newEquipmentSystemEntity.trialDay = addEquipmentSystem.trialDay || 0;
                newEquipmentSystemEntity.lubUsedDuringMaintenance =
                    addEquipmentSystem.lubUsedDuringMaintenance || 0;
                newEquipmentSystemEntity.frequencyId = addEquipmentSystem.frequencyId;
                newEquipmentSystemEntity.entityGroupId = addEquipmentSystem.entityGroupId;
                if (searchMappingGroupOils) {
                    newEquipmentSystemEntity.entityGroupId = searchMappingGroupOils.value;
                }
                newEquipmentSystemEntity.userIdCreated = addEquipmentSystem.userIdCreated;
                newEquipmentSystemEntity.dateCreated = (0, moment_assets_1.GetDate)();
                delete newEquipmentSystemEntity.userIdUpdated;
                delete newEquipmentSystemEntity.dateUpdated;
                newEquipmentSystemEntity.status = Boolean(addEquipmentSystem.status);
                let registeredGroupOil = await this.Create(newEquipmentSystemEntity);
                MappingEquipmentSystems.push(new mappingKeys_1.Mapping(addEquipmentSystem.id, registeredGroupOil.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = addEquipmentSystems_1.return)) await _b.call(addEquipmentSystems_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _l = true, updateEquipmentSystems_1 = __asyncValues(updateEquipmentSystems), updateEquipmentSystems_1_1; updateEquipmentSystems_1_1 = await updateEquipmentSystems_1.next(), _d = updateEquipmentSystems_1_1.done, !_d; _l = true) {
                _f = updateEquipmentSystems_1_1.value;
                _l = false;
                const updateEquipmentSystem = _f;
                let searchMappingGroupOils = (0, mappingKeys_1.searchKey)(MappingGroupOils, updateEquipmentSystem.entityGroupId);
                let equipmentSystem = new equipment_system_entity_1.EquipmentSystemEntity();
                equipmentSystem.id = updateEquipmentSystem.id;
                equipmentSystem.userId = updateEquipmentSystem.userId;
                equipmentSystem.trialDay = updateEquipmentSystem.trialDay || 0;
                equipmentSystem.lubUsedDuringMaintenance =
                    updateEquipmentSystem.lubUsedDuringMaintenance || 0;
                equipmentSystem.equipment = updateEquipmentSystem.equipment;
                equipmentSystem.frequencyId = updateEquipmentSystem.frequencyId;
                equipmentSystem.entityGroupId = updateEquipmentSystem.entityGroupId;
                if (searchMappingGroupOils) {
                    equipmentSystem.entityGroupId = searchMappingGroupOils.value;
                }
                equipmentSystem.userIdCreated = updateEquipmentSystem.userIdCreated;
                equipmentSystem.dateCreated = updateEquipmentSystem.dateCreated;
                equipmentSystem.userIdUpdated = updateEquipmentSystem.userIdUpdated;
                equipmentSystem.dateUpdated = updateEquipmentSystem.dateUpdated;
                equipmentSystem.status = Boolean(updateEquipmentSystem.status);
                await this._EquipmentSystemEntity.save(equipmentSystem);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_l && !_d && (_e = updateEquipmentSystems_1.return)) await _e.call(updateEquipmentSystems_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _m = true, deleteEquipmentSystems_1 = __asyncValues(deleteEquipmentSystems), deleteEquipmentSystems_1_1; deleteEquipmentSystems_1_1 = await deleteEquipmentSystems_1.next(), _g = deleteEquipmentSystems_1_1.done, !_g; _m = true) {
                _j = deleteEquipmentSystems_1_1.value;
                _m = false;
                let deleteEquipmentSystem = _j;
                let searchMappingGroupOils = (0, mappingKeys_1.searchKey)(MappingGroupOils, deleteEquipmentSystem.entityGroupId);
                let equipmentSystem = new equipment_system_entity_1.EquipmentSystemEntity();
                equipmentSystem.id = deleteEquipmentSystem.id;
                equipmentSystem.userId = deleteEquipmentSystem.userId;
                equipmentSystem.trialDay = deleteEquipmentSystem.trialDay || 0;
                equipmentSystem.lubUsedDuringMaintenance =
                    deleteEquipmentSystem.lubUsedDuringMaintenance || 0;
                equipmentSystem.equipment = deleteEquipmentSystem.equipment;
                equipmentSystem.frequencyId = deleteEquipmentSystem.frequencyId;
                equipmentSystem.entityGroupId = deleteEquipmentSystem.entityGroupId;
                if (searchMappingGroupOils) {
                    equipmentSystem.entityGroupId = searchMappingGroupOils.value;
                }
                equipmentSystem.userIdCreated = deleteEquipmentSystem.userIdCreated;
                equipmentSystem.dateCreated = deleteEquipmentSystem.dateCreated;
                equipmentSystem.userIdUpdated = deleteEquipmentSystem.userIdUpdated;
                equipmentSystem.dateUpdated = deleteEquipmentSystem.dateUpdated;
                equipmentSystem.status = Boolean(deleteEquipmentSystem.status);
                await this._EquipmentSystemEntity.save(equipmentSystem);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_g && (_h = deleteEquipmentSystems_1.return)) await _h.call(deleteEquipmentSystems_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return MappingEquipmentSystems;
    }
};
exports.EquipmentSystemService = EquipmentSystemService;
exports.EquipmentSystemService = EquipmentSystemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(equipment_system_entity_1.EquipmentSystemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EquipmentSystemService);
//# sourceMappingURL=equipment-system.service.js.map