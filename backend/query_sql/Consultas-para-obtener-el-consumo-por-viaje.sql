-- Obtenemos la fecha de inicio, fecha fin del viaje, ademas el consumo que se hizo en el viaje.
SELECT
	voyage.id,
	voyage.voyageNumber,
	MIN(daily_report.date),
	MAX(daily_report.date),		
	SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) AS 'total_ifo',
	SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) AS 'total_mgo'

FROM daily_report
	INNER JOIN port ON daily_report.portId = port.id
	INNER JOIN voyage ON port.voyageId = voyage.id

WHERE daily_report.status = 1 
	AND port.status = 1
	AND voyage.status = 1

GROUP BY voyage.id, voyage.voyageNumber


-- Obtenemos los bunkering registrados en el viaje.

SELECT
	voyage.id,
	voyage.voyageNumber,
	port.id,
	port.voyageId,
	port.portNumber,
	port.departurePort,
	daily_report.id,
	daily_report.bunkeringIfo,
	daily_report.bunkeringMgo,
	daily_report.observation
	
FROM daily_report
	INNER JOIN port ON daily_report.portId = port.id
	INNER JOIN voyage ON port.voyageId = voyage.id

WHERE daily_report.status = 1 
	AND port.status = 1
	AND voyage.status = 1
	AND (daily_report.bunkeringIfo > 0 OR daily_report.bunkeringMgo > 0)




-- ṕr íertp
SELECT
	voyage.id AS 'voyage.id',
	voyage.voyageNumber AS 'voyage.voyageNumber',
	port.id AS 'port.id',
	port.voyageId AS 'port.voyageId',
	port.portNumber AS 'port.portNumber',
	MIN(daily_report.date),
	MAX(daily_report.date),		
	SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) AS 'total_ifo',
	SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) AS 'total_mgo'

FROM daily_report
	INNER JOIN port ON daily_report.portId = port.id
	INNER JOIN voyage ON port.voyageId = voyage.id

WHERE daily_report.status = 1 
	AND port.status = 1
	AND voyage.status = 1

GROUP BY 	
	voyage.id,
	voyage.voyageNumber,
	port.id,
	port.voyageId,
	port.portNumber


