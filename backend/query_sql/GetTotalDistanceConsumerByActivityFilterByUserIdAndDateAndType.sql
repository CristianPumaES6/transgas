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