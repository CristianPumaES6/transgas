
-- LA FORMULA PARA SABER EL ROB ES LA CANTIDAD QQUE TENMOS EN EL INCIO DE LA FECHA - EL CONSUMO QUE HUBO EN EL RANGO DE LA FECHA.


DECLARE @status INT = 1;
DECLARE @userId INT = 7; -- Reemplaza con el ID del usuario
DECLARE @startDate DATETIME = '2025-01-10 00:00:00'; -- Reemplaza con la fecha de inicio
DECLARE @endDate DATETIME = '2025-02-01 23:59:59'; -- Reemplaza con la fecha de fin



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


-- ESTO ES LO QUE CONSUMIO DURANTE EL RANGO DE FECHA  -- SI LO RESTAMOS CON LO QUE INGRESO PODREMOS SABER EL ROB
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