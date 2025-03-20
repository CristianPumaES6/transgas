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
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._ConsumptionEquipment.find({
                    where: [
                        {
                            id: consumptionEquipment.id || (0, typeorm_3.Like)('%' + '%'),
                            userId: consumptionEquipment.userId || (0, typeorm_3.Like)('%' + '%'),
                            status: (0, typeorm_4.Not)(false),
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
    async Create(consumptionEquipment) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._ConsumptionEquipment.query("SP_CheckTheLastRecordedTrip @userId='" + consumptionEquipment.userId + "', @year='");
            }
            else {
                return this._ConsumptionEquipment.save(consumptionEquipment);
            }
        })
            .then((resultSave) => {
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
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        let MappingConsumptionsEquipment = [];
        const addConsumptionEquipments = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'added');
        const updateConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'updated');
        const deleteConsumptionEquipment = consumptionsEquipment.filter((consumptionEquipment) => consumptionEquipment.SyncStatus == 'deleted');
        let listDeConsumosRegistrados = [];
        try {
            for (var _k = true, addConsumptionEquipments_1 = __asyncValues(addConsumptionEquipments), addConsumptionEquipments_1_1; addConsumptionEquipments_1_1 = await addConsumptionEquipments_1.next(), _a = addConsumptionEquipments_1_1.done, !_a; _k = true) {
                _c = addConsumptionEquipments_1_1.value;
                _k = false;
                const addConsumptionEquipment = _c;
                let searchMappingEquipmentOilCompatibility = (0, mappingKeys_1.searchKey)(MappingEquipmentOilCompatibility, addConsumptionEquipment.entityEquipmentOilCompatibilityId);
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
                newConsumptionEquipmentEntity.dateCreated = (0, moment_assets_1.GetDate)();
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
                if (!_k && !_a && (_b = addConsumptionEquipments_1.return)) await _b.call(addConsumptionEquipments_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _l = true, updateConsumptionEquipment_1 = __asyncValues(updateConsumptionEquipment), updateConsumptionEquipment_1_1; updateConsumptionEquipment_1_1 = await updateConsumptionEquipment_1.next(), _d = updateConsumptionEquipment_1_1.done, !_d; _l = true) {
                _f = updateConsumptionEquipment_1_1.value;
                _l = false;
                const updateEquipmentSystem = _f;
                let searchMappingEquipmentOilCompatibility = (0, mappingKeys_1.searchKey)(MappingEquipmentOilCompatibility, updateEquipmentSystem.entityEquipmentOilCompatibilityId);
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
                if (!_l && !_d && (_e = updateConsumptionEquipment_1.return)) await _e.call(updateConsumptionEquipment_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _m = true, deleteConsumptionEquipment_1 = __asyncValues(deleteConsumptionEquipment), deleteConsumptionEquipment_1_1; deleteConsumptionEquipment_1_1 = await deleteConsumptionEquipment_1.next(), _g = deleteConsumptionEquipment_1_1.done, !_g; _m = true) {
                _j = deleteConsumptionEquipment_1_1.value;
                _m = false;
                let deletConsumptionEquipment = _j;
                let searchMappingEquipmentOilCompatibility = (0, mappingKeys_1.searchKey)(MappingEquipmentOilCompatibility, deletConsumptionEquipment.entityEquipmentOilCompatibilityId);
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
                if (!_m && !_g && (_h = deleteConsumptionEquipment_1.return)) await _h.call(deleteConsumptionEquipment_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return {
            MappingConsumptionsEquipment: MappingConsumptionsEquipment,
            listConsumosValidarSendMail: listDeConsumosRegistrados,
        };
    }
    async GetInfoPortVoyageSeped(userId, startDate, endDate) {
        const query = `
  
  DECLARE @status INT = 1;
DECLARE @userId INT = ${userId}; -- Reemplaza con el ID del usuario
DECLARE @startDate DATE = '${startDate} 00:00:00'; -- Reemplaza con la fecha de inicio
DECLARE @endDate DATETIME = '${endDate} 23:59:59'; -- Reemplaza con la fecha de fin

SELECT 
    V.id AS voyageId,
    P.id AS portId,
    V.voyageNumber,
    P.portNumber,
    P.arrivalPort AS arrival,
    P.departurePort AS departure,
    MIN(DR.date) AS minDate,
    MAX(DR.date) AS maxDate,

    -- Sumar la distancia total por puerto
    SUM(DR.distance) AS totalDistance,

    -- Sumar el tiempo total (en horas)
    SUM(DR.steamingTime) / 60.0 AS totalTimeHour,

    -- Calcular la velocidad (Distancia / Tiempo en horas)
    CASE 
        WHEN SUM(DR.steamingTime) > 0 THEN 
            SUM(DR.distance) * 1.0 / NULLIF(SUM(DR.steamingTime) / 60.0, 0)
        ELSE 
            NULL
    END AS avgSpeed

FROM daily_report DR
INNER JOIN port P ON P.id = DR.portId
INNER JOIN voyage V ON V.id = P.voyageId

WHERE 
    P.status = @status  -- Filtrar solo puertos activos
    AND V.status = @status -- Filtrar solo viajes activos
    AND P.userId = @userId -- Filtrar por usuario
    AND V.userId = @userId -- Asegurar que el viaje es del usuario
    AND DR.date BETWEEN @startDate AND @endDate -- Filtrar por rango de fechas
    AND DR.distance > 0 -- Solo registros con distancia válida

GROUP BY 
    V.id, P.id, V.voyageNumber, P.portNumber, P.arrivalPort, P.departurePort

ORDER BY 
    V.voyageNumber, P.portNumber;

  
        `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async GetConsumoIFOByActivity(userId, startDate, endDate) {
        const query = `
  
  
   

    DECLARE @status INT = 1;
    DECLARE @userId INT = ${userId}; -- Reemplaza con el ID del usuario
    DECLARE @startDate DATE = '${startDate} 00:00:00'; -- Reemplaza con la fecha de inicio
    DECLARE @endDate DATETIME = '${endDate} 23:59:59'; -- Reemplaza con la fecha de fin
    

SELECT    

    --daily_report.id AS dailyReportId,
    FORMAT(CAST(daily_report.date AS DATETIME), 'yyyy-MM') AS date,  -- Filtrado por mes
 
    daily_report.activityPerformed AS activityPerformed, 

    COUNT(*) AS countReports,
    COUNT(DISTINCT port.id) AS countPorts,
    
    SUM(daily_report.steamingTime) AS steamingTime,
    SUM(daily_report.distance) AS distance, 

    SUM(daily_report.mplaIfo) AS mplaIfo,
    SUM(daily_report.auxIfo) AS auxIfo,
    SUM(daily_report.boilerIfo) AS boilerIfo,
    SUM(daily_report.otherIfo) AS otherIfo,
    SUM(daily_report.bunkeringIfo) AS bunkeringIfo

FROM daily_report
INNER JOIN port ON port.id = daily_report.portId 
    AND port.status = @status 
    AND daily_report.status = @status
INNER JOIN voyage ON voyage.id = port.voyageId 
    AND voyage.status = @status

WHERE 
    daily_report.status = @status
    AND port.status = @status
    AND voyage.status = @status

    AND daily_report.userId = @userId
    AND port.userId = @userId
    AND voyage.userId = @userId

    AND (
        daily_report.mplaIfo > 0 OR 
        daily_report.auxIfo > 0 OR 
        daily_report.boilerIfo > 0 OR 
        daily_report.otherIfo > 0 OR 
        daily_report.bunkeringIfo > 0
    )

    AND CAST(daily_report.date AS DATETIME) >= @startDate
    AND CAST(daily_report.date AS DATETIME) <= @endDate

GROUP BY  FORMAT(CAST(daily_report.date AS DATETIME), 'yyyy-MM'),  daily_report.activityPerformed
   
ORDER BY   FORMAT(CAST(daily_report.date AS DATETIME), 'yyyy-MM');


  
        `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async GetConsumoMGOByActivity(userId, startDate, endDate) {
        const query = `
  
  
   


    DECLARE @status INT = 1;
    DECLARE @userId INT = ${userId}; -- Reemplaza con el ID del usuario
    DECLARE @startDate DATE = '${startDate} 00:00:00'; -- Reemplaza con la fecha de inicio
    DECLARE @endDate DATETIME = '${endDate} 23:59:59'; -- Reemplaza con la fecha de fin
    


SELECT    
    FORMAT(CAST(daily_report.date AS DATETIME), 'yyyy-MM') AS date,  -- Filtrado por mes
    daily_report.activityPerformed AS activityPerformed, 

    COUNT(*) AS countReports,
    COUNT(DISTINCT port.id) AS countPorts,
    
    SUM(daily_report.steamingTime) AS steamingTime,
    SUM(daily_report.distance) AS distance, 

    -- Sumas de MGO
    SUM(daily_report.mplaMgo) AS mplaMgo,
    SUM(daily_report.auxMgo) AS auxMgo,
    SUM(daily_report.boilerMgo) AS boilerMgo,
    SUM(daily_report.ppMgo) AS ppMgo,
    SUM(daily_report.giMgo) AS giMgo,
    SUM(daily_report.otherMgo) AS otherMgo,
    SUM(daily_report.bunkeringMgo) AS bunkeringMgo

FROM daily_report
INNER JOIN port ON port.id = daily_report.portId 
    AND port.status = @status 
    AND daily_report.status = @status
INNER JOIN voyage ON voyage.id = port.voyageId 
    AND voyage.status = @status

WHERE 
    daily_report.status = @status
    AND port.status = @status
    AND voyage.status = @status

    AND daily_report.userId = @userId
    AND port.userId = @userId
    AND voyage.userId = @userId

    AND (
        daily_report.mplaMgo > 0 OR 
        daily_report.auxMgo > 0 OR 
        daily_report.boilerMgo > 0 OR 
        daily_report.ppMgo > 0 OR 
        daily_report.giMgo > 0 OR 
        daily_report.otherMgo > 0 OR 
        daily_report.bunkeringMgo > 0
    )

    AND CAST(daily_report.date AS DATETIME) >= @startDate
    AND CAST(daily_report.date AS DATETIME) <= @endDate

GROUP BY FORMAT(CAST(daily_report.date AS DATETIME), 'yyyy-MM'), daily_report.activityPerformed

ORDER BY FORMAT(CAST(daily_report.date AS DATETIME), 'yyyy-MM');

  
        `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async GetConsumoROBIFO(userId, startDate, endDate) {
        const query = `
  
  
   

    DECLARE @status INT = 1;
    DECLARE @userId INT = ${userId}; -- Reemplaza con el ID del usuario
    DECLARE @startDate DATE = '${startDate} 00:00:00'; -- Reemplaza con la fecha de inicio
    DECLARE @endDate DATETIME = '${endDate} 23:59:59'; -- Reemplaza con la fecha de fin
    

-- CON ESTO INCIO CON EL RANGO DE FECHA
SELECT 
    SUM(daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo) AS total_ifo,
    SUM(daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo) AS total_mgo,
    SUM(daily_report.bunkeringIfo) AS total_bunkering_ifo,
    SUM(daily_report.bunkeringMgo) AS total_bunkering_mgo
FROM daily_report
INNER JOIN port ON port.id = daily_report.portId 
    AND port.status = @status
    AND daily_report.status = @status						       
INNER JOIN voyage ON voyage.id = port.voyageId 				       
    AND voyage.status = @status
WHERE 
    daily_report.status = @status
    AND port.status = @status
    AND voyage.status = @status
    AND daily_report.userId = @userId
    AND CAST(daily_report.date AS DATETIME) < CAST(@startDate AS DATETIME);			 

  
  
  
        `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async GetConsumoROBMGO(userId, startDate, endDate) {
        const query = `
  
  
   

    DECLARE @status INT = 1;
    DECLARE @userId INT = ${userId}; -- Reemplaza con el ID del usuario
    DECLARE @startDate DATE = '${startDate} 00:00:00'; -- Reemplaza con la fecha de inicio
    DECLARE @endDate DATETIME = '${endDate} 23:59:59'; -- Reemplaza con la fecha de fin
    
SELECT 
    SUM(daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo) AS total_ifo,
    SUM(daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo) AS total_mgo,
    SUM(daily_report.bunkeringIfo) AS total_bunkering_ifo,
    SUM(daily_report.bunkeringMgo) AS total_bunkering_mgo
FROM daily_report
INNER JOIN port ON port.id = daily_report.portId 
    AND port.status = @status
    AND daily_report.status = @status
INNER JOIN voyage ON voyage.id = port.voyageId 
    AND voyage.status = @status
WHERE 
    daily_report.status = @status
    AND port.status = @status
    AND voyage.status = @status
    AND daily_report.userId = @userId
    AND CAST(daily_report.date AS DATETIME) >= @startDate
    AND CAST(daily_report.date AS DATETIME) <= @endDate;
  
  
        `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async GetConsumoEquipoIFOPorMonth(userId, startDate, endDate) {
        const query = `


 DECLARE @status INT = 1;
DECLARE @userId INT = ${userId};  
DECLARE @startDate DATETIME = '${startDate} 00:00:00'; 
DECLARE @endDate DATETIME = '${endDate} 00:00:00';

SELECT    
    FORMAT(CAST(data.date AS DATETIME), 'yyyy-MM') AS date,  -- Agrupado por mes
    data.equipmentType,  -- Tipo de equipo

    COUNT(*) AS countReports,
    COUNT(DISTINCT port.id) AS countPorts,
    
    SUM(data.steamingTime) AS steamingTime,
    SUM(data.distance) AS distance, 

    SUM(data.fuelConsumption) AS totalIfoConsumption

FROM (
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'mplaIfo' AS equipmentType,
        mplaIfo AS fuelConsumption
    FROM daily_report WHERE mplaIfo > 0
    
    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'auxIfo' AS equipmentType,
        auxIfo AS fuelConsumption
    FROM daily_report WHERE auxIfo > 0

    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'boilerIfo' AS equipmentType,
        boilerIfo AS fuelConsumption
    FROM daily_report WHERE boilerIfo > 0

    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'otherIfo' AS equipmentType,
        otherIfo AS fuelConsumption
    FROM daily_report WHERE otherIfo > 0

    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'bunkeringIfo' AS equipmentType,
        bunkeringIfo AS fuelConsumption
    FROM daily_report WHERE bunkeringIfo > 0

) AS data
INNER JOIN port ON port.id = data.portId 
    AND port.status = @status 
INNER JOIN voyage ON voyage.id = port.voyageId 
    AND voyage.status = @status

WHERE 
    port.status = @status
    AND voyage.status = @status
    AND port.userId = @userId
    AND voyage.userId = @userId
    AND CAST(data.date AS DATETIME) BETWEEN @startDate AND @endDate

GROUP BY FORMAT(CAST(data.date AS DATETIME), 'yyyy-MM'), data.equipmentType
ORDER BY FORMAT(CAST(data.date AS DATETIME), 'yyyy-MM'), data.equipmentType;




      `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async GetConsumoEquipoMGOPorMonth(userId, startDate, endDate) {
        const query = `

DECLARE @status INT = 1;
DECLARE @userId INT = ${userId};  
DECLARE @startDate DATETIME = '${startDate} 00:00:00';  
DECLARE @endDate DATETIME = '${endDate} 00:00:00'; 

SELECT    
    FORMAT(CAST(data.date AS DATETIME), 'yyyy-MM') AS date,  -- Agrupado por mes
    data.equipmentType,  -- Tipo de equipo

    COUNT(*) AS countReports,
    COUNT(DISTINCT port.id) AS countPorts,
    
    SUM(data.steamingTime) AS steamingTime,
    SUM(data.distance) AS distance, 

    SUM(data.fuelConsumption) AS totalMgoConsumption

FROM (
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'mplaMgo' AS equipmentType,
        mplaMgo AS fuelConsumption
    FROM daily_report WHERE mplaMgo > 0
    
    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'auxMgo' AS equipmentType,
        auxMgo AS fuelConsumption
    FROM daily_report WHERE auxMgo > 0

    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'boilerMgo' AS equipmentType,
        boilerMgo AS fuelConsumption
    FROM daily_report WHERE boilerMgo > 0

    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'ppMgo' AS equipmentType,
        ppMgo AS fuelConsumption
    FROM daily_report WHERE ppMgo > 0

    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'giMgo' AS equipmentType,
        giMgo AS fuelConsumption
    FROM daily_report WHERE giMgo > 0

    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'otherMgo' AS equipmentType,
        otherMgo AS fuelConsumption
    FROM daily_report WHERE otherMgo > 0

    UNION ALL
    
    SELECT 
        date,
        portId,
        steamingTime,
        distance,
        'bunkeringMgo' AS equipmentType,
        bunkeringMgo AS fuelConsumption
    FROM daily_report WHERE bunkeringMgo > 0

) AS data
INNER JOIN port ON port.id = data.portId 
    AND port.status = @status 
INNER JOIN voyage ON voyage.id = port.voyageId 
    AND voyage.status = @status

WHERE 
    port.status = @status
    AND voyage.status = @status
    AND port.userId = @userId
    AND voyage.userId = @userId
    AND CAST(data.date AS DATETIME) BETWEEN @startDate AND @endDate

GROUP BY FORMAT(CAST(data.date AS DATETIME), 'yyyy-MM'), data.equipmentType
ORDER BY FORMAT(CAST(data.date AS DATETIME), 'yyyy-MM'), data.equipmentType;

 



      `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async getConsumoDeLUBRICANTEQUIPOPORFechas(userId, startDate, endDate) {
        const query = `


DECLARE @startDate DATE = '${startDate}';
DECLARE @endDate DATE = '${startDate}';
DECLARE @userId INT = ${userId};

WITH OilList AS (
    SELECT 
        EOC.entityEquipmentId,
        STUFF((
            SELECT DISTINCT ', ' + O.name
            FROM equipmentOilCompatibility EOC2
            INNER JOIN oil O ON EOC2.entityOilId = O.id
            WHERE EOC2.entityEquipmentId = EOC.entityEquipmentId
            FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 
        1, 2, ''
        ) AS oilsUsed
    FROM equipmentOilCompatibility EOC
    GROUP BY EOC.entityEquipmentId
)

SELECT 
    ES.id AS equipmentId,
    ES.equipment AS equipmentName,
    COALESCE(OilList.oilsUsed, 'N/A') AS oilsUsed, -- Aceites concatenados
    SUM(CE.amount) AS totalConsumption,
    SUM(CE.hourConsumption) AS totalHoursWorked
FROM consumptionEquipment CE
INNER JOIN equipmentOilCompatibility EOC ON CE.entityEquipmentOilCompatibilityId = EOC.id
INNER JOIN equipmentSystem ES ON EOC.entityEquipmentId = ES.id
LEFT JOIN OilList ON ES.id = OilList.entityEquipmentId
WHERE CE.date BETWEEN @startDate AND @endDate
GROUP BY ES.id, ES.equipment, OilList.oilsUsed
ORDER BY ES.equipment;





        `;
        return this._ConsumptionEquipment.query(query, [userId, startDate, endDate, startDate, endDate]);
    }
    async getOilConsumptionPerMonth(userId, startDate, endDate) {
        const query = `


          DECLARE @startDate DATE = '${startDate}';
          DECLARE @endDate DATE = '${startDate}';
          DECLARE @userId INT = ${userId};

          SELECT
              EOC.id AS compatibilityId,
              FORMAT(CAST(CE.date AS DATE), 'yyyy-MM') AS year_month,
              ES.id AS equipmentId,
              ES.equipment AS equipmentName,
              ES.frequencyId AS frequencyId,
              ES.trialDay AS rateSystems,
              ES.entityGroupId AS groupId,
              GO.label AS groupName,
              CE.consumptionTypeId AS consumptionTypeId,
              CASE
                  WHEN CE.consumptionTypeId = 1 THEN 'NORMAL'
                  WHEN CE.consumptionTypeId = 2 THEN 'OIL CHANGE'
                  WHEN CE.consumptionTypeId = 3 THEN 'OIL POLLUTION'
                  ELSE 'OTHERS'
              END AS consumptionTypeName,

              -- Obtener el último oilId dentro del rango de fechas con una subconsulta
              (SELECT TOP 1 O.id 
              FROM oil O
              INNER JOIN equipmentOilCompatibility EOC2 ON EOC2.entityOilId = O.id
              INNER JOIN consumptionEquipment CE2 ON CE2.entityEquipmentOilCompatibilityId = EOC2.id 
              WHERE EOC2.entityEquipmentId = ES.id  
              AND CE2.consumptionTypeId = CE.consumptionTypeId 
              AND CAST(CE2.date AS DATE) BETWEEN @startDate AND @endDate
              ORDER BY CAST(CE2.date AS DATE) DESC
              ) AS oilId,
            
              -- Obtener el último oilId dentro del rango de fechas con una subconsulta
              (SELECT TOP 1O.name
              FROM oil O
              INNER JOIN equipmentOilCompatibility EOC2 ON EOC2.entityOilId = O.id
              INNER JOIN consumptionEquipment CE2 ON CE2.entityEquipmentOilCompatibilityId = EOC2.id 
              WHERE EOC2.entityEquipmentId = ES.id  
              AND CE2.consumptionTypeId = CE.consumptionTypeId 
              AND CAST(CE2.date AS DATE) BETWEEN @startDate AND @endDate
              ORDER BY CAST(CE2.date AS DATE) DESC
              ) AS lastOilName ,


            
              0 AS last_oil_cost,
              
              0  AS total_cost
          FROM
              consumptionEquipment CE
              INNER JOIN equipmentOilCompatibility EOC ON CE.entityEquipmentOilCompatibilityId = EOC.id
              INNER JOIN equipmentSystem ES ON EOC.entityEquipmentId = ES.id
              LEFT JOIN groupOil GO ON ES.entityGroupId = GO.id

          GROUP BY 
              EOC.id,
              FORMAT(CAST(CE.date AS DATE), 'yyyy-MM'),
              ES.id,
              ES.equipment,
              ES.frequencyId,
              ES.trialDay,
              ES.entityGroupId,
              GO.label,
              CE.consumptionTypeId

          ORDER BY
              year_month,
              equipmentName,
              CE.consumptionTypeId;


        `;
        return this._ConsumptionEquipment.query(query, [userId, startDate, endDate, startDate, endDate]);
    }
    async QueryGetTask(userId, ETM_OilAnalysis_Oid) {
        const query = `ConsultaMantenimientoPorBD  @dbName = 'TMS_Pilargas',  @tareaId = 'EFC5577E-8EC3-44D7-A2B4-76D90A9803B1'; `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async ViewFileAnalysisOil(buqueId, ETM_OilAnalysis_Oid) {
        const query = `SP_ViewFileAnalysisOil @nameBaseDatos = 'TMS_Pilargas', @OidTarea = '4DDECDC0-BD7C-4CB4-A190-CD5FA37C1B35';`;
        return this._ConsumptionEquipment.query(query, []);
    }
    async consultEquipmentConsumptionByMonthUser(userId, entityEquipmentId, DateYEAR_MONTH) {
        const query = `               
        SELECT
            EOC.id AS compatibilityId,
            strftime('%Y-%m', CE.date) AS year_month,
            strftime('%Y-%m-%d', CE.date) AS consumption_date, -- Agregar la fecha de consumo
            ES.id AS equipmentId,
            ES.equipment AS equipmentName,
            ES.trialDay AS rateSystems,
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
            END AS trialDay,
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
    async GetShips() {
        const query = `
        SELECT  U.id AS Id,
                U.name AS Name,
                U.filename AS Filename,
                U.[years]
                ,U.[minSpeed]
                ,U.[maxSpeed]
                ,U.[isConsumptionIFO]
                ,U.[isConsumptionLSFO]
                ,U.[isConsumptionVLSFO]
                ,U.[isConsumptionMGO]
                ,U.[maxIFOConsumption]
                ,U.[maxMGOConsumption]
                ,U.[minIFOConsumption]
                ,U.[minMGOConsumption]
                ,U.[isMEMGO]
                ,U.[isAEMGO]
                ,U.[isBoilerMGO]
                ,U.[isIGMGO]
                ,U.[isPowerPMGO]
                ,U.[isOtherMGO]
                ,U.[isMEIFO]
                ,U.[isAEIFO]
                ,U.[isBoilerIFO]
                ,U.[isOtherIFO]
                ,U.[contractSpeedSailingBallastMGO]
                ,U.[contractSpeedSailingLadenMGO]
                ,U.[contractSpeedSailingEconomicalMGO]
                ,U.[loadingConsumptionMGO]
                ,U.[dischargeConsumptionMGO]
                ,U.[sailingBallastConsumptionMGO]
                ,U.[sailingLoadConsumptionMGO]
                ,U.[sailingEconomicConsumptionMGO]
                ,U.[anchoredConsumptionMGO]
                ,U.[maneuverConsumptionMGO]
                ,U.[otherConsumptionMGO]
                ,U.[contractSpeedSailingBallastIFO]
                ,U.[contractSpeedSailingLadenIFO]
                ,U.[contractSpeedSailingEconomicalIFO]
                ,U.[loadingConsumptionIFO]
                ,U.[dischargeConsumptionIFO]
                ,U.[sailingBallastConsumptionIFO]
                ,U.[sailingLoadConsumptionIFO]
                ,U.[sailingEconomicConsumptionIFO]
                ,U.[anchoredConsumptionIFO]
                ,U.[maneuverConsumptionIFO]
                ,U.[otherConsumptionIFO]
                ,U.[isDisplayLSFOConsumption]
                ,U.[isDisplayMGOConsumption]
                ,U.[isDisplayAverageSpeed]
                ,U.[isDisplayDataMGO]
                ,U.[isDisplayDataLSFO]
                ,U.[isDisplayVesselPerformanceLSFO]
                ,U.[isDisplayVesselPerformanceMGO]
                ,U.[consumptionEquipmentME_MGO]
                ,U.[consumptionEquipmentAE_MGO]
                ,U.[consumptionEquipmentBOILER_MGO]
                ,U.[consumptionEquipmentIG_MGO]
                ,U.[consumptionEquipmentPP_MGO]
                ,U.[consumptionEquipmentOther_MGO]
                ,U.[consumptionEquipmentME_IFO]
                ,U.[consumptionEquipmentAE_IFO]
                ,U.[consumptionEquipmentBOILER_IFO]
                ,U.[consumptionEquipmentOther_IFO]
        FROM [USER] U
        WHERE U.role = 'BUQUE' AND U.status = 1;
    `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async GetStatusOilStartEnd(userId, startDate, endDate) {
        const query = `
DECLARE @startDate DATE = '${startDate}';
DECLARE @endDate DATE = '${endDate}';
DECLARE @userId INT = ${userId};

SELECT 
    O.id AS oilId,
    O.name AS oilName,

    -- Cantidad de lubricante inicial
    COALESCE(BO_Init.initialBunker, 0) - COALESCE(CE_Init.initialConsumption, 0) AS initialLubricant,

    -- Suma de consumo en el rango de fechas
    COALESCE(CE_Range.totalRangeConsumption, 0) AS totalRangeConsumption,

    -- Suma de bunker en el rango de fechas
    COALESCE(BO_Range.totalRangeBunker, 0) AS totalRangeBunker,

    -- Cantidad de lubricante final
    (COALESCE(BO_Init.initialBunker, 0) - COALESCE(CE_Init.initialConsumption, 0)) 
    + COALESCE(BO_Range.totalRangeBunker, 0) - COALESCE(CE_Range.totalRangeConsumption, 0) AS finalLubricant

FROM oil O

-- Bunker antes del startDate
OUTER APPLY (
    SELECT SUM(BO.bunker) AS initialBunker
    FROM bunkerOil BO
    WHERE BO.entityOilId = O.id
    AND CAST(BO.datetime AS DATE) < @startDate
    AND BO.userId = @userId
    AND BO.status = 1
) BO_Init

-- Consumo antes del startDate
OUTER APPLY (
    SELECT SUM(CE.amount) AS initialConsumption
    FROM equipmentOilCompatibility EOC
    INNER JOIN consumptionEquipment CE ON EOC.id = CE.entityEquipmentOilCompatibilityId
    WHERE EOC.entityOilId = O.id
    AND CAST(CE.date AS DATE) < @startDate
    AND EOC.userId = @userId
    AND CE.userId = @userId
    AND CE.status = 1
) CE_Init

-- Bunker dentro del rango de fechas
OUTER APPLY (
    SELECT SUM(BO.bunker) AS totalRangeBunker
    FROM bunkerOil BO
    WHERE BO.entityOilId = O.id
    AND CAST(BO.datetime AS DATE) BETWEEN @startDate AND @endDate
    AND BO.userId = @userId
    AND BO.status = 1
) BO_Range

-- Consumo dentro del rango de fechas
OUTER APPLY (
    SELECT SUM(CE.amount) AS totalRangeConsumption
    FROM equipmentOilCompatibility EOC
    INNER JOIN consumptionEquipment CE ON EOC.id = CE.entityEquipmentOilCompatibilityId
    WHERE EOC.entityOilId = O.id
    AND CAST(CE.date AS DATE) BETWEEN @startDate AND @endDate
    AND EOC.userId = @userId
    AND CE.userId = @userId
    AND CE.status = 1
) CE_Range

WHERE O.status = 1
ORDER BY O.id;
    `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async GetInfoAllVessel(startDate, endDate) {
        const query = `
    
    

    SELECT 
    O.id AS oilId,
    O.name AS oilName,
    BO.userId,  -- Este es el ID del buque que se utilizará para la agrupación
    U.name As uName,
    U.filename aFilename,

    -- Cantidad de lubricante inicial por buque
    (COALESCE((
        SELECT SUM(BO1.bunker)
        FROM bunkerOil BO1
        WHERE BO1.entityOilId = O.id
        AND DATE(BO1.datetime) < '${startDate}'
        AND BO1.userId = BO.userId
        AND BO1.status = 1
    ), 0) - COALESCE((
        SELECT SUM(CE.amount)
        FROM equipmentOilCompatibility EOC
        INNER JOIN consumptionEquipment CE ON EOC.id = CE.entityEquipmentOilCompatibilityId
        WHERE EOC.entityOilId = O.id
        AND DATE(CE.date) < '${startDate}'
        AND EOC.userId = BO.userId
        AND CE.userId = BO.userId
        AND CE.status = 1
    ), 0)) AS initialLubricant,

    -- Suma de consumo en el rango de fechas por buque
    COALESCE((
        SELECT SUM(CE.amount)
        FROM equipmentOilCompatibility EOC
        INNER JOIN consumptionEquipment CE ON EOC.id = CE.entityEquipmentOilCompatibilityId
        WHERE EOC.entityOilId = O.id
        AND DATE(CE.date) BETWEEN '${startDate}' AND '${endDate}'
        AND EOC.userId = BO.userId
        AND CE.userId = BO.userId
        AND CE.status = 1
    ), 0) AS totalRangeConsumption,

    -- Suma de bunker en el rango de fechas por buque
    COALESCE((
        SELECT SUM(BO2.bunker)
        FROM bunkerOil BO2
        WHERE BO2.entityOilId = O.id
        AND DATE(BO2.datetime) BETWEEN '${startDate}' AND '${endDate}'
        AND BO2.userId = BO.userId
        AND BO2.status = 1
    ), 0) AS totalRangeBunker,

    -- Cantidad de lubricante final por buque
    ((COALESCE((
        SELECT SUM(BO3.bunker)
        FROM bunkerOil BO3
        WHERE BO3.entityOilId = O.id
        AND DATE(BO3.datetime) < '${startDate}'
        AND BO3.userId = BO.userId
        AND BO3.status = 1
    ), 0) - COALESCE((
        SELECT SUM(CE.amount)
        FROM equipmentOilCompatibility EOC
        INNER JOIN consumptionEquipment CE ON EOC.id = CE.entityEquipmentOilCompatibilityId
        WHERE EOC.entityOilId = O.id
        AND DATE(CE.date) < '${startDate}'
        AND EOC.userId = BO.userId
        AND CE.userId = BO.userId
        AND CE.status = 1
    ), 0)) + COALESCE((
        SELECT SUM(BO4.bunker)
        FROM bunkerOil BO4
        WHERE BO4.entityOilId = O.id
        AND BO4.userId = BO.userId
        AND DATE(BO4.datetime) BETWEEN '${startDate}' AND '${endDate}'
        AND BO4.status = 1
    ), 0) - COALESCE((
        SELECT SUM(CE.amount)
        FROM equipmentOilCompatibility EOC
        INNER JOIN consumptionEquipment CE ON EOC.id = CE.entityEquipmentOilCompatibilityId
        WHERE EOC.entityOilId = O.id
        AND DATE(CE.date) BETWEEN '${startDate}' AND '${endDate}'
        AND EOC.userId = BO.userId
        AND CE.userId = BO.userId
        AND CE.status = 1
    ), 0)) AS finalLubricant,

    -- Suma total de la distancia navegada
    COALESCE((
        SELECT SUM(DR.distance)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalDistance,

    -- Suma total del steaming time
    COALESCE((
        SELECT SUM(DR.steamingTime)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.distance > 0
        AND DR.status = 1
    ), 0) AS totalSteamingTime,

    -- Consumo total por columna de equipos
    COALESCE((
        SELECT SUM(DR.mplaIfo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalMplaIfo,

    COALESCE((
        SELECT SUM(DR.auxIfo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalAuxIfo,

    COALESCE((
        SELECT SUM(DR.boilerIfo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalBoilerIfo,

    COALESCE((
        SELECT SUM(DR.otherIfo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalOtherIfo,

    COALESCE((
        SELECT SUM(DR.mplaMgo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalMplaMgo,

    COALESCE((
        SELECT SUM(DR.auxMgo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalAuxMgo,

    COALESCE((
        SELECT SUM(DR.boilerMgo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalBoilerMgo,

    COALESCE((
        SELECT SUM(DR.ppMgo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalPpMgo,

    COALESCE((
        SELECT SUM(DR.giMgo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalGiMgo,

    COALESCE((
        SELECT SUM(DR.otherMgo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalOtherMgo,

    -- Suma total del bunkering
    COALESCE((
        SELECT SUM(DR.bunkeringIfo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalBunkeringIfo,

    COALESCE((
        SELECT SUM(DR.bunkeringMgo)
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) BETWEEN '${startDate}' AND '${endDate}'
        AND DR.status = 1
    ), 0) AS totalBunkeringMgo,
    

    COALESCE((
        SELECT SUM(DR.bunkeringIfo) - (SUM(DR.mplaIfo) + SUM(DR.auxIfo) + SUM(DR.boilerIfo) + SUM(DR.otherIfo) )
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) < '${startDate}'
        AND DR.status = 1
    ), 0) AS totalStartIFO ,

    COALESCE((
        SELECT SUM(DR.bunkeringMgo) - (SUM(DR.mplaMgo) + SUM(DR.auxMgo) + SUM(DR.boilerMgo) + SUM(DR.ppMgo) + SUM(DR.giMgo) + SUM(DR.otherMgo) )
        FROM daily_report DR
        INNER JOIN port P ON DR.portId = P.id AND P.status = 1
        INNER JOIN voyage V ON P.voyageId = V.id AND V.status = 1
        WHERE DR.userId = BO.userId
        AND DATE(DR.date) < '${startDate}'
        AND DR.status = 1
    ), 0) AS totalStartMGO 

FROM 
    oil O
    INNER JOIN bunkerOil BO ON O.id = BO.entityOilId
    INNER JOIN user U ON BO.userId = U.id

WHERE 
    O.status = 1
GROUP BY 
    O.id, BO.userId, U.name, U.filename
ORDER BY 
    O.id, BO.userId;


 


    `;
        return this._ConsumptionEquipment.query(query, []);
    }
    async ImportExcelLubricantDiario(userEntity, ImportExcelLubricantDiaries) {
        var _a, e_4, _b, _c;
        let MappingOilEntity = [];
        try {
            for (var _d = true, ImportExcelLubricantDiaries_1 = __asyncValues(ImportExcelLubricantDiaries), ImportExcelLubricantDiaries_1_1; ImportExcelLubricantDiaries_1_1 = await ImportExcelLubricantDiaries_1.next(), _a = ImportExcelLubricantDiaries_1_1.done, !_a; _d = true) {
                _c = ImportExcelLubricantDiaries_1_1.value;
                _d = false;
                const lubricantDialy = _c;
                let newConsumptionEquipmentEntity = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                delete newConsumptionEquipmentEntity.id;
                newConsumptionEquipmentEntity.userId = lubricantDialy.USER_ID;
                newConsumptionEquipmentEntity.date = (0, moment_assets_1.ConvertDDMMYYYYToUTC)(lubricantDialy.DATE);
                newConsumptionEquipmentEntity.amount = lubricantDialy.LUB_ME;
                newConsumptionEquipmentEntity.hourConsumption = lubricantDialy.HOUR_ME || 0;
                newConsumptionEquipmentEntity.observation = '';
                newConsumptionEquipmentEntity.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_ME1;
                newConsumptionEquipmentEntity.consumptionTypeId = 1;
                newConsumptionEquipmentEntity.entityOilAnalysisId = 0;
                newConsumptionEquipmentEntity.userIdCreated = userEntity.id;
                newConsumptionEquipmentEntity.dateCreated = (0, moment_assets_1.GetDate)();
                delete newConsumptionEquipmentEntity.userIdUpdated;
                delete newConsumptionEquipmentEntity.dateUpdated;
                newConsumptionEquipmentEntity.status = Boolean(true);
                await this.Create(newConsumptionEquipmentEntity);
                let newConsumptionEquipmentEntity2 = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                delete newConsumptionEquipmentEntity2.id;
                newConsumptionEquipmentEntity2.userId = lubricantDialy.USER_ID;
                newConsumptionEquipmentEntity2.date = (0, moment_assets_1.ConvertDDMMYYYYToUTC)(lubricantDialy.DATE);
                newConsumptionEquipmentEntity2.amount = lubricantDialy.LUB_ME_CYLINDER || 0;
                newConsumptionEquipmentEntity2.hourConsumption = lubricantDialy.HOUR_ME || 0;
                newConsumptionEquipmentEntity2.observation = '';
                newConsumptionEquipmentEntity2.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_ME2;
                newConsumptionEquipmentEntity2.consumptionTypeId = 1;
                newConsumptionEquipmentEntity2.entityOilAnalysisId = 0;
                newConsumptionEquipmentEntity2.userIdCreated = userEntity.id;
                newConsumptionEquipmentEntity2.dateCreated = (0, moment_assets_1.GetDate)();
                delete newConsumptionEquipmentEntity2.userIdUpdated;
                delete newConsumptionEquipmentEntity2.dateUpdated;
                newConsumptionEquipmentEntity2.status = Boolean(true);
                await this.Create(newConsumptionEquipmentEntity2);
                let newConsumptionEquipmentEntity3 = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                delete newConsumptionEquipmentEntity3.id;
                newConsumptionEquipmentEntity3.userId = lubricantDialy.USER_ID;
                newConsumptionEquipmentEntity3.date = (0, moment_assets_1.ConvertDDMMYYYYToUTC)(lubricantDialy.DATE);
                newConsumptionEquipmentEntity3.amount = lubricantDialy.LUB_AUX1 || 0;
                newConsumptionEquipmentEntity3.hourConsumption = lubricantDialy.HOUR_AUX1 || 0;
                newConsumptionEquipmentEntity3.observation = '';
                newConsumptionEquipmentEntity3.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_AUX1;
                newConsumptionEquipmentEntity3.consumptionTypeId = 1;
                newConsumptionEquipmentEntity3.entityOilAnalysisId = 0;
                newConsumptionEquipmentEntity3.userIdCreated = userEntity.id;
                newConsumptionEquipmentEntity3.dateCreated = (0, moment_assets_1.GetDate)();
                delete newConsumptionEquipmentEntity3.userIdUpdated;
                delete newConsumptionEquipmentEntity3.dateUpdated;
                newConsumptionEquipmentEntity3.status = Boolean(true);
                await this.Create(newConsumptionEquipmentEntity3);
                let newConsumptionEquipmentEntity4 = new consumptionEquipment_entity_1.ConsumptionEquipmentEntity();
                delete newConsumptionEquipmentEntity4.id;
                newConsumptionEquipmentEntity4.userId = lubricantDialy.USER_ID;
                newConsumptionEquipmentEntity4.date = (0, moment_assets_1.ConvertDDMMYYYYToUTC)(lubricantDialy.DATE);
                newConsumptionEquipmentEntity4.amount = lubricantDialy.LUB_AUX2 || 0;
                newConsumptionEquipmentEntity4.hourConsumption = lubricantDialy.HOUR_AUX2 || 0;
                newConsumptionEquipmentEntity4.observation = '';
                newConsumptionEquipmentEntity4.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_AUX2;
                newConsumptionEquipmentEntity4.consumptionTypeId = 1;
                newConsumptionEquipmentEntity4.entityOilAnalysisId = 0;
                newConsumptionEquipmentEntity4.userIdCreated = userEntity.id;
                newConsumptionEquipmentEntity4.dateCreated = (0, moment_assets_1.GetDate)();
                delete newConsumptionEquipmentEntity4.userIdUpdated;
                delete newConsumptionEquipmentEntity4.dateUpdated;
                newConsumptionEquipmentEntity4.status = Boolean(true);
                await this.Create(newConsumptionEquipmentEntity4);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = ImportExcelLubricantDiaries_1.return)) await _b.call(ImportExcelLubricantDiaries_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return MappingOilEntity;
    }
    async GetSelectDailyReport_Summary(userId, startDate, endDate) {
        const query = `

          DECLARE @userId INT = ${userId}; -- Reemplaza con el ID del usuario
          DECLARE @startDate DATE = '${startDate} 00:00:00'; -- Fecha de inicio
          DECLARE @endDate DATE = '${endDate} 23:59:59'; -- Fecha de fin

          SELECT * 
          FROM daily_report_summary
          WHERE userId = @userId
          AND CAST(date AS DATETIME) BETWEEN @startDate AND @endDate;

        `;
        return this._ConsumptionEquipment.query(query, []);
    }
};
exports.ConsumptionEquipmentService = ConsumptionEquipmentService;
exports.ConsumptionEquipmentService = ConsumptionEquipmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consumptionEquipment_entity_1.ConsumptionEquipmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsumptionEquipmentService);
//# sourceMappingURL=consumption-equipment.service.js.map