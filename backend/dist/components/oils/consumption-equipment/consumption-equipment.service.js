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
const server_config_1 = require("../../../config/server.config");
const promises_assets_1 = require("../../../assets/promises.assets");
const moment_assets_1 = require("../../../assets/moment.assets");
const consumptionEquipment_entity_1 = require("../../../models/consumptionEquipment.entity");
const mappingKeys_1 = require("../../../assets/mappingKeys");
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
    async SaveList(MappingEquipmentOilCompatibility, consumptionsEquipment) {
        var e_1, _a, e_2, _b, e_3, _c;
        let MappingConsumptionsEquipment = [];
        const addConsumptionEquipments = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'added');
        const updateConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'updated');
        const deleteConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'deleted');
        let listDeConsumosRegistrados = [];
        try {
            for (var addConsumptionEquipments_1 = __asyncValues(addConsumptionEquipments), addConsumptionEquipments_1_1; addConsumptionEquipments_1_1 = await addConsumptionEquipments_1.next(), !addConsumptionEquipments_1_1.done;) {
                const addConsumptionEquipment = addConsumptionEquipments_1_1.value;
                let searchMappingEquipmentOilCompatibility = mappingKeys_1.searchKey(MappingEquipmentOilCompatibility, addConsumptionEquipment.entityEquipmentOilCompatibilityId);
                let newConsumptionEquipmentEntity = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                delete newConsumptionEquipmentEntity.id;
                newConsumptionEquipmentEntity.userId = addConsumptionEquipment.userId;
                newConsumptionEquipmentEntity.date = addConsumptionEquipment.date;
                newConsumptionEquipmentEntity.amount = addConsumptionEquipment.amount || 0;
                newConsumptionEquipmentEntity.hourConsumption = addConsumptionEquipment.hourConsumption || 0;
                newConsumptionEquipmentEntity.observation = addConsumptionEquipment.observation || '';
                newConsumptionEquipmentEntity.entityEquipmentOilCompatibilityId = addConsumptionEquipment.entityEquipmentOilCompatibilityId;
                if (searchMappingEquipmentOilCompatibility) {
                    newConsumptionEquipmentEntity.entityEquipmentOilCompatibilityId = searchMappingEquipmentOilCompatibility.value;
                }
                newConsumptionEquipmentEntity.consumptionTypeId = addConsumptionEquipment.consumptionTypeId || 0;
                newConsumptionEquipmentEntity.entityOilAnalysisId = addConsumptionEquipment.entityOilAnalysisId || 0;
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
                const updateEquipmentSystem = updateConsumptionEquipment_1_1.value;
                let searchMappingEquipmentOilCompatibility = mappingKeys_1.searchKey(MappingEquipmentOilCompatibility, updateEquipmentSystem.entityEquipmentOilCompatibilityId);
                let consumptionEquipmentEntity = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                consumptionEquipmentEntity.id = updateEquipmentSystem.id;
                consumptionEquipmentEntity.userId = updateEquipmentSystem.userId;
                consumptionEquipmentEntity.date = updateEquipmentSystem.date;
                consumptionEquipmentEntity.amount = updateEquipmentSystem.amount || 0;
                consumptionEquipmentEntity.hourConsumption = updateEquipmentSystem.hourConsumption || 0;
                consumptionEquipmentEntity.observation = updateEquipmentSystem.observation || '';
                consumptionEquipmentEntity.entityEquipmentOilCompatibilityId = updateEquipmentSystem.entityEquipmentOilCompatibilityId;
                if (searchMappingEquipmentOilCompatibility) {
                    consumptionEquipmentEntity.entityEquipmentOilCompatibilityId = searchMappingEquipmentOilCompatibility.value;
                }
                consumptionEquipmentEntity.consumptionTypeId = updateEquipmentSystem.consumptionTypeId || 0;
                consumptionEquipmentEntity.entityOilAnalysisId = updateEquipmentSystem.entityOilAnalysisId || 0;
                consumptionEquipmentEntity.userIdCreated = updateEquipmentSystem.userIdCreated;
                consumptionEquipmentEntity.dateCreated = updateEquipmentSystem.dateCreated;
                consumptionEquipmentEntity.userIdUpdated = updateEquipmentSystem.userIdUpdated;
                consumptionEquipmentEntity.dateUpdated = updateEquipmentSystem.dateUpdated;
                consumptionEquipmentEntity.status = Boolean(updateEquipmentSystem.status);
                if (consumptionEquipmentEntity.status) {
                    listDeConsumosRegistrados.push(consumptionEquipmentEntity.id);
                }
                await this._ConsumptionEquipment.save(consumptionEquipmentEntity);
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
                let deletConsumptionEquipment = deleteConsumptionEquipment_1_1.value;
                let searchMappingEquipmentOilCompatibility = mappingKeys_1.searchKey(MappingEquipmentOilCompatibility, deletConsumptionEquipment.entityEquipmentOilCompatibilityId);
                let consumptionEquipmentEntity = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                consumptionEquipmentEntity.id = deletConsumptionEquipment.id;
                consumptionEquipmentEntity.userId = deletConsumptionEquipment.userId;
                consumptionEquipmentEntity.date = deletConsumptionEquipment.date;
                consumptionEquipmentEntity.amount = deletConsumptionEquipment.amount || 0;
                consumptionEquipmentEntity.hourConsumption = deletConsumptionEquipment.hourConsumption || 0;
                consumptionEquipmentEntity.observation = deletConsumptionEquipment.observation || '';
                consumptionEquipmentEntity.entityEquipmentOilCompatibilityId = deletConsumptionEquipment.entityEquipmentOilCompatibilityId;
                if (searchMappingEquipmentOilCompatibility) {
                    consumptionEquipmentEntity.entityEquipmentOilCompatibilityId = searchMappingEquipmentOilCompatibility.value;
                }
                consumptionEquipmentEntity.consumptionTypeId = deletConsumptionEquipment.consumptionTypeId || 0;
                consumptionEquipmentEntity.entityOilAnalysisId = deletConsumptionEquipment.entityOilAnalysisId || 0;
                consumptionEquipmentEntity.userIdCreated = deletConsumptionEquipment.userIdCreated;
                consumptionEquipmentEntity.dateCreated = deletConsumptionEquipment.dateCreated;
                consumptionEquipmentEntity.userIdUpdated = deletConsumptionEquipment.userIdUpdated;
                consumptionEquipmentEntity.dateUpdated = deletConsumptionEquipment.dateUpdated;
                consumptionEquipmentEntity.status = Boolean(deletConsumptionEquipment.status);
                await this._ConsumptionEquipment.save(deletConsumptionEquipment);
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
    async getOilConsumptionPerMonth(userId, startDate, endDate) {
        const query = `



    SELECT
        EOC.id AS compatibilityId,
        strftime('%Y-%m', CE.date) AS year_month,
        ES.id AS equipmentId,
        ES.equipment AS equipmentName,
        ES.frequencyId AS frequencyId,
        ES.rate AS rateSystems,
        ES.entityGroupId AS groupId,
        GO.label AS groupName, -- Agregar el tipo de grupo
        CE.consumptionTypeId AS consumptionTypeId, -- Agregar el tipo de consumo
        CASE
            WHEN CE.consumptionTypeId = 1 THEN 'NORMAL'
            WHEN CE.consumptionTypeId = 2 THEN 'OIL CHANGE'
            WHEN CE.consumptionTypeId = 3 THEN 'OIL POLLUTION'
            ELSE 'OTHERS'
        END AS consumptionTypeName, 
        SUM(CE.amount) AS total_amount,
        SUM(CE.hourConsumption) AS total_hourConsumption,
        (
            SELECT O.name
            FROM oil O
            INNER JOIN (
                SELECT entityOilId
                FROM consumptionEquipment
                WHERE entityEquipmentOilCompatibilityId = EOC.id
                ORDER BY date DESC
                LIMIT 1
            ) AS LastConsumption ON O.id = LastConsumption.entityOilId
        ) AS lastOilName
    FROM
        consumptionEquipment CE
        INNER JOIN equipmentOilCompatibility EOC ON CE.entityEquipmentOilCompatibilityId = EOC.id
        INNER JOIN equipmentSystem ES ON EOC.entityEquipmentId = ES.id
        LEFT JOIN groupOil GO ON ES.entityGroupId = GO.id -- Unir con la tabla groupOil para obtener el tipo
    WHERE
        CE.userId = ? AND
        CE.status = 1 AND
        ( ( DATE(?) = DATE('1900-01-01') OR DATE(?) = DATE('1900-01-01') ) OR DATE(CE.date) BETWEEN DATE(?) AND DATE(?) ) -- Filtro por rango de fechas
        GROUP BY
        year_month,
        ES.equipment,  -- Agrupar por nombre del equipo
        ES.id,         -- Agrupar por ID del equipo
        ES.rate,       -- Asegurarse de incluir la tasa del sistema
        ES.entityGroupId, -- Agrupar por ID del grupo
        GO.label,      -- Asegurarse de incluir el nombre del grupo
        CE.consumptionTypeId, -- Agregar el tipo de consumo a la lista de columnas de agrupación
        EOC.id         -- Incluir la compatibilidad en la agrupación
        ORDER BY
        year_month,
        equipmentName,
        CE.consumptionTypeId;
        


        `;
        return this._ConsumptionEquipment.query(query, [userId, startDate, endDate, startDate, endDate]);
    }
    async consultEquipmentConsumptionByMonthUser(userId, entityEquipmentId, DateYEAR_MONTH) {
        const query = `               
        SELECT
            EOC.id AS compatibilityId,
            strftime('%Y-%m', CE.date) AS year_month,
            strftime('%Y-%m-%d', CE.date) AS consumption_date, -- Agregar la fecha de consumo
            ES.id AS equipmentId,
            ES.equipment AS equipmentName,
            ES.rate AS rateSystems,
            ES.entityGroupId AS subgroupId,
            SUM(CE.amount) AS total_amount,
            SUM(CE.hourConsumption) AS total_hourConsumption,
            (
                SELECT O.name
                FROM oil O
                INNER JOIN (
                    SELECT entityOilId
                    FROM consumptionEquipment
                    WHERE entityEquipmentOilCompatibilityId = EOC.id
                    ORDER BY date DESC
                    LIMIT 1
                ) AS LastConsumption ON O.id = LastConsumption.entityOilId
            ) AS lastOilName,
            CE.consumptionTypeId AS consumptionTypeId, -- Agregar el tipo de consumo
            CASE
                WHEN CE.consumptionTypeId = 1 THEN 'NORMAL'
                WHEN CE.consumptionTypeId = 2 THEN 'OIL CHANGE'
                WHEN CE.consumptionTypeId = 3 THEN 'OIL POLLUTION'
                ELSE 'OTHERS'
            END AS consumptionTypeName,
            GROUP_CONCAT(CE.id) AS consumptionIds, -- Lista de IDs de consumo
            CASE 
                WHEN COALESCE(SUM(CE.hourConsumption), 0) > 0 THEN ROUND(CAST(SUM(CE.amount) AS REAL) / SUM(CE.hourConsumption), 2) 
                ELSE 0 
            END AS rate,
            GROUP_CONCAT(CE.observation, ', ') AS observation
        FROM
            consumptionEquipment CE
            INNER JOIN equipmentOilCompatibility EOC ON CE.entityEquipmentOilCompatibilityId = EOC.id
            INNER JOIN equipmentSystem ES ON EOC.entityEquipmentId = ES.id
        WHERE 
            CE.userId =  ${userId}
            AND CE.status = 1
            AND strftime('%Y-%m', CE.date) = '${DateYEAR_MONTH}' -- Filtrar por mes específico
            AND ES.id = ${entityEquipmentId} -- Filtrar por equipo específico
        GROUP BY
            year_month,
            EOC.id,
            consumption_date, -- Agregar la fecha de consumo a la agrupación
            subgroupId; 
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