-- Ustdes tienen la distancia y longitud de las 8 de la manana,

-- Esta Consulta Nos Muestra Como Se Obteiene Las 24hrs De Consumo
SELECT datetime(daily_report.date,'8.999999 hour'),MIN(daily_report.date), MAX(daily_report.date),SUM(distance),MIN(daily_report.hour), MAX(daily_report.hour), SUM(daily_report.steamingTime)

FROM daily_report
INNER JOIN PORT on daily_report.portId = port.id AND port.status =1
INNER JOIN VOYAGE on port.voyageId = voyage.id AND voyage.status = 1
where daily_report.status =1
AND daily_report.userId = 13

GROUP by strftime('%Y-%m-%d',datetime(daily_report.date,'8.999999 hour'))

ORDER by daily_report.id ASC;



-- Ustdes tienen la distancia y longitud de las 8 de la manana,

-- Esta Consulta Nos Muestra Como Se Obteiene Las 24hrs De Consumo
SELECT datetime(daily_report.date,'8.999999 hour'), daily_report.date,daily_report.hour,daily_report.steamingTime

FROM daily_report
INNER JOIN PORT on daily_report.portId = port.id AND port.status =1
INNER JOIN VOYAGE on port.voyageId = voyage.id AND voyage.status = 1
where daily_report.status =1
AND daily_report.userId = 13
 
ORDER by daily_report.id ASC 

-- LEONARDO BUQUE 13


select * 
from daily_report
where userId  =13
order by id desc;