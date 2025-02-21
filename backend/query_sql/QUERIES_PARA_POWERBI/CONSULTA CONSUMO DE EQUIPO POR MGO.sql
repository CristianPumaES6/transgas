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
