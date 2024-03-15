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
exports.BunkerOilToEquipmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mappingKeys_1 = require("../../../assets/mappingKeys");
const moment_assets_1 = require("../../../assets/moment.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const server_config_1 = require("../../../config/server.config");
const buker_oil_to_equipment_entity_1 = require("../../../models/buker-oil-to-equipment.entity");
const typeorm_2 = require("typeorm");
let BunkerOilToEquipmentService = class BunkerOilToEquipmentService {
    constructor(_BunkerOilToEquipment) {
        this._BunkerOilToEquipment = _BunkerOilToEquipment;
    }
    async Gets(groupOilEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._BunkerOilToEquipment.find({
                    where: [
                        {
                            id: (groupOilEntity.id || typeorm_2.Like('%' + '%')),
                            userId: (groupOilEntity.userId || typeorm_2.Like('%' + '%')),
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
    async Create(bunkerOilToEquipment) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._BunkerOilToEquipment.query("SP_CheckTheLastRecordedTrip @userId='" + bunkerOilToEquipment.userId + "', @year='");
            }
            else {
                return this._BunkerOilToEquipment.save(bunkerOilToEquipment);
            }
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el Bunker del equipo.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el Bunker del equipo.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async SaveList(MappingOils, MappingTypesOfOilEquipment, bunkerOilToEquipmentEntity) {
        var e_1, _a, e_2, _b, e_3, _c;
        const addBunkerOilToEquipmentEntity = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment) => bunkerOilToEquipment.SyncStatus == 'added');
        const updateBunkerOilToEquipmentEntity = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment) => bunkerOilToEquipment.SyncStatus == 'updated');
        const deleteBunkerOilToEquipmentEntity = bunkerOilToEquipmentEntity.filter((bunkerOilToEquipment) => bunkerOilToEquipment.SyncStatus == 'deleted');
        let MappingBunkerOilToEquipmentEntity = [];
        try {
            for (var addBunkerOilToEquipmentEntity_1 = __asyncValues(addBunkerOilToEquipmentEntity), addBunkerOilToEquipmentEntity_1_1; addBunkerOilToEquipmentEntity_1_1 = await addBunkerOilToEquipmentEntity_1.next(), !addBunkerOilToEquipmentEntity_1_1.done;) {
                const addTypeOfOilEquipment = addBunkerOilToEquipmentEntity_1_1.value;
                let searchMappingTypesOfOilEquipment = mappingKeys_1.searchKey(MappingTypesOfOilEquipment, addTypeOfOilEquipment.entityEquipmentId);
                let searchMappingOils = mappingKeys_1.searchKey(MappingOils, addTypeOfOilEquipment.entityOilId);
                let newBunkerOilToEquipmentEntity = new buker_oil_to_equipment_entity_1.BunkerOilToEquipmentEntity();
                delete newBunkerOilToEquipmentEntity.id;
                newBunkerOilToEquipmentEntity.userId = addTypeOfOilEquipment.userId;
                newBunkerOilToEquipmentEntity.entityEquipmentId = addTypeOfOilEquipment.entityEquipmentId;
                if (searchMappingTypesOfOilEquipment) {
                    newBunkerOilToEquipmentEntity.entityEquipmentId = searchMappingTypesOfOilEquipment.value;
                }
                newBunkerOilToEquipmentEntity.entityOilId = addTypeOfOilEquipment.entityOilId;
                if (searchMappingOils) {
                    newBunkerOilToEquipmentEntity.entityOilId = searchMappingOils.value;
                }
                newBunkerOilToEquipmentEntity.bunker = addTypeOfOilEquipment.bunker;
                newBunkerOilToEquipmentEntity.comment = addTypeOfOilEquipment.comment;
                newBunkerOilToEquipmentEntity.datetime = addTypeOfOilEquipment.datetime;
                newBunkerOilToEquipmentEntity.userIdCreated = addTypeOfOilEquipment.userIdCreated;
                newBunkerOilToEquipmentEntity.dateCreated = moment_assets_1.GetDate();
                delete newBunkerOilToEquipmentEntity.userIdUpdated;
                delete newBunkerOilToEquipmentEntity.dateUpdated;
                newBunkerOilToEquipmentEntity.status = Boolean(addTypeOfOilEquipment.status);
                let registeredBunkerOilToEquipmentEntity = await this.Create(newBunkerOilToEquipmentEntity);
                MappingBunkerOilToEquipmentEntity.push(new mappingKeys_1.Mapping(addTypeOfOilEquipment.id, registeredBunkerOilToEquipmentEntity.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (addBunkerOilToEquipmentEntity_1_1 && !addBunkerOilToEquipmentEntity_1_1.done && (_a = addBunkerOilToEquipmentEntity_1.return)) await _a.call(addBunkerOilToEquipmentEntity_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var updateBunkerOilToEquipmentEntity_1 = __asyncValues(updateBunkerOilToEquipmentEntity), updateBunkerOilToEquipmentEntity_1_1; updateBunkerOilToEquipmentEntity_1_1 = await updateBunkerOilToEquipmentEntity_1.next(), !updateBunkerOilToEquipmentEntity_1_1.done;) {
                const bunkerOilToEquipment = updateBunkerOilToEquipmentEntity_1_1.value;
                let searchMappingTypesOfOilEquipment = mappingKeys_1.searchKey(MappingTypesOfOilEquipment, bunkerOilToEquipment.entityEquipmentId);
                let searchMappingOils = mappingKeys_1.searchKey(MappingOils, bunkerOilToEquipment.entityOilId);
                let newBunkerOilToEquipmentEntity = new buker_oil_to_equipment_entity_1.BunkerOilToEquipmentEntity();
                newBunkerOilToEquipmentEntity.id = bunkerOilToEquipment.id;
                newBunkerOilToEquipmentEntity.userId = bunkerOilToEquipment.userId;
                newBunkerOilToEquipmentEntity.entityEquipmentId = bunkerOilToEquipment.entityEquipmentId;
                if (searchMappingTypesOfOilEquipment) {
                    newBunkerOilToEquipmentEntity.entityEquipmentId = searchMappingTypesOfOilEquipment.value;
                }
                newBunkerOilToEquipmentEntity.entityOilId = bunkerOilToEquipment.entityOilId;
                if (searchMappingOils) {
                    newBunkerOilToEquipmentEntity.entityOilId = searchMappingOils.value;
                }
                newBunkerOilToEquipmentEntity.bunker = bunkerOilToEquipment.bunker;
                newBunkerOilToEquipmentEntity.comment = bunkerOilToEquipment.comment;
                newBunkerOilToEquipmentEntity.datetime = bunkerOilToEquipment.datetime;
                newBunkerOilToEquipmentEntity.userIdCreated = bunkerOilToEquipment.userIdCreated;
                newBunkerOilToEquipmentEntity.dateCreated = bunkerOilToEquipment.dateCreated;
                newBunkerOilToEquipmentEntity.userIdUpdated = bunkerOilToEquipment.userIdUpdated;
                newBunkerOilToEquipmentEntity.dateUpdated = bunkerOilToEquipment.dateUpdated;
                newBunkerOilToEquipmentEntity.status = Boolean(bunkerOilToEquipment.status);
                await this._BunkerOilToEquipment.save(newBunkerOilToEquipmentEntity);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (updateBunkerOilToEquipmentEntity_1_1 && !updateBunkerOilToEquipmentEntity_1_1.done && (_b = updateBunkerOilToEquipmentEntity_1.return)) await _b.call(updateBunkerOilToEquipmentEntity_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var deleteBunkerOilToEquipmentEntity_1 = __asyncValues(deleteBunkerOilToEquipmentEntity), deleteBunkerOilToEquipmentEntity_1_1; deleteBunkerOilToEquipmentEntity_1_1 = await deleteBunkerOilToEquipmentEntity_1.next(), !deleteBunkerOilToEquipmentEntity_1_1.done;) {
                let bunkerOilToEquipment = deleteBunkerOilToEquipmentEntity_1_1.value;
                let searchMappingTypesOfOilEquipment = mappingKeys_1.searchKey(MappingTypesOfOilEquipment, bunkerOilToEquipment.entityEquipmentId);
                let searchMappingOils = mappingKeys_1.searchKey(MappingOils, bunkerOilToEquipment.entityOilId);
                let newBunkerOilToEquipmentEntity = new buker_oil_to_equipment_entity_1.BunkerOilToEquipmentEntity();
                newBunkerOilToEquipmentEntity.id = bunkerOilToEquipment.id;
                newBunkerOilToEquipmentEntity.userId = bunkerOilToEquipment.userId;
                newBunkerOilToEquipmentEntity.entityEquipmentId = bunkerOilToEquipment.entityEquipmentId;
                if (searchMappingTypesOfOilEquipment) {
                    newBunkerOilToEquipmentEntity.entityEquipmentId = searchMappingTypesOfOilEquipment.value;
                }
                newBunkerOilToEquipmentEntity.entityOilId = bunkerOilToEquipment.entityOilId;
                if (searchMappingOils) {
                    newBunkerOilToEquipmentEntity.entityOilId = searchMappingOils.value;
                }
                newBunkerOilToEquipmentEntity.bunker = bunkerOilToEquipment.bunker;
                newBunkerOilToEquipmentEntity.comment = bunkerOilToEquipment.comment;
                newBunkerOilToEquipmentEntity.datetime = bunkerOilToEquipment.datetime;
                newBunkerOilToEquipmentEntity.userIdCreated = bunkerOilToEquipment.userIdCreated;
                newBunkerOilToEquipmentEntity.dateCreated = bunkerOilToEquipment.dateCreated;
                newBunkerOilToEquipmentEntity.userIdUpdated = bunkerOilToEquipment.userIdUpdated;
                newBunkerOilToEquipmentEntity.dateUpdated = bunkerOilToEquipment.dateUpdated;
                newBunkerOilToEquipmentEntity.status = Boolean(bunkerOilToEquipment.status);
                await this._BunkerOilToEquipment.save(bunkerOilToEquipment);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (deleteBunkerOilToEquipmentEntity_1_1 && !deleteBunkerOilToEquipmentEntity_1_1.done && (_c = deleteBunkerOilToEquipmentEntity_1.return)) await _c.call(deleteBunkerOilToEquipmentEntity_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return MappingTypesOfOilEquipment;
    }
};
BunkerOilToEquipmentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(buker_oil_to_equipment_entity_1.BunkerOilToEquipmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BunkerOilToEquipmentService);
exports.BunkerOilToEquipmentService = BunkerOilToEquipmentService;
//# sourceMappingURL=bunker-oil-to-equipment.service.js.map