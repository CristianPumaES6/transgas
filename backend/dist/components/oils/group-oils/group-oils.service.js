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
exports.GroupOilsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mappingKeys_1 = require("../../../assets/mappingKeys");
const moment_assets_1 = require("../../../assets/moment.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const server_config_1 = require("../../../config/server.config");
const group_oils_entity_1 = require("../../../models/group-oils.entity");
const typeorm_2 = require("typeorm");
let GroupOilsService = class GroupOilsService {
    constructor(_groupOilRepository) {
        this._groupOilRepository = _groupOilRepository;
    }
    async Gets(groupOilEntity) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._groupOilRepository.find({
                    where: [
                        {
                            id: groupOilEntity.id || (0, typeorm_2.Like)('%' + '%'),
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
    async Create(groupOilEntity) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._groupOilRepository.query("SP_CheckTheLastRecordedTrip @userId='" + groupOilEntity.userId + "', @year='");
            }
            else {
                return this._groupOilRepository.save(groupOilEntity);
            }
        })
            .then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el grupo de aceite.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el grupo de aceite.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async SaveList(importGroupOils) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        let MappingGroupOils = [];
        const addGroupOils = importGroupOils.filter((groupOilEntity) => groupOilEntity.SyncStatus == 'added');
        const updateGroupOils = importGroupOils.filter((groupOilEntity) => groupOilEntity.SyncStatus == 'updated');
        const deleteGroupOils = importGroupOils.filter((groupOilEntity) => groupOilEntity.SyncStatus == 'deleted');
        try {
            for (var _k = true, addGroupOils_1 = __asyncValues(addGroupOils), addGroupOils_1_1; addGroupOils_1_1 = await addGroupOils_1.next(), _a = addGroupOils_1_1.done, !_a; _k = true) {
                _c = addGroupOils_1_1.value;
                _k = false;
                const addGroupOil = _c;
                let searchMappingGroupOils = (0, mappingKeys_1.searchKey)(MappingGroupOils, addGroupOil.groupId);
                let newGroupOilEntity = new group_oils_entity_1.GroupOilEntity();
                delete newGroupOilEntity.id;
                newGroupOilEntity.userId = addGroupOil.userId;
                newGroupOilEntity.label = addGroupOil.label;
                newGroupOilEntity.description = addGroupOil.description;
                newGroupOilEntity.groupId = addGroupOil.groupId;
                if (searchMappingGroupOils) {
                    newGroupOilEntity.groupId = searchMappingGroupOils.value;
                }
                newGroupOilEntity.userIdCreated = addGroupOil.userIdCreated;
                newGroupOilEntity.dateCreated = (0, moment_assets_1.GetDate)();
                delete newGroupOilEntity.userIdUpdated;
                delete newGroupOilEntity.dateUpdated;
                newGroupOilEntity.status = Boolean(addGroupOil.status);
                let registeredGroupOil = await this.Create(newGroupOilEntity);
                MappingGroupOils.push(new mappingKeys_1.Mapping(addGroupOil.id, registeredGroupOil.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = addGroupOils_1.return)) await _b.call(addGroupOils_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _l = true, updateGroupOils_1 = __asyncValues(updateGroupOils), updateGroupOils_1_1; updateGroupOils_1_1 = await updateGroupOils_1.next(), _d = updateGroupOils_1_1.done, !_d; _l = true) {
                _f = updateGroupOils_1_1.value;
                _l = false;
                const updateGroupOil = _f;
                let searchMappingGroupOils = (0, mappingKeys_1.searchKey)(MappingGroupOils, updateGroupOil.groupId);
                let updateGroupOilEntity = new group_oils_entity_1.GroupOilEntity();
                updateGroupOilEntity.id = updateGroupOil.id;
                updateGroupOilEntity.userId = updateGroupOil.userId;
                updateGroupOilEntity.label = updateGroupOil.label;
                updateGroupOilEntity.description = updateGroupOil.description;
                updateGroupOilEntity.groupId = updateGroupOil.groupId;
                if (searchMappingGroupOils) {
                    updateGroupOilEntity.groupId = searchMappingGroupOils.value;
                }
                updateGroupOilEntity.userIdCreated = updateGroupOil.userIdCreated;
                updateGroupOilEntity.dateCreated = updateGroupOil.dateCreated;
                updateGroupOilEntity.userIdUpdated = updateGroupOil.userIdUpdated;
                updateGroupOilEntity.dateUpdated = updateGroupOil.dateUpdated;
                updateGroupOilEntity.status = Boolean(updateGroupOil.status);
                await this._groupOilRepository.save(updateGroupOil);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_l && !_d && (_e = updateGroupOils_1.return)) await _e.call(updateGroupOils_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _m = true, deleteGroupOils_1 = __asyncValues(deleteGroupOils), deleteGroupOils_1_1; deleteGroupOils_1_1 = await deleteGroupOils_1.next(), _g = deleteGroupOils_1_1.done, !_g; _m = true) {
                _j = deleteGroupOils_1_1.value;
                _m = false;
                let deleteGroupOil = _j;
                let searchMappingGroupOils = (0, mappingKeys_1.searchKey)(MappingGroupOils, deleteGroupOil.groupId);
                let deleteGroupOilEntity = new group_oils_entity_1.GroupOilEntity();
                deleteGroupOilEntity.id = deleteGroupOil.id;
                deleteGroupOilEntity.userId = deleteGroupOil.userId;
                deleteGroupOilEntity.label = deleteGroupOil.label;
                deleteGroupOilEntity.description = deleteGroupOil.description;
                deleteGroupOilEntity.groupId = deleteGroupOil.groupId;
                if (searchMappingGroupOils) {
                    deleteGroupOilEntity.groupId = searchMappingGroupOils.value;
                }
                deleteGroupOilEntity.userIdCreated = deleteGroupOil.userIdCreated;
                deleteGroupOilEntity.dateCreated = deleteGroupOil.dateCreated;
                deleteGroupOilEntity.userIdUpdated = deleteGroupOil.userIdUpdated;
                deleteGroupOilEntity.dateUpdated = deleteGroupOil.dateUpdated;
                deleteGroupOilEntity.status = Boolean(deleteGroupOil.status);
                await this._groupOilRepository.save(deleteGroupOil);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_g && (_h = deleteGroupOils_1.return)) await _h.call(deleteGroupOils_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return MappingGroupOils;
    }
};
exports.GroupOilsService = GroupOilsService;
exports.GroupOilsService = GroupOilsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(group_oils_entity_1.GroupOilEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GroupOilsService);
//# sourceMappingURL=group-oils.service.js.map