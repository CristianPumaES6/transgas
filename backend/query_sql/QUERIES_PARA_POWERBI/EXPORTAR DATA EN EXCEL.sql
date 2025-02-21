DECLARE @userId INT = 7;  -- Aquí puedes cambiar el valor antes de ejecutar
DECLARE @startDate DATETIME = '2024-02-01';
DECLARE @endDate DATETIME = '2025-03-10';
 
SELECT 
    -- Datos del reporte diario (daily_report)
    dr.id AS dailyReportId,
    dr.north_degree,
    dr.north_minutes,
    dr.north_north_south,
    dr.east_degree,
    dr.east_minutes,
    dr.east_east_west,
    dr.activityPerformed,
    dr.typeActivityPerformed,
    dr.speedStraction,
    dr.date,
    dr.hour,
    dr.bunkeringIfo,
    dr.bunkeringMgo,
    dr.mplaIfo,
    dr.auxIfo,
    dr.boilerIfo,
    dr.otherIfo,
    dr.mplaMgo,
    dr.auxMgo,
    dr.boilerMgo,
    dr.ppMgo,
    dr.giMgo,
    dr.otherMgo,
    dr.steamingTime,
    dr.distance,
    dr.beaufour,
    dr.observation,
    dr.nextActivityPerformed, -- Nueva columna agregada
    
    -- Datos del puerto (port)
    p.id AS portId,
    p.portNumber,
    p.departurePort,
    p.arrivalPort,
    p.startDate,
    p.startIFO,
    p.startMGO,
    p.dateETA,
    p.historyDateETA,

    -- Datos del viaje (voyage)
    v.id AS voyageId,
    v.userId,
    v.voyageNumber,
    v.year
FROM 
    daily_report dr 
INNER JOIN 
    port p ON p.id = dr.portId 
    AND p.status = 1 
    AND dr.status = 1
INNER JOIN 
    voyage v ON v.id = p.voyageId 
    AND v.status = 1
WHERE  
    dr.userId = @userId AND
	p.userId = @userId AND
	v.userId = @userId
    AND (
        (dr.date >= @startDate AND dr.date <= @endDate)
    )
ORDER BY 
    dr.date ASC;