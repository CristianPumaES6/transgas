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
exports.ConsumptionEquipmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
const server_config_1 = require("../../../../config/server.config");
const promises_assets_1 = require("../../../../assets/promises.assets");
const moment_assets_1 = require("../../../../assets/moment.assets");
const consumptionEquipment_entity_1 = require("../../../../models/consumptionEquipment.entity");
const mappingKeys_1 = require("../../../../assets/mappingKeys");
let ConsumptionEquipmentService = class ConsumptionEquipmentService {
    constructor(_ConsumptionEquipment) {
        this._ConsumptionEquipment = _ConsumptionEquipment;
    }
    async Gets(consumptionEquipment) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._ConsumptionEquipment.find({
                    where: [
                        {
                            id: (consumptionEquipment.id || typeorm_3.Like('%' + '%')),
                            userId: (consumptionEquipment.userId || typeorm_3.Like('%' + '%')),
                            status: typeorm_4.Not(false)
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
    async Create(consumptionEquipment) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._ConsumptionEquipment.query("SP_CheckTheLastRecordedTrip @userId='" + consumptionEquipment.userId + "', @year='");
            }
            else {
                return this._ConsumptionEquipment.save(consumptionEquipment);
            }
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el consumo por equipo.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el consumo por equipo.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async SaveList(MappingGroupOils, consumptionsEquipment) {
        var e_1, _a, e_2, _b, e_3, _c;
        let MappingConsumptionsEquipment = [];
        const addConsumptionEquipments = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'added');
        const updateConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'updated');
        const deleteConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'deleted');
        let listDeConsumosRegistrados = [];
        try {
            for (var addConsumptionEquipments_1 = __asyncValues(addConsumptionEquipments), addConsumptionEquipments_1_1; addConsumptionEquipments_1_1 = await addConsumptionEquipments_1.next(), !addConsumptionEquipments_1_1.done;) {
                const addConsumptionEquipment = addConsumptionEquipments_1_1.value;
                let searchMappingConsumptionEquipmentEntity = mappingKeys_1.searchKey(MappingGroupOils, addConsumptionEquipment.entityEquipmentId);
                let newConsumptionEquipmentEntity = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                delete newConsumptionEquipmentEntity.id;
                newConsumptionEquipmentEntity.userId = addConsumptionEquipment.userId;
                newConsumptionEquipmentEntity.date = addConsumptionEquipment.date;
                newConsumptionEquipmentEntity.amount = addConsumptionEquipment.amount;
                newConsumptionEquipmentEntity.hourConsumption = addConsumptionEquipment.hourConsumption;
                newConsumptionEquipmentEntity.observation = addConsumptionEquipment.observation;
                newConsumptionEquipmentEntity.entityEquipmentId = addConsumptionEquipment.entityEquipmentId;
                if (searchMappingConsumptionEquipmentEntity) {
                    newConsumptionEquipmentEntity.entityEquipmentId = searchMappingConsumptionEquipmentEntity.value;
                }
                newConsumptionEquipmentEntity.userIdCreated = addConsumptionEquipment.userIdCreated;
                newConsumptionEquipmentEntity.dateCreated = moment_assets_1.GetDate();
                delete newConsumptionEquipmentEntity.userIdUpdated;
                delete newConsumptionEquipmentEntity.dateUpdated;
                newConsumptionEquipmentEntity.status = Boolean(addConsumptionEquipment.status);
                let registeredConsumptionEquipmentEntity = await this.Create(newConsumptionEquipmentEntity);
                if (newConsumptionEquipmentEntity.status) {
                    listDeConsumosRegistrados.push(registeredConsumptionEquipmentEntity.id);
                }
                MappingConsumptionsEquipment.push(new mappingKeys_1.Mapping(addConsumptionEquipment.id, registeredConsumptionEquipmentEntity.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (addConsumptionEquipments_1_1 && !addConsumptionEquipments_1_1.done && (_a = addConsumptionEquipments_1.return)) await _a.call(addConsumptionEquipments_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var updateConsumptionEquipment_1 = __asyncValues(updateConsumptionEquipment), updateConsumptionEquipment_1_1; updateConsumptionEquipment_1_1 = await updateConsumptionEquipment_1.next(), !updateConsumptionEquipment_1_1.done;) {
                const updateTypeOfOilEquipment = updateConsumptionEquipment_1_1.value;
                let searchMappingConsumptionEquipmentEntity = mappingKeys_1.searchKey(MappingGroupOils, updateTypeOfOilEquipment.entityEquipmentId);
                let typeOfOilEquipment = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                typeOfOilEquipment.id = updateTypeOfOilEquipment.id;
                typeOfOilEquipment.userId = updateTypeOfOilEquipment.userId;
                typeOfOilEquipment.date = updateTypeOfOilEquipment.date;
                typeOfOilEquipment.amount = updateTypeOfOilEquipment.amount;
                typeOfOilEquipment.hourConsumption = updateTypeOfOilEquipment.hourConsumption;
                typeOfOilEquipment.observation = updateTypeOfOilEquipment.observation;
                typeOfOilEquipment.entityEquipmentId = updateTypeOfOilEquipment.entityEquipmentId;
                if (searchMappingConsumptionEquipmentEntity) {
                    typeOfOilEquipment.entityEquipmentId = searchMappingConsumptionEquipmentEntity.value;
                }
                typeOfOilEquipment.userIdCreated = updateTypeOfOilEquipment.userIdCreated;
                typeOfOilEquipment.dateCreated = updateTypeOfOilEquipment.dateCreated;
                typeOfOilEquipment.userIdUpdated = updateTypeOfOilEquipment.userIdUpdated;
                typeOfOilEquipment.dateUpdated = updateTypeOfOilEquipment.dateUpdated;
                typeOfOilEquipment.status = Boolean(updateTypeOfOilEquipment.status);
                if (typeOfOilEquipment.status) {
                    listDeConsumosRegistrados.push(typeOfOilEquipment.id);
                }
                await this._ConsumptionEquipment.save(typeOfOilEquipment);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (updateConsumptionEquipment_1_1 && !updateConsumptionEquipment_1_1.done && (_b = updateConsumptionEquipment_1.return)) await _b.call(updateConsumptionEquipment_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var deleteConsumptionEquipment_1 = __asyncValues(deleteConsumptionEquipment), deleteConsumptionEquipment_1_1; deleteConsumptionEquipment_1_1 = await deleteConsumptionEquipment_1.next(), !deleteConsumptionEquipment_1_1.done;) {
                let consumptionEquipment = deleteConsumptionEquipment_1_1.value;
                let searchMappingConsumptionEquipmentEntity = mappingKeys_1.searchKey(MappingGroupOils, consumptionEquipment.entityEquipmentId);
                let typeOfOilEquipment = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                typeOfOilEquipment.id = consumptionEquipment.id;
                typeOfOilEquipment.userId = consumptionEquipment.userId;
                typeOfOilEquipment.date = consumptionEquipment.date;
                typeOfOilEquipment.amount = consumptionEquipment.amount;
                typeOfOilEquipment.hourConsumption = consumptionEquipment.hourConsumption;
                typeOfOilEquipment.observation = consumptionEquipment.observation;
                typeOfOilEquipment.entityEquipmentId = consumptionEquipment.entityEquipmentId;
                if (searchMappingConsumptionEquipmentEntity) {
                    typeOfOilEquipment.entityEquipmentId = searchMappingConsumptionEquipmentEntity.value;
                }
                typeOfOilEquipment.userIdCreated = consumptionEquipment.userIdCreated;
                typeOfOilEquipment.dateCreated = consumptionEquipment.dateCreated;
                typeOfOilEquipment.userIdUpdated = consumptionEquipment.userIdUpdated;
                typeOfOilEquipment.dateUpdated = consumptionEquipment.dateUpdated;
                typeOfOilEquipment.status = Boolean(consumptionEquipment.status);
                await this._ConsumptionEquipment.save(typeOfOilEquipment);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (deleteConsumptionEquipment_1_1 && !deleteConsumptionEquipment_1_1.done && (_c = deleteConsumptionEquipment_1.return)) await _c.call(deleteConsumptionEquipment_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return {
            MappingConsumptionsEquipment: MappingConsumptionsEquipment,
            listConsumosValidarSendMail: listDeConsumosRegistrados
        };
    }
    async getOilConsumptionPerMonth(userId) {
        const query = `
    SELECT
    CE.year_month,
    CE.entityEquipmentId,
    CE.total_amount,
    CE.total_hourConsumption,
    CE.rate,
    CE.equipment,
    CE.entityGroupId,
    COALESCE(B.total_bunker, 0) AS total_bunker,
    B.last_entityOilId,
    B.last_oil_name
  FROM
    (SELECT
      strftime('%Y-%m', CE.date) AS year_month,
      CE.entityEquipmentId,
      TOE.entityGroupId,
      SUM(CE.amount) AS total_amount,
      SUM(CE.hourConsumption) AS total_hourConsumption,
      TOE.rate,
      TOE.equipment
    FROM
      consumptionEquipment CE
      INNER JOIN typeOfOilEquipment TOE ON CE.entityEquipmentId = TOE.id
    WHERE
      CE.userId = ? AND
      CE.status = 1
    GROUP BY
      year_month,
      CE.entityEquipmentId,
      TOE.entityGroupId) AS CE
  LEFT JOIN
    (SELECT 
      strftime('%Y-%m', main.datetime) AS year_month,
      main.entityEquipmentId,
      SUM(main.bunker) AS total_bunker,
      (SELECT sub.entityOilId 
       FROM bunkerOil sub
       WHERE sub.entityEquipmentId = main.entityEquipmentId
         AND strftime('%Y-%m', sub.datetime) = strftime('%Y-%m', main.datetime)
         AND sub.status = 1
       ORDER BY sub.datetime ASC 
       LIMIT 1) AS last_entityOilId,
      (SELECT O.name 
       FROM bunkerOil sub
       INNER JOIN oil O ON O.id = sub.entityOilId
       WHERE sub.entityEquipmentId = main.entityEquipmentId
         AND strftime('%Y-%m', sub.datetime) = strftime('%Y-%m', main.datetime)
         AND sub.status = 1
       ORDER BY sub.datetime ASC 
       LIMIT 1) AS last_oil_name
    FROM 
      bunkerOil main
    WHERE main.userId = ? AND
      main.status = 1
    GROUP BY 
      year_month,
      main.entityEquipmentId) AS B ON CE.year_month = B.year_month AND CE.entityEquipmentId = B.entityEquipmentId
  ORDER BY
    CE.year_month ASC, 
    CE.entityEquipmentId;
    `;
        return this._ConsumptionEquipment.query(query, [userId, userId]);
    }
    async consultEquipmentConsumptionByMonthUser(userId, entityEquipmentId, DateYEAR_MONTH) {
        const query = `
                    SELECT
                        toe.userId AS typeOfOilEquipmentUserId,
                        toe.id AS EquipmentId,
                        toe.equipment AS EquipmentName,
                        toe.rate AS RateSystems,
                        ce.id AS consumptionEquipmentId,
                        COALESCE(SUM(ce.amount), 0) AS TotalConsumption,
                        COALESCE(SUM(ce.hourConsumption), 0) AS HourConsumption,
                        CASE 
                            WHEN COALESCE(SUM(ce.hourConsumption), 0) > 0 THEN ROUND(CAST(SUM(ce.amount) AS REAL) / SUM(ce.hourConsumption), 2) 
                            ELSE 0 
                        END AS Rate,
                        GROUP_CONCAT(ce.observation, '; ') AS Observations,
                        ce.date AS ConsumptionDate,
                        boe.id AS bunkerOilId,
                        COALESCE(SUM(boe.bunker), 0) AS TotalBunker,
                        MAX(boe.datetime) AS BunkerDate -- Asumiendo que solo hay un bunkering por día.
                    FROM typeOfOilEquipment AS toe
                    LEFT JOIN consumptionEquipment AS ce 
                        ON toe.id = ce.entityEquipmentId AND ce.userId = ${userId}
                    LEFT JOIN bunkerOil AS boe 
                        ON toe.id = boe.entityEquipmentId AND boe.userId = ${userId}
                        AND DATE(ce.date) = DATE(boe.datetime)
                    WHERE 
                        toe.id =  ${entityEquipmentId}
                        AND (strftime('%Y-%m', ce.date) = '${DateYEAR_MONTH}' OR strftime('%Y-%m', boe.datetime) = '${DateYEAR_MONTH}')
                    GROUP BY toe.id, ce.date, boe.datetime
                    ORDER BY ce.date, boe.datetime;
    `;
        return this._ConsumptionEquipment.query(query, []);
    }
};
ConsumptionEquipmentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(consumptionEquipment_entity_1.ConsumptionEquipmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsumptionEquipmentService);
exports.ConsumptionEquipmentService = ConsumptionEquipmentService;
//# sourceMappingURL=consumption-equipment.service.js.map