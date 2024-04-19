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
exports.BunkerOilService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mappingKeys_1 = require("../../../assets/mappingKeys");
const moment_assets_1 = require("../../../assets/moment.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const server_config_1 = require("../../../config/server.config");
const buker_oil_entity_1 = require("../../../models/buker-oil.entity");
const typeorm_2 = require("typeorm");
let BunkerOilService = class BunkerOilService {
    constructor(_BunkerOil) {
        this._BunkerOil = _BunkerOil;
    }
    async Gets(groupOilEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._BunkerOil.find({
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
    async Create(bunkerOil) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._BunkerOil.query("SP_CheckTheLastRecordedTrip @userId='" + bunkerOil.userId + "', @year='");
            }
            else {
                return this._BunkerOil.save(bunkerOil);
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
    async SaveList(MappingOils, MappingTypesOfOilEquipment, bunkerOilEntity) {
        var e_1, _a, e_2, _b, e_3, _c;
        const addBunkerOil = bunkerOilEntity.filter((bunkerOil) => bunkerOil.SyncStatus == 'added');
        const updateBunkerOil = bunkerOilEntity.filter((bunkerOil) => bunkerOil.SyncStatus == 'updated');
        const deleteBunkerOil = bunkerOilEntity.filter((bunkerOil) => bunkerOil.SyncStatus == 'deleted');
        let MappingBunkerOil = [];
        try {
            for (var addBunkerOil_1 = __asyncValues(addBunkerOil), addBunkerOil_1_1; addBunkerOil_1_1 = await addBunkerOil_1.next(), !addBunkerOil_1_1.done;) {
                const bunkerOil = addBunkerOil_1_1.value;
                let searchMappingOils = mappingKeys_1.searchKey(MappingOils, bunkerOil.entityOilId);
                let newBunkerOil = new buker_oil_entity_1.BunkerOil();
                delete newBunkerOil.id;
                newBunkerOil.userId = bunkerOil.userId;
                newBunkerOil.entityOilId = bunkerOil.entityOilId;
                if (searchMappingOils) {
                    bunkerOil.entityOilId = searchMappingOils.value;
                }
                newBunkerOil.bunker = bunkerOil.bunker;
                newBunkerOil.comment = bunkerOil.comment;
                newBunkerOil.datetime = bunkerOil.datetime;
                newBunkerOil.userIdCreated = bunkerOil.userIdCreated;
                newBunkerOil.dateCreated = moment_assets_1.GetDate();
                delete newBunkerOil.userIdUpdated;
                delete newBunkerOil.dateUpdated;
                newBunkerOil.status = Boolean(bunkerOil.status);
                let registeredBunkerOil = await this.Create(newBunkerOil);
                MappingBunkerOil.push(new mappingKeys_1.Mapping(bunkerOil.id, registeredBunkerOil.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (addBunkerOil_1_1 && !addBunkerOil_1_1.done && (_a = addBunkerOil_1.return)) await _a.call(addBunkerOil_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var updateBunkerOil_1 = __asyncValues(updateBunkerOil), updateBunkerOil_1_1; updateBunkerOil_1_1 = await updateBunkerOil_1.next(), !updateBunkerOil_1_1.done;) {
                const bunkerOil = updateBunkerOil_1_1.value;
                let searchMappingOils = mappingKeys_1.searchKey(MappingOils, bunkerOil.entityOilId);
                let newBunkerOil = new buker_oil_entity_1.BunkerOil();
                newBunkerOil.id = bunkerOil.id;
                newBunkerOil.userId = bunkerOil.userId;
                newBunkerOil.entityOilId = bunkerOil.entityOilId;
                if (searchMappingOils) {
                    newBunkerOil.entityOilId = searchMappingOils.value;
                }
                newBunkerOil.bunker = bunkerOil.bunker;
                newBunkerOil.comment = bunkerOil.comment;
                newBunkerOil.datetime = bunkerOil.datetime;
                newBunkerOil.userIdCreated = bunkerOil.userIdCreated;
                newBunkerOil.dateCreated = bunkerOil.dateCreated;
                newBunkerOil.userIdUpdated = bunkerOil.userIdUpdated;
                newBunkerOil.dateUpdated = bunkerOil.dateUpdated;
                newBunkerOil.status = Boolean(bunkerOil.status);
                await this._BunkerOil.save(newBunkerOil);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (updateBunkerOil_1_1 && !updateBunkerOil_1_1.done && (_b = updateBunkerOil_1.return)) await _b.call(updateBunkerOil_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var deleteBunkerOil_1 = __asyncValues(deleteBunkerOil), deleteBunkerOil_1_1; deleteBunkerOil_1_1 = await deleteBunkerOil_1.next(), !deleteBunkerOil_1_1.done;) {
                let bunkerOil = deleteBunkerOil_1_1.value;
                let searchMappingOils = mappingKeys_1.searchKey(MappingOils, bunkerOil.entityOilId);
                let newBunkerOil = new buker_oil_entity_1.BunkerOil();
                newBunkerOil.id = bunkerOil.id;
                newBunkerOil.userId = bunkerOil.userId;
                newBunkerOil.entityOilId = bunkerOil.entityOilId;
                if (searchMappingOils) {
                    newBunkerOil.entityOilId = searchMappingOils.value;
                }
                newBunkerOil.bunker = bunkerOil.bunker;
                newBunkerOil.comment = bunkerOil.comment;
                newBunkerOil.datetime = bunkerOil.datetime;
                newBunkerOil.userIdCreated = bunkerOil.userIdCreated;
                newBunkerOil.dateCreated = bunkerOil.dateCreated;
                newBunkerOil.userIdUpdated = bunkerOil.userIdUpdated;
                newBunkerOil.dateUpdated = bunkerOil.dateUpdated;
                newBunkerOil.status = Boolean(bunkerOil.status);
                await this._BunkerOil.save(bunkerOil);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (deleteBunkerOil_1_1 && !deleteBunkerOil_1_1.done && (_c = deleteBunkerOil_1.return)) await _c.call(deleteBunkerOil_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return MappingBunkerOil;
    }
};
BunkerOilService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(buker_oil_entity_1.BunkerOil)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BunkerOilService);
exports.BunkerOilService = BunkerOilService;
//# sourceMappingURL=bunker-oil.service.js.map