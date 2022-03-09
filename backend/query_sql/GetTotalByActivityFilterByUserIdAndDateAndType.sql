SELECT
    voyage.userId,
    
    -- Datos del viaje
    voyage.year,
    voyage.id AS 'voyageId',
    voyage.voyageNumber,
    
    -- Informacion del puerto
    port.id AS 'portId',
    port.portNumber,
    port.departurePort,
    port.arrivalPort,
    
    -- Informacion del reporte.
    daily_report.id AS 'dailyReportId',
    daily_report.date,
    daily_report.hour,
    daily_report.activityPerformed,
    daily_report.speedStraction,
    daily_report.observation,
    
    -- Cantidad de reportes
    COUNT(*)  AS 'count',
    -- Suma total de tiempo
    SUM(daily_report.steamingTime),
    -- Suma total de distancia
    SUM(daily_report.distance),
    -- Beaufour
    daily_report.beaufour,


    -- Suma total de consumo por maquina
    SUM(daily_report.mplaIfo),
    SUM(daily_report.auxIfo),
    SUM(daily_report.boilerIfo),
    SUM(daily_report.otherIfo),
    -- Suma total de bunkering
    SUM(daily_report.bunkeringIfo)
    -- Suma total de bunker

-- UNION DE TABLAS
FROM daily_report
    INNER JOIN port ON daily_report.portId = port.id
    INNER JOIN voyage ON port.voyageId = voyage.id

WHERE daily_report.status = 1 
AND port.status = 1
AND voyage.status = 1

AND (
        daily_report.mplaIfo > 0
        OR
        daily_report.auxIfo > 0
        OR
        daily_report.boilerIfo > 0
        OR
        daily_report.otherIfo > 0
        OR
        daily_report.bunkeringIfo > 0
        )
AND daily_report.userId = @userid 
AND port.userId = @userid 
AND voyage.userId = @userid 

-- Lo agrupamos por actividad.
GROUP BY activityPerformed,voyageId

ORDER BY year,voyageId












SELECT "daily_report"."id" AS "dailyReportId",
       "daily_report"."activityPerformed" AS "activityPerformed",
       "daily_report"."speedStraction" AS "speedStraction",
  --     "daily_report"."date" AS "date",
       strftime('%Y-%m', "daily_report"."date") date,
             
       "daily_report"."hour" AS "hour",
       "daily_report"."beaufour" AS "beaufour",
       "daily_report"."observation" AS "observation",
       "port"."id" AS "portId",
       "port"."portNumber" AS "portNumber",
       "port"."departurePort" AS "departurePort",
       "port"."arrivalPort" AS "arrivalPort",
       "voyage"."id" AS "voyageId",
       "voyage"."userId" AS "userId",
       "voyage"."voyageNumber" AS "voyageNumber",
       "voyage"."year" AS "year",
       COUNT(*) AS "count", 
       SUM("daily_report"."steamingTime") AS "steamingTime",
       SUM("daily_report"."distance") AS "distance",
       SUM("daily_report"."mplaIfo") AS "mplaIfo",
       SUM("daily_report"."auxIfo") AS "auxIfo",
       SUM("daily_report"."boilerIfo") AS "boilerIfo",
       SUM("daily_report"."otherIfo") AS "otherIfo",
       SUM("daily_report"."bunkeringIfo") AS "bunkeringIfo" 
       
FROM "daily_report" "daily_report"
INNER JOIN "port" "port"
    ON "port"."id"="daily_report"."portId" 
INNER JOIN "voyage" "voyage"
    ON "voyage"."id"="port"."voyageId"
WHERE "daily_report"."status" = 1
    AND "voyage"."status" = 1
    AND "port"."status" = 1
    AND "daily_report"."userId" = 2
    AND "port"."userId" = 2
    AND "voyage"."userId" = 2
    AND ("daily_report"."mplaIfo" > 0
        OR "daily_report"."auxIfo" > 0
        OR "daily_report"."boilerIfo" > 0
        OR "daily_report"."otherIfo" > 0
        OR "daily_report"."bunkeringIfo" > 0)
        
-- GROUP BY activityPerformed, "voyage".id, "port".id

GROUP BY activityPerformed,    strftime('%Y-%m', "daily_report"."date") 

--ORDER BY "voyage"."year" ASC, "port"."voyageId" ASC

ORDER BY  activityPerformed, date
