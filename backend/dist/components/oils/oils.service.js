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
exports.OilsService = void 0;
const common_1 = require("@nestjs/common");
const oil_entity_1 = require("../../models/oil.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
const server_config_1 = require("../../config/server.config");
const promises_assets_1 = require("../../assets/promises.assets");
const moment_assets_1 = require("../../assets/moment.assets");
const mappingKeys_1 = require("../../assets/mappingKeys");
const math_assets_1 = require("../../assets/math.assets");
let OilsService = class OilsService {
    constructor(_oilRepository) {
        this._oilRepository = _oilRepository;
    }
    async Get(id) {
        return (0, promises_assets_1.DummyPromise)().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._oilRepository.query(`
                     EXEC SP_BuscarReportePorId 
                    @dailyReportId = ${id} 
                    `);
            }
            else {
                return this._oilRepository.find({
                    where: [{
                            id: id,
                        }]
                });
            }
        }).then((resultFind) => {
            if (!resultFind)
                throw new Error('does_not_exist');
            if (resultFind && resultFind.length == 0)
                throw new Error('does_not_exist');
            let returnDailyReport = resultFind[0];
            return returnDailyReport;
        });
    }
    async Gets(oilEntity) {
        return (0, promises_assets_1.DummyPromise)().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._oilRepository.find({
                    where: [
                        {
                            userId: (oilEntity.userId || (0, typeorm_3.Like)('%' + '%')),
                            name: (0, typeorm_3.Like)('%' + (oilEntity.name || '') + '%'),
                            status: (0, typeorm_4.Not)(false)
                        }
                    ]
                });
            }
        }).then((result) => {
            if (!result)
                throw 'ERROR AL CONSULTAR LOS ACEITES.';
            return result;
        });
    }
    async Create(oilEntity) {
        return (0, promises_assets_1.DummyPromise)().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return;
            }
            else {
                return this._oilRepository.save(oilEntity);
            }
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el aceite en la BD.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el aceite en la BD.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async Update(oilEntity) {
        return (0, promises_assets_1.DummyPromise)().then(result => {
            return this.Get(oilEntity.id);
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('does_not_exist');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._oilRepository.update(oilEntity.id, oilEntity);
            }
        }).then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('ERROR_TYPEORM_UPDATE_PORT');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
            }
            return oilEntity;
        });
    }
    async Delete(oilEntity, usuarioDelete) {
        let returnOilEntity;
        return (0, promises_assets_1.DummyPromise)().then(result => {
            return this.Get(oilEntity.id);
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('does_not_exist');
            resultFind.userIdUpdated = usuarioDelete;
            resultFind.dateUpdated = (0, moment_assets_1.GetDate)();
            resultFind.status = false;
            returnOilEntity = resultFind;
            return this.Update(resultFind);
        }).then(resultSave => {
            if (!resultSave)
                throw new Error('ERROR_TYPEORM_UPDATE_PORT');
            return returnOilEntity;
        });
    }
    async SaveList(importOils) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        let MappingOilEntity = [];
        const addOilEntity = importOils.filter((importOil) => importOil.SyncStatus == 'added');
        const updOilEntity = importOils.filter((importOil) => importOil.SyncStatus == 'updated');
        const deleteOilEntity = importOils.filter((importOil) => importOil.SyncStatus == 'deleted');
        try {
            for (var _k = true, addOilEntity_1 = __asyncValues(addOilEntity), addOilEntity_1_1; addOilEntity_1_1 = await addOilEntity_1.next(), _a = addOilEntity_1_1.done, !_a; _k = true) {
                _c = addOilEntity_1_1.value;
                _k = false;
                const oil = _c;
                let newOil = new oil_entity_1.OilEntity();
                delete newOil.id;
                newOil.userId = oil.userId;
                newOil.name = oil.name;
                newOil.userIdCreated = oil.userIdCreated;
                newOil.dateCreated = (0, moment_assets_1.GetDate)();
                delete newOil.userIdUpdated;
                delete newOil.dateUpdated;
                newOil.status = Boolean(oil.status);
                let registeredGroupOil = await this.Create(newOil);
                MappingOilEntity.push(new mappingKeys_1.Mapping(oil.id, registeredGroupOil.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = addOilEntity_1.return)) await _b.call(addOilEntity_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _l = true, updOilEntity_1 = __asyncValues(updOilEntity), updOilEntity_1_1; updOilEntity_1_1 = await updOilEntity_1.next(), _d = updOilEntity_1_1.done, !_d; _l = true) {
                _f = updOilEntity_1_1.value;
                _l = false;
                const oil = _f;
                let updatedOil = new oil_entity_1.OilEntity();
                updatedOil.id = oil.id;
                updatedOil.userId = oil.userId;
                updatedOil.name = oil.name;
                updatedOil.userIdCreated = oil.userIdCreated;
                updatedOil.dateCreated = oil.dateCreated;
                updatedOil.userIdUpdated = oil.userIdUpdated;
                updatedOil.dateUpdated = oil.dateUpdated;
                updatedOil.status = Boolean(oil.status);
                await this._oilRepository.save(updatedOil);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_l && !_d && (_e = updOilEntity_1.return)) await _e.call(updOilEntity_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _m = true, deleteOilEntity_1 = __asyncValues(deleteOilEntity), deleteOilEntity_1_1; deleteOilEntity_1_1 = await deleteOilEntity_1.next(), _g = deleteOilEntity_1_1.done, !_g; _m = true) {
                _j = deleteOilEntity_1_1.value;
                _m = false;
                let oil = _j;
                let deleteOil = new oil_entity_1.OilEntity();
                deleteOil.id = oil.id;
                deleteOil.userId = oil.userId;
                deleteOil.name = oil.name;
                deleteOil.userIdCreated = oil.userIdCreated;
                deleteOil.dateCreated = oil.dateCreated;
                deleteOil.userIdUpdated = oil.userIdUpdated;
                deleteOil.dateUpdated = oil.dateUpdated;
                deleteOil.status = Boolean(oil.status);
                await this._oilRepository.save(deleteOil);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_g && (_h = deleteOilEntity_1.return)) await _h.call(deleteOilEntity_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return MappingOilEntity;
    }
    async ConsultarListaDeConsumosRegistrados(ListCONSUMOSId) {
        let listDeIds = '';
        return await (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (ListCONSUMOSId && ListCONSUMOSId.length) {
                var listDeID = ListCONSUMOSId.join(',');
                var queryWhere = 'CE.id in (' + listDeID + ')';
                const query = `
                        SELECT
                            CE.date AS dateConsumption,
                            ES.userId AS equipmentSystem_userId,
                            ES.id AS equipmentSystem_id,
                            ES.equipment AS equipment,
                            CE.amount AS amountConsumption,
                            O.name AS nameOil,
                            BO.datetime AS datetimeBunkerOil,
                            CE.hourConsumption AS hourConsumption,
                            ES.rate AS rate,
                            CE.observation AS observation
                        FROM
                            consumptionEquipment CE
                            INNER JOIN equipmentOilCompatibility EOC ON CE.entityEquipmentOilCompatibilityId = EOC.id
                            INNER JOIN equipmentSystem ES ON EOC.entityEquipmentId = ES.id
                            LEFT JOIN oil O ON O.id = EOC.entityOilId
                            LEFT JOIN bunkerOil BO ON ES.id = BO.entityOilId
                        WHERE
                                CE.status = 1
                               AND ${queryWhere};
                        `;
                return this._oilRepository.query(query, []);
                return [];
            }
            else {
                return null;
            }
        }).then(resultFind => {
            let dailyOilConsumptionData = [];
            resultFind.forEach(item => {
                let dateYYYYMM = (0, moment_assets_1.FormatDateUTCToDateYYYYMM)(item.dateConsumption);
                let dateConsumption = (0, moment_assets_1.FormatDateUTCToDate)(item.dateConsumption);
                let calcRate = 0;
                if (!item.hourConsumption || item.hourConsumption <= 0) {
                    calcRate = item.amountConsumption;
                }
                else {
                    calcRate = (0, math_assets_1.mathRound)(item.amountConsumption / item.hourConsumption, 2);
                }
                if (calcRate > item.rate) {
                    let findDailyOilConsumptionData = dailyOilConsumptionData.find(item2 => item2.dateConsumption == dateConsumption);
                    if (findDailyOilConsumptionData) {
                        findDailyOilConsumptionData.data.push({
                            userId: item.equipmentSystem_userId,
                            equipmentId: item.equipmentSystem_id,
                            equipment: item.equipment,
                            amountConsumption: item.amountConsumption,
                            nameOil: item.nameOil,
                            datetimeBunkerOil: item.datetimeBunkerOil,
                            hourConsumption: item.hourConsumption,
                            rate: item.rate,
                            calcRate: calcRate
                        });
                    }
                    ;
                    if (!findDailyOilConsumptionData) {
                        dailyOilConsumptionData.push({
                            dateConsumption: dateConsumption,
                            dateYYYYMM: dateYYYYMM,
                            observation: item.observation,
                            data: [
                                {
                                    userId: item.equipmentSystem_userId,
                                    equipmentId: item.equipmentSystem_id,
                                    equipment: item.equipment,
                                    amountConsumption: item.amountConsumption,
                                    nameOil: item.nameOil,
                                    datetimeBunkerOil: item.datetimeBunkerOil,
                                    hourConsumption: item.hourConsumption,
                                    rate: item.rate,
                                    calcRate: calcRate
                                }
                            ]
                        });
                    }
                    ;
                }
            });
            return dailyOilConsumptionData;
        }).catch(result => {
            console.log(result);
            return [];
        });
    }
    async ConsultarListaDeConsumosPorBuque(buqueId) {
        return await (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (buqueId && buqueId > 0) {
                var queryWhere = 'consumptionEquipment.userId = ' + buqueId;
                return this._oilRepository.createQueryBuilder('oil')
                    .addSelect('consumptionEquipment.date', 'dateConsumption')
                    .addSelect('equipmentSystem.equipment', 'equipment')
                    .addSelect('consumptionEquipment.amount', 'amountConsumption')
                    .addSelect('oil.name', 'nameOil')
                    .addSelect('bunkerOil.datetime', 'datetimeBunkerOil')
                    .addSelect('consumptionEquipment.hourConsumption', 'hourConsumption')
                    .addSelect('equipmentSystem.rate', 'rate')
                    .addSelect('consumptionEquipment.observation', 'observation')
                    .innerJoin('bunkerOil', 'bunkerOil', 'bunkerOil.entityOilId = oil.id AND bunkerOil.status = 1 AND oil.status = 1')
                    .innerJoin('equipmentSystem', 'equipmentSystem', 'equipmentSystem.id = bunkerOil.entityEquipmentId AND equipmentSystem.status = 1')
                    .innerJoin('consumptionEquipment', 'consumptionEquipment', 'consumptionEquipment.entityEquipmentId = equipmentSystem.id AND consumptionEquipment.status = 1')
                    .where(queryWhere, {})
                    .orderBy('consumptionEquipment.date', 'DESC')
                    .limit(1000)
                    .getRawMany();
            }
            else {
                return [];
            }
        }).then(resultFind => {
            let dailyOilConsumptionData = [];
            resultFind.forEach(item => {
                let dateYYYYMM = (0, moment_assets_1.FormatDateUTCToDateYYYYMM)(item.dateConsumption);
                let dateConsumption = (0, moment_assets_1.FormatDateUTCToDate)(item.dateConsumption);
                let calcRate = 0;
                if (!item.hourConsumption || item.hourConsumption <= 0) {
                    calcRate = item.amountConsumption;
                }
                else {
                    calcRate = item.amountConsumption / item.hourConsumption;
                }
                dailyOilConsumptionData.push({
                    dateConsumption: dateConsumption,
                    dateYYYYMM: dateYYYYMM,
                    observation: item.observation,
                    data: [
                        {
                            userId: item.equipmentSystem_userId,
                            equipmentId: item.equipmentSystem_id,
                            equipment: item.equipment,
                            amountConsumption: item.amountConsumption,
                            nameOil: item.nameOil,
                            datetimeBunkerOil: item.datetimeBunkerOil,
                            hourConsumption: item.hourConsumption,
                            rate: item.rate,
                            calcRate: calcRate
                        }
                    ]
                });
            });
            return dailyOilConsumptionData;
        });
    }
};
exports.OilsService = OilsService;
exports.OilsService = OilsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(oil_entity_1.OilEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OilsService);
//# sourceMappingURL=oils.service.js.map