SELECT * 
FROM
	daily_report
WHERE userId =10

ORDER by date DESC



SELECT datetime(daily_report.date,'8.999999 hour'),MIN(daily_report.date), MAX(daily_report.date),SUM(distance),MIN(daily_report.hour), MAX(daily_report.hour), SUM(daily_report.steamingTime)

FROM daily_report
INNER JOIN PORT on daily_report.portId = port.id AND port.status =1
INNER JOIN VOYAGE on port.voyageId = voyage.id AND voyage.status = 1
where daily_report.status =1
AND daily_report.userId = 13

GROUP by strftime('%Y-%m-%d',datetime(daily_report.date,'8.999999 hour'))

ORDER by daily_report.id ASC;


-- apartir de esta fecha 
-- 2023-01-10 08:00:00 para delante



-- reporte diario que no esten eliminados
SELECT  daily_report.date, daily_report.hour,datetime(daily_report.date,'-5 hour')
FROM daily_report
INNER JOIN PORT on daily_report.portId = port.id AND port.status =1
INNER JOIN VOYAGE on port.voyageId = voyage.id AND voyage.status = 1
where daily_report.status =1
AND daily_report.userId = 10
AND daily_report.date > datetime("2023-01-10 08:00:00")
AND daily_report.id NOT IN (
    11692,
    11822,
    12110,
    12111,
    12112,
    12113,
    12114,
    12115,
    12116,
    12117,
    12118,
    12119,
    12120,
    12121,
    12122,
    12123,
    12124,
    12125,
    12126,
    12127,
    12128,
    12129,
    12130,
    12131
)
order by daily_report.date DESC;



-- actualizar los reportes apartir de l 10 de enero para delante
UPDATE daily_report
SET date = datetime(date,'-5 hour')
WHERE   date > datetime("2023-01-10 08:00:00")
AND id NOT IN (
11692,
11822,
12110,
12111,
12112,
12113,
12114,
12115,
12116,
12117,
12118,
12119,
12120,
12121,
12122,
12123,
12124,
12125,
12126,
12127,
12128,
12129,
12130,
12131
)
 



