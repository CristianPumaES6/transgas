------- coonsulta IFO Y MGO
DECLARE @status INT = 1;
DECLARE @userId INT = 7;  -- Reemplázalo con el valor real
DECLARE @startDate DATETIME = '2024-01-10 00:00:00';  -- Reemplázalo con el valor real
DECLARE @endDate DATETIME = '2026-02-01 23:59:59';  -- Reemplázalo con el valor real
 
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




--CONSULTA MGO
 
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