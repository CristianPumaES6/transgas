

-- ṕr íertp
SELECT
voyage.userId,
voyage.year,
voyage.id,
voyage.voyageNumber,

port.id,
port.portNumber,
port.departurePort,
port.arrivalPort,

daily_report.id,
daily_report.date,
daily_report.hour,
daily_report.steamingTime,
daily_report.activityPerformed,
daily_report.speedStraction,
daily_report.observation,
daily_report.distance,
daily_report.beaufour,

daily_report.mplaIfo,
daily_report.auxIfo,
daily_report.boilerIfo,
daily_report.otherIfo,
daily_report.bunkeringIfo,


daily_report.mplaMgo,
daily_report.auxMgo,
daily_report.boilerMgo,
daily_report.ppMgo,
daily_report.giMgo,
daily_report.otherMgo,
daily_report.bunkeringMgo

FROM daily_report
	INNER JOIN port ON daily_report.portId = port.id
	INNER JOIN voyage ON port.voyageId = voyage.id

WHERE daily_report.status = 1 
	AND port.status = 1
	AND voyage.status = 1
    
    AND daily_report.userId = @userid
    AND datetime(daily_report.date) >= datetime(:startDate)
    AND datetime(daily_report.date) <= datetime(:endDate)
    