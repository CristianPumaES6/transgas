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
exports.TypeOfOilEquipmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mappingKeys_1 = require("../../../assets/mappingKeys");
const moment_assets_1 = require("../../../assets/moment.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const server_config_1 = require("../../../config/server.config");
const type_of_oils_equipment_entity_1 = require("../../../models/type-of-oils-equipment.entity");
const typeorm_2 = require("typeorm");
let TypeOfOilEquipmentService = class TypeOfOilEquipmentService {
    constructor(_TypeOfOilEquimentEntity) {
        this._TypeOfOilEquimentEntity = _TypeOfOilEquimentEntity;
    }
    async Gets(typeOfOilEquipmentEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._TypeOfOilEquimentEntity.find({
                    where: [
                        {
                            id: (typeOfOilEquipmentEntity.id || typeorm_2.Like('%' + '%')),
                            userId: (typeOfOilEquipmentEntity.userId || typeorm_2.Like('%' + '%')),
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
    async Create(typeOfOilEquipmentEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._TypeOfOilEquimentEntity.query("SP_CheckTheLastRecordedTrip @userId='" + typeOfOilEquipmentEntity.userId + "', @year='");
            }
            else {
                return this._TypeOfOilEquimentEntity.save(typeOfOilEquipmentEntity);
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
        const addTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((typeOfOilEquipmentEntity) => typeOfOilEquipmentEntity.SyncStatus == 'added');
        const updateTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((typeOfOilEquipmentEntity) => typeOfOilEquipmentEntity.SyncStatus == 'updated');
        const deleteTypesOfOilEquipment = typesOfOilEquipmentEntity.filter((typeOfOilEquipmentEntity) => typeOfOilEquipmentEntity.SyncStatus == 'deleted');
        try {
            for (var addTypesOfOilEquipment_1 = __asyncValues(addTypesOfOilEquipment), addTypesOfOilEquipment_1_1; addTypesOfOilEquipment_1_1 = await addTypesOfOilEquipment_1.next(), !addTypesOfOilEquipment_1_1.done;) {
                const addTypeOfOilEquipment = addTypesOfOilEquipment_1_1.value;
                let searchMappingGroupOils = mappingKeys_1.searchKey(MappingGroupOils, addTypeOfOilEquipment.entityGroupId);
                let newTypeOfOilEquipmentEntity = new type_of_oils_equipment_entity_1.TypeOfOilEquipmentEntity();
                delete newTypeOfOilEquipmentEntity.id;
                newTypeOfOilEquipmentEntity.userId = addTypeOfOilEquipment.userId;
                newTypeOfOilEquipmentEntity.equipment = addTypeOfOilEquipment.equipment;
                newTypeOfOilEquipmentEntity.entityGroupId = addTypeOfOilEquipment.entityGroupId;
                if (searchMappingGroupOils) {
                    newTypeOfOilEquipmentEntity.entityGroupId = searchMappingGroupOils.value;
                }
                newTypeOfOilEquipmentEntity.userIdCreated = addTypeOfOilEquipment.userIdCreated;
                newTypeOfOilEquipmentEntity.dateCreated = moment_assets_1.GetDate();
                delete newTypeOfOilEquipmentEntity.userIdUpdated;
                delete newTypeOfOilEquipmentEntity.dateUpdated;
                newTypeOfOilEquipmentEntity.status = Boolean(addTypeOfOilEquipment.status);
                let registeredGroupOil = await this.Create(newTypeOfOilEquipmentEntity);
                MappingTypesOfOilEquipment.push(new mappingKeys_1.Mapping(addTypeOfOilEquipment.id, registeredGroupOil.id));
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
                const updateTypeOfOilEquipment = updateTypesOfOilEquipment_1_1.value;
                let searchMappingGroupOils = mappingKeys_1.searchKey(MappingGroupOils, updateTypeOfOilEquipment.entityGroupId);
                let typeOfOilEquipment = new type_of_oils_equipment_entity_1.TypeOfOilEquipmentEntity();
                typeOfOilEquipment.id = updateTypeOfOilEquipment.id;
                typeOfOilEquipment.userId = updateTypeOfOilEquipment.userId;
                typeOfOilEquipment.equipment = updateTypeOfOilEquipment.equipment;
                typeOfOilEquipment.entityGroupId = updateTypeOfOilEquipment.entityGroupId;
                if (searchMappingGroupOils) {
                    typeOfOilEquipment.entityGroupId = searchMappingGroupOils.value;
                }
                typeOfOilEquipment.userIdCreated = updateTypeOfOilEquipment.userIdCreated;
                typeOfOilEquipment.dateCreated = updateTypeOfOilEquipment.dateCreated;
                typeOfOilEquipment.userIdUpdated = updateTypeOfOilEquipment.userIdUpdated;
                typeOfOilEquipment.dateUpdated = updateTypeOfOilEquipment.dateUpdated;
                typeOfOilEquipment.status = Boolean(updateTypeOfOilEquipment.status);
                await this._TypeOfOilEquimentEntity.save(typeOfOilEquipment);
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
                let deleteTypeOfOilEquipment = deleteTypesOfOilEquipment_1_1.value;
                let searchMappingGroupOils = mappingKeys_1.searchKey(MappingGroupOils, deleteTypeOfOilEquipment.entityGroupId);
                let typeOfOilEquipment = new type_of_oils_equipment_entity_1.TypeOfOilEquipmentEntity();
                typeOfOilEquipment.id = deleteTypeOfOilEquipment.id;
                typeOfOilEquipment.userId = deleteTypeOfOilEquipment.userId;
                typeOfOilEquipment.equipment = deleteTypeOfOilEquipment.equipment;
                typeOfOilEquipment.entityGroupId = deleteTypeOfOilEquipment.entityGroupId;
                if (searchMappingGroupOils) {
                    typeOfOilEquipment.entityGroupId = searchMappingGroupOils.value;
                }
                typeOfOilEquipment.userIdCreated = deleteTypeOfOilEquipment.userIdCreated;
                typeOfOilEquipment.dateCreated = deleteTypeOfOilEquipment.dateCreated;
                typeOfOilEquipment.userIdUpdated = deleteTypeOfOilEquipment.userIdUpdated;
                typeOfOilEquipment.dateUpdated = deleteTypeOfOilEquipment.dateUpdated;
                typeOfOilEquipment.status = Boolean(deleteTypeOfOilEquipment.status);
                await this._TypeOfOilEquimentEntity.save(typeOfOilEquipment);
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
TypeOfOilEquipmentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(type_of_oils_equipment_entity_1.TypeOfOilEquipmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOfOilEquipmentService);
exports.TypeOfOilEquipmentService = TypeOfOilEquipmentService;
//# sourceMappingURL=type-of-oil-equiment.service.js.map