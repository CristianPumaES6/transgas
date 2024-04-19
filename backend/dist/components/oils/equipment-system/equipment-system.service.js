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
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._EquipmentSystemEntity.find({
                    where: [
                        {
                            id: (equipmentSystemEntity.id || typeorm_2.Like('%' + '%')),
                            userId: (equipmentSystemEntity.userId || typeorm_2.Like('%' + '%')),
                            status: typeorm_2.Not(false)
                        }
                    ]
                });
            }
        }).then((result) => {
            if (!result)
                throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.';
            return result;
        });
    }
    async Create(equipmentSystemEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._EquipmentSystemEntity.query("SP_CheckTheLastRecordedTrip @userId='" + equipmentSystemEntity.userId + "', @year='");
            }
            else {
                return this._EquipmentSystemEntity.save(equipmentSystemEntity);
            }
        }).then((resultSave) => {
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
        var e_1, _a, e_2, _b, e_3, _c;
        let MappingTypesOfOilEquipment = [];
        const addTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((equipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'added');
        const updateTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((equipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'updated');
        const deleteTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((equipmentSystemEntity) => equipmentSystemEntity.SyncStatus == 'deleted');
        try {
            for (var addTypesOfOilEquipment_1 = __asyncValues(addTypesOfOilEquipment), addTypesOfOilEquipment_1_1; addTypesOfOilEquipment_1_1 = await addTypesOfOilEquipment_1.next(), !addTypesOfOilEquipment_1_1.done;) {
                const addEquipmentSystem = addTypesOfOilEquipment_1_1.value;
                let searchMappingGroupOils = mappingKeys_1.searchKey(MappingGroupOils, addEquipmentSystem.entityGroupId);
                let searchMappingSubGroupOils = mappingKeys_1.searchKey(MappingGroupOils, addEquipmentSystem.entitySubGroupId);
                let newEquipmentSystemEntity = new equipment_system_entity_1.EquipmentSystemEntity();
                delete newEquipmentSystemEntity.id;
                newEquipmentSystemEntity.userId = addEquipmentSystem.userId;
                newEquipmentSystemEntity.equipment = addEquipmentSystem.equipment;
                newEquipmentSystemEntity.rate = addEquipmentSystem.rate;
                newEquipmentSystemEntity.entityGroupId = addEquipmentSystem.entityGroupId;
                if (searchMappingGroupOils) {
                    newEquipmentSystemEntity.entityGroupId = searchMappingGroupOils.value;
                }
                newEquipmentSystemEntity.entitySubGroupId = addEquipmentSystem.entitySubGroupId;
                if (searchMappingSubGroupOils) {
                    newEquipmentSystemEntity.entitySubGroupId = searchMappingSubGroupOils.value;
                }
                newEquipmentSystemEntity.userIdCreated = addEquipmentSystem.userIdCreated;
                newEquipmentSystemEntity.dateCreated = moment_assets_1.GetDate();
                delete newEquipmentSystemEntity.userIdUpdated;
                delete newEquipmentSystemEntity.dateUpdated;
                newEquipmentSystemEntity.status = Boolean(addEquipmentSystem.status);
                let registeredGroupOil = await this.Create(newEquipmentSystemEntity);
                MappingTypesOfOilEquipment.push(new mappingKeys_1.Mapping(addEquipmentSystem.id, registeredGroupOil.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (addTypesOfOilEquipment_1_1 && !addTypesOfOilEquipment_1_1.done && (_a = addTypesOfOilEquipment_1.return)) await _a.call(addTypesOfOilEquipment_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var updateTypesOfOilEquipment_1 = __asyncValues(updateTypesOfOilEquipment), updateTypesOfOilEquipment_1_1; updateTypesOfOilEquipment_1_1 = await updateTypesOfOilEquipment_1.next(), !updateTypesOfOilEquipment_1_1.done;) {
                const updateEquipmentSystem = updateTypesOfOilEquipment_1_1.value;
                let searchMappingGroupOils = mappingKeys_1.searchKey(MappingGroupOils, updateEquipmentSystem.entityGroupId);
                let searchMappingSubGroupOils = mappingKeys_1.searchKey(MappingGroupOils, updateEquipmentSystem.entitySubGroupId);
                let equipmentSystem = new equipment_system_entity_1.EquipmentSystemEntity();
                equipmentSystem.id = updateEquipmentSystem.id;
                equipmentSystem.userId = updateEquipmentSystem.userId;
                equipmentSystem.rate = updateEquipmentSystem.rate;
                equipmentSystem.equipment = updateEquipmentSystem.equipment;
                equipmentSystem.entityGroupId = updateEquipmentSystem.entityGroupId;
                if (searchMappingGroupOils) {
                    equipmentSystem.entityGroupId = searchMappingGroupOils.value;
                }
                equipmentSystem.entitySubGroupId = updateEquipmentSystem.entitySubGroupId;
                if (searchMappingSubGroupOils) {
                    equipmentSystem.entitySubGroupId = searchMappingSubGroupOils.value;
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
                if (updateTypesOfOilEquipment_1_1 && !updateTypesOfOilEquipment_1_1.done && (_b = updateTypesOfOilEquipment_1.return)) await _b.call(updateTypesOfOilEquipment_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var deleteTypesOfOilEquipment_1 = __asyncValues(deleteTypesOfOilEquipment), deleteTypesOfOilEquipment_1_1; deleteTypesOfOilEquipment_1_1 = await deleteTypesOfOilEquipment_1.next(), !deleteTypesOfOilEquipment_1_1.done;) {
                let deleteEquipmentSystem = deleteTypesOfOilEquipment_1_1.value;
                let searchMappingGroupOils = mappingKeys_1.searchKey(MappingGroupOils, deleteEquipmentSystem.entityGroupId);
                let searchMappingSubGroupOils = mappingKeys_1.searchKey(MappingGroupOils, deleteEquipmentSystem.entitySubGroupId);
                let equipmentSystem = new equipment_system_entity_1.EquipmentSystemEntity();
                equipmentSystem.id = deleteEquipmentSystem.id;
                equipmentSystem.userId = deleteEquipmentSystem.userId;
                equipmentSystem.rate = deleteEquipmentSystem.rate;
                equipmentSystem.equipment = deleteEquipmentSystem.equipment;
                equipmentSystem.entityGroupId = deleteEquipmentSystem.entityGroupId;
                if (searchMappingGroupOils) {
                    equipmentSystem.entityGroupId = searchMappingGroupOils.value;
                }
                equipmentSystem.entitySubGroupId = deleteEquipmentSystem.entitySubGroupId;
                if (searchMappingSubGroupOils) {
                    equipmentSystem.entitySubGroupId = searchMappingSubGroupOils.value;
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
                if (deleteTypesOfOilEquipment_1_1 && !deleteTypesOfOilEquipment_1_1.done && (_c = deleteTypesOfOilEquipment_1.return)) await _c.call(deleteTypesOfOilEquipment_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return MappingTypesOfOilEquipment;
    }
};
EquipmentSystemService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(equipment_system_entity_1.EquipmentSystemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EquipmentSystemService);
exports.EquipmentSystemService = EquipmentSystemService;
//# sourceMappingURL=equipment-system.service.js.map