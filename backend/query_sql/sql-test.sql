SELECT *
FROM daily_report
	WHERE daily_report.id IN (
		-- Este query retorna el ultimo registro ingresado en el viaje.
		SELECT port.voyageId, voyage.voyageNumber, port.id AS 'port.id', MAX(daily_report.id), SUM(daily_report.mplaIfo)
		FROM daily_report
		INNER JOIN port ON daily_report.portId = port.id
		INNER JOIN voyage ON port.voyageId = voyage.id
			WHERE daily_report.status = 1 
			AND port.status = 1
			AND voyage.status = 1
		GROUP BY  port.id,port.voyageId, voyage.voyageNumber
	)
	

---  Consultamos todo
SELECT *

-- Join y tablas que usaremos
FROM daily_report
	INNER JOIN port ON daily_report.portId = port.id
	INNER JOIN voyage ON port.voyageId = voyage.id
	
-- Verificamos que el estado sea OK.
WHERE daily_report.status = 1 
	AND port.status = 1
	AND voyage.status = 1



-- Este query retorna el ultimo registro ingresado en el viaje.
SELECT port.voyageId, voyage.voyageNumber, port.id AS 'port.id', MAX(daily_report.id), SUM(daily_report.mplaIfo)
FROM daily_report
	INNER JOIN port ON daily_report.portId = port.id
	INNER JOIN voyage ON port.voyageId = voyage.id

WHERE daily_report.status = 1 
	AND port.status = 1
	AND voyage.status = 1

GROUP BY  port.id,port.voyageId, voyage.voyageNumber





-- Consultamos el consumo y el bunkering que hubo por puerto.
SELECT
		voyage.id AS 'voyage.id', port.id AS 'port.id',
		SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) AS 'total_ifo',
		SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) AS 'total_mgo',
		SUM( daily_report.bunkeringIfo ) AS 'total_bunkering_ifo',
		SUM( daily_report.bunkeringMgo ) AS 'total_bunkering_mgo'

-- Join y tablas que usaremos
FROM daily_report
	INNER JOIN port ON daily_report.portId = port.id
	INNER JOIN voyage ON port.voyageId = voyage.id

-- Verificamos que el estado sea OK.
WHERE daily_report.status = 1
	AND port.status = 1
	AND voyage.status = 1
	AND daily_report.userId = 2

GROUP BY port.id,port.voyageId, voyage.voyageNumber