
---  Consultamos todo
SELECT
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