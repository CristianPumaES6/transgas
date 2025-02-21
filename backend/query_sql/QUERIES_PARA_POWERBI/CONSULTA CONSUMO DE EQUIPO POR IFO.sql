DECLARE @status INT = 1;
DECLARE @userId INT = 7;  
DECLARE @startDate DATETIME = '2024-01-10 00:00:00';  
DECLARE @endDate DATETIME = '2026-02-01 23:59:59'; 

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
