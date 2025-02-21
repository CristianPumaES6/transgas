import { Injectable } from '@nestjs/common';
import { ImportExcelLubricanteDiario, OilEntity } from '../../../models/oil.entity';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from 'typeorm';
import { Not } from 'typeorm';

// Otras librerias.
import * as bcrypt from 'bcrypt';
import { ROUNDS_BCRYPT } from '../../../config/bcrypt.config';
import { URL_Server } from '../../../config/server.config';

// Modelos.
import { UserEntity } from '../../../models/user.entity';
import { DummyPromise } from '../../../assets/promises.assets';
import { ConvertDDMMYYYYToUTC, ConvertMMDDYYYToYYYYMMDD, Convert_YYYYMMD_To_YYYYMMDD, GetDate } from '../../../assets/moment.assets';
import { ConsumptionEquipmentEntity } from '../../../models/consumptionEquipment.entity';
import { Mapping, searchKey } from '../../../assets/mappingKeys';

@Injectable()
export class ConsumptionEquipmentService {
  constructor(
    @InjectRepository(ConsumptionEquipmentEntity)
    private _ConsumptionEquipment: Repository<ConsumptionEquipmentEntity>,
  ) {}

  async Gets(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity[]> {
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          return null;

          //  return hthis.userRepository.query(
          //
          // `EXEC SP_BuscarUsuariosByFilter @userId =0,@nick = '${user.nick || ''}',@name = '${user.name || ''}',@role= '${user.role || ''}'
          // `
          // );
        } else {
          return this._ConsumptionEquipment.find({
            where: [
              // name && surname && nick && email
              {
                id: consumptionEquipment.id || Like('%' + '%'),
                userId: consumptionEquipment.userId || Like('%' + '%'),
                status: Not(false),
              },
            ],
          });
        }
      })
      .then((result: ConsumptionEquipmentEntity[]) => {
        if (!result) throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.';

        // No lo validamos por que puede llegar vacio.
        return result;
      });
  }

  // Registra un nuevo grupo de aceite
  async Create(consumptionEquipment: ConsumptionEquipmentEntity): Promise<ConsumptionEquipmentEntity> {
    // Hacemos where por todos los campos de la entidad
    return DummyPromise()
      .then(result => {
        if (URL_Server.bd === 'MSSQL') {
          // Buscamos el viaje
          return this._ConsumptionEquipment.query("SP_CheckTheLastRecordedTrip @userId='" + consumptionEquipment.userId + "', @year='");
        } else {
          // No lo validamos por que puede llegar vacio.
          return this._ConsumptionEquipment.save(consumptionEquipment);
        }
      })
      .then((resultSave: any) => {
        if (!resultSave) throw new Error('No se puedo registrar el consumo por equipo.');

        if (URL_Server.bd === 'MSSQL') {
          // MSSQL
          if (resultSave.length == 0) throw new Error('No se puedo registrar el consumo por equipo.');
          return resultSave[0];
        } else {
          // SLQITE
          return resultSave;
        }
      });
  }

  // Guarda una lista de aceite.
  async SaveList(
    MappingEquipmentOilCompatibility: Mapping[],
    consumptionsEquipment: ConsumptionEquipmentEntity[],
  ): Promise<SaveListConsumptionEquipmentEntity> {
    let MappingConsumptionsEquipment: Mapping[] = [];

    // FIltramos los datos que faltan aggregar y actualizar.
    const addConsumptionEquipments = consumptionsEquipment.filter(
      (consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'added',
    );
    const updateConsumptionEquipment = consumptionsEquipment.filter(
      (consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'updated',
    );
    const deleteConsumptionEquipment = consumptionsEquipment.filter(
      (consumptionEquipment: ConsumptionEquipmentEntity) => consumptionEquipment.SyncStatus == 'deleted',
    );

    let listDeConsumosRegistrados = [];

    for await (const addConsumptionEquipment of addConsumptionEquipments) {
      let searchMappingEquipmentOilCompatibility = searchKey(
        MappingEquipmentOilCompatibility,
        addConsumptionEquipment.entityEquipmentOilCompatibilityId,
      );

      // Armamos al nuevo tipo de aceite
      let newConsumptionEquipmentEntity = new ConsumptionEquipmentEntity();

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
      // AQUI VALIDAR MI SOBRE CONSUMO
      // SendMailHTMLLubricante  976873362

      // Auditoria.
      newConsumptionEquipmentEntity.userIdCreated = addConsumptionEquipment.userIdCreated;
      newConsumptionEquipmentEntity.dateCreated = GetDate();
      delete newConsumptionEquipmentEntity.userIdUpdated;
      delete newConsumptionEquipmentEntity.dateUpdated;
      newConsumptionEquipmentEntity.status = Boolean(addConsumptionEquipment.status);

      // Registramos grupo de aceite
      let registeredConsumptionEquipmentEntity = await this.Create(newConsumptionEquipmentEntity);

      // solo si esta activo guardaremos su Id para proximas evaluaciones
      if (newConsumptionEquipmentEntity.status) {
        listDeConsumosRegistrados.push(registeredConsumptionEquipmentEntity.id);
      }
      // Lo agregamos al mapping
      MappingConsumptionsEquipment.push(new Mapping(addConsumptionEquipment.id, registeredConsumptionEquipmentEntity.id));
    }

    for await (const updateEquipmentSystem of updateConsumptionEquipment) {
      let searchMappingEquipmentOilCompatibility = searchKey(
        MappingEquipmentOilCompatibility,
        updateEquipmentSystem.entityEquipmentOilCompatibilityId,
      );

      let consumptionEquipmentEntity = new ConsumptionEquipmentEntity();

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

      // Auditoria.
      consumptionEquipmentEntity.userIdCreated = updateEquipmentSystem.userIdCreated;
      consumptionEquipmentEntity.dateCreated = updateEquipmentSystem.dateCreated;
      consumptionEquipmentEntity.userIdUpdated = updateEquipmentSystem.userIdUpdated;
      consumptionEquipmentEntity.dateUpdated = updateEquipmentSystem.dateUpdated;
      consumptionEquipmentEntity.status = Boolean(updateEquipmentSystem.status);

      // solo si esta activo guardaremos su Id para proximas evaluaciones
      if (consumptionEquipmentEntity.status) {
        listDeConsumosRegistrados.push(consumptionEquipmentEntity.id);
      }
      await this._ConsumptionEquipment.save(consumptionEquipmentEntity);
    }

    for await (let deletConsumptionEquipment of deleteConsumptionEquipment) {
      let searchMappingEquipmentOilCompatibility = searchKey(
        MappingEquipmentOilCompatibility,
        deletConsumptionEquipment.entityEquipmentOilCompatibilityId,
      );

      let consumptionEquipmentEntity = new ConsumptionEquipmentEntity();

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

      // Auditoria.
      consumptionEquipmentEntity.userIdCreated = deletConsumptionEquipment.userIdCreated;
      consumptionEquipmentEntity.dateCreated = deletConsumptionEquipment.dateCreated;
      consumptionEquipmentEntity.userIdUpdated = deletConsumptionEquipment.userIdUpdated;
      consumptionEquipmentEntity.dateUpdated = deletConsumptionEquipment.dateUpdated;
      consumptionEquipmentEntity.status = Boolean(deletConsumptionEquipment.status);

      await this._ConsumptionEquipment.save(deletConsumptionEquipment);
    }

    // AQUI VALIDAR MI SOBRE CONSUMO
    // SendMailHTMLLubricante  976873362

    return {
      MappingConsumptionsEquipment: MappingConsumptionsEquipment,
      listConsumosValidarSendMail: listDeConsumosRegistrados,
    };
  }

  async getOilConsumptionPerMonth(userId: number, startDate: string, endDate: string): Promise<getOilConsumptionPerMonth[]> {
    const query = `



    SELECT
        EOC.id AS compatibilityId,
        strftime('%Y-%m', CE.date) AS year_month,
        ES.id AS equipmentId,
        ES.equipment AS equipmentName,
        ES.frequencyId AS frequencyId,
        ES.trialDay AS rateSystems,
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
            SELECT O.id
            FROM oil O
            INNER JOIN (
                SELECT entityOilId
                FROM consumptionEquipment
                WHERE entityEquipmentOilCompatibilityId = EOC.id
                ORDER BY date DESC
                LIMIT 1
            ) AS LastConsumption ON O.id = LastConsumption.entityOilId
        ) AS oilId,

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


    -- Costo aceite
    COALESCE((
        SELECT OP.price
        FROM oilPriceHistory OP
        WHERE OP.entityOilId = EOC.entityOilId
            AND  DATE(CE.date) >= DATE(OP.effectiveDate)
            AND OP.status = 1
        ORDER BY OP.effectiveDate DESC
        LIMIT 1
    ), 0) AS last_oil_cost,

    -- Calcular el costo total del aceite
    SUM(CE.amount * COALESCE((
        SELECT OP.price
        FROM oilPriceHistory OP
        WHERE OP.entityOilId = EOC.entityOilId
            AND DATE(CE.date) >= DATE(OP.effectiveDate)
            AND OP.status = 1
        ORDER BY OP.effectiveDate DESC
        LIMIT 1
    ), 0)) AS total_cost


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
        ES.trialDay,       -- Asegurarse de incluir la tasa del sistema
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

  async QueryGetTask(userId: number, ETM_OilAnalysis_Oid: string): Promise<QueryGetTask[]> {
    const query = `ConsultaMantenimientoPorBD  @dbName = 'TMS_Pilargas',  @tareaId = 'EFC5577E-8EC3-44D7-A2B4-76D90A9803B1'; `;

    return this._ConsumptionEquipment.query(query, []);
  }

  async ViewFileAnalysisOil(buqueId: number, ETM_OilAnalysis_Oid: string): Promise<QueryViewFileAnalysisOil[]> {
    const query = `SP_ViewFileAnalysisOil @nameBaseDatos = 'TMS_Pilargas', @OidTarea = '4DDECDC0-BD7C-4CB4-A190-CD5FA37C1B35';`;

    return this._ConsumptionEquipment.query(query, []);
  }

  async consultEquipmentConsumptionByMonthUser(
    userId: number,
    entityEquipmentId: number,
    DateYEAR_MONTH: string,
  ): Promise<consultEquipmentConsumptionByMonthUser[]> {
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

  async GetShips(): Promise<any[]> {
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

  async GetStatusOilStartEnd(userId: number, startDate: string, endDate: string): Promise<consultEquipmentConsumptionByMonthUser[]> {

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

  async GetInfoAllVessel(startDate: string, endDate: string): Promise<consultEquipmentConsumptionByMonthUser[]> {
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

  // guarda una lista de aceite.
  async ImportExcelLubricantDiario(userEntity: UserEntity, ImportExcelLubricantDiaries: ImportExcelLubricanteDiario[]) {
    let MappingOilEntity: Mapping[] = [];

    for await (const lubricantDialy of ImportExcelLubricantDiaries) {
      // Armamos al nuevo tipo de aceite
      let newConsumptionEquipmentEntity = new ConsumptionEquipmentEntity();

      delete newConsumptionEquipmentEntity.id;
      newConsumptionEquipmentEntity.userId = lubricantDialy.USER_ID;
      newConsumptionEquipmentEntity.date = ConvertDDMMYYYYToUTC(lubricantDialy.DATE);
      newConsumptionEquipmentEntity.amount = lubricantDialy.LUB_ME;
      newConsumptionEquipmentEntity.hourConsumption = lubricantDialy.HOUR_ME || 0;
      newConsumptionEquipmentEntity.observation = '';
      newConsumptionEquipmentEntity.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_ME1;

      newConsumptionEquipmentEntity.consumptionTypeId = 1;
      newConsumptionEquipmentEntity.entityOilAnalysisId = 0;
      // AQUI VALIDAR MI SOBRE CONSUMO
      // SendMailHTMLLubricante  976873362

      // Auditoria.
      newConsumptionEquipmentEntity.userIdCreated = userEntity.id;
      newConsumptionEquipmentEntity.dateCreated = GetDate();
      delete newConsumptionEquipmentEntity.userIdUpdated;
      delete newConsumptionEquipmentEntity.dateUpdated;
      newConsumptionEquipmentEntity.status = Boolean(true);

      await this.Create(newConsumptionEquipmentEntity);

      // Armamos al nuevo tipo de aceite
      let newConsumptionEquipmentEntity2 = new ConsumptionEquipmentEntity();

      delete newConsumptionEquipmentEntity2.id;
      newConsumptionEquipmentEntity2.userId = lubricantDialy.USER_ID;
      newConsumptionEquipmentEntity2.date = ConvertDDMMYYYYToUTC(lubricantDialy.DATE);
      newConsumptionEquipmentEntity2.amount = lubricantDialy.LUB_ME_CYLINDER || 0;
      newConsumptionEquipmentEntity2.hourConsumption = lubricantDialy.HOUR_ME || 0;
      newConsumptionEquipmentEntity2.observation = '';
      newConsumptionEquipmentEntity2.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_ME2;

      newConsumptionEquipmentEntity2.consumptionTypeId = 1;
      newConsumptionEquipmentEntity2.entityOilAnalysisId = 0;
      // AQUI VALIDAR MI SOBRE CONSUMO
      // SendMailHTMLLubricante  976873362

      // Auditoria.
      newConsumptionEquipmentEntity2.userIdCreated = userEntity.id;
      newConsumptionEquipmentEntity2.dateCreated = GetDate();
      delete newConsumptionEquipmentEntity2.userIdUpdated;
      delete newConsumptionEquipmentEntity2.dateUpdated;
      newConsumptionEquipmentEntity2.status = Boolean(true);

      await this.Create(newConsumptionEquipmentEntity2);

      // Armamos al nuevo tipo de aceite
      let newConsumptionEquipmentEntity3 = new ConsumptionEquipmentEntity();

      delete newConsumptionEquipmentEntity3.id;
      newConsumptionEquipmentEntity3.userId = lubricantDialy.USER_ID;
      newConsumptionEquipmentEntity3.date = ConvertDDMMYYYYToUTC(lubricantDialy.DATE);
      newConsumptionEquipmentEntity3.amount = lubricantDialy.LUB_AUX1 || 0;
      newConsumptionEquipmentEntity3.hourConsumption = lubricantDialy.HOUR_AUX1 || 0;
      newConsumptionEquipmentEntity3.observation = '';
      newConsumptionEquipmentEntity3.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_AUX1;

      newConsumptionEquipmentEntity3.consumptionTypeId = 1;
      newConsumptionEquipmentEntity3.entityOilAnalysisId = 0;
      // AQUI VALIDAR MI SOBRE CONSUMO
      // SendMailHTMLLubricante  976873362

      // Auditoria.
      newConsumptionEquipmentEntity3.userIdCreated = userEntity.id;
      newConsumptionEquipmentEntity3.dateCreated = GetDate();
      delete newConsumptionEquipmentEntity3.userIdUpdated;
      delete newConsumptionEquipmentEntity3.dateUpdated;
      newConsumptionEquipmentEntity3.status = Boolean(true);

      await this.Create(newConsumptionEquipmentEntity3);

      // Armamos al nuevo tipo de aceite
      let newConsumptionEquipmentEntity4 = new ConsumptionEquipmentEntity();

      delete newConsumptionEquipmentEntity4.id;
      newConsumptionEquipmentEntity4.userId = lubricantDialy.USER_ID;
      newConsumptionEquipmentEntity4.date = ConvertDDMMYYYYToUTC(lubricantDialy.DATE);
      newConsumptionEquipmentEntity4.amount = lubricantDialy.LUB_AUX2 || 0;
      newConsumptionEquipmentEntity4.hourConsumption = lubricantDialy.HOUR_AUX2 || 0;
      newConsumptionEquipmentEntity4.observation = '';
      newConsumptionEquipmentEntity4.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_AUX2;

      newConsumptionEquipmentEntity4.consumptionTypeId = 1;
      newConsumptionEquipmentEntity4.entityOilAnalysisId = 0;
      // AQUI VALIDAR MI SOBRE CONSUMO
      // SendMailHTMLLubricante  976873362

      // Auditoria.
      newConsumptionEquipmentEntity4.userIdCreated = userEntity.id;
      newConsumptionEquipmentEntity4.dateCreated = GetDate();
      delete newConsumptionEquipmentEntity4.userIdUpdated;
      delete newConsumptionEquipmentEntity4.dateUpdated;
      newConsumptionEquipmentEntity4.status = Boolean(true);

      await this.Create(newConsumptionEquipmentEntity4);

      /*
            // Armamos al nuevo tipo de aceite
            let newConsumptionEquipmentEntity5 = new ConsumptionEquipmentEntity();

            delete newConsumptionEquipmentEntity5.id;
            newConsumptionEquipmentEntity5.userId = lubricantDialy.USER_ID;
            newConsumptionEquipmentEntity5.date = ConvertDDMMYYYYToUTC(lubricantDialy.DATE);
            newConsumptionEquipmentEntity5.amount = lubricantDialy.LUB_AUX3 || 0;
            newConsumptionEquipmentEntity5.hourConsumption = lubricantDialy.HOUR_AUX3 || 0;
            newConsumptionEquipmentEntity5.observation =  '';
            newConsumptionEquipmentEntity5.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_AUX3;
 
            newConsumptionEquipmentEntity5.consumptionTypeId = 1;
            newConsumptionEquipmentEntity5.entityOilAnalysisId = 0;
            // AQUI VALIDAR MI SOBRE CONSUMO
            // SendMailHTMLLubricante  976873362

            // Auditoria.
            newConsumptionEquipmentEntity5.userIdCreated = userEntity.id;
            newConsumptionEquipmentEntity5.dateCreated = GetDate();
            delete newConsumptionEquipmentEntity5.userIdUpdated;
            delete newConsumptionEquipmentEntity5.dateUpdated;
            newConsumptionEquipmentEntity5.status = Boolean(true);

            await this.Create(newConsumptionEquipmentEntity5);
            */
      /* 
            let newConsumptionEquipmentEntity6 = new ConsumptionEquipmentEntity();

            delete newConsumptionEquipmentEntity6.id;
            newConsumptionEquipmentEntity6.userId = lubricantDialy.USER_ID;
            newConsumptionEquipmentEntity6.date = ConvertDDMMYYYYToUTC(lubricantDialy.DATE);
            newConsumptionEquipmentEntity6.amount = lubricantDialy.LUB_ME_CYLINDER || 0;
            newConsumptionEquipmentEntity6.hourConsumption = lubricantDialy.HOUR_ME || 0;
            newConsumptionEquipmentEntity6.observation =  '';
            newConsumptionEquipmentEntity6.entityEquipmentOilCompatibilityId = lubricantDialy.IDENT_ME2;
 
            newConsumptionEquipmentEntity6.consumptionTypeId = 1;
            newConsumptionEquipmentEntity6.entityOilAnalysisId = 0;
            // AQUI VALIDAR MI SOBRE CONSUMO
            // SendMailHTMLLubricante  976873362

            // Auditoria.
            newConsumptionEquipmentEntity6.userIdCreated = userEntity.id;
            newConsumptionEquipmentEntity6.dateCreated = GetDate();
            delete newConsumptionEquipmentEntity6.userIdUpdated;
            delete newConsumptionEquipmentEntity6.dateUpdated;
            newConsumptionEquipmentEntity6.status = Boolean(true);

            await this.Create(newConsumptionEquipmentEntity6); */
    }

    return MappingOilEntity;
  }
}

export interface SaveListConsumptionEquipmentEntity {
  MappingConsumptionsEquipment: Mapping[];
  listConsumosValidarSendMail: any[];
}

export interface QueryGetTask {
  ELM_Oid: string;
  ELM_Codigo: string;
  ETM_Oid: string;
  ETM_Descripcion: string;
  FechaProgramacion: string;
  FechaEjecucion: string;
  EstaTerminado: string;
}

export interface QueryViewFileAnalysisOil {
  Filename: string;
  Content: string;
}

export interface getOilConsumptionPerMonth {
  compatibilityId: number;
  year_month: string;
  equipmentId: number;
  equipmentName: string;
  frequencyId: number;
  rateSystems: number;
  groupId: number;
  groupName: string;
  consumptionTypeId: number;
  consumptionTypeName: string;
  total_amount: number;
  total_hourConsumption: number;
  lastOilName: string;
  oilId: number;
  last_oil_cost: string;
  total_cost: number;
}

export interface consultEquipmentConsumptionByMonthUser {
  equipmentSystemUserId: string;
  EquipmentId: number;
  EquipmentName: string;
  RateSystems: number;
  consumptionEquipmentId: number;
  consumptionTypeId: number;
  consumptionTypeName: string;
  TotalConsumption: number;
  HourConsumption: number;
  Rate: number;
  Observations: number;
  ConsumptionDate: string;
  bunkerOilId: number;
  TotalBunker: number;
  BunkerDate: string;
}
