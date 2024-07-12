
// ESto nos debe arrojar 15
SELECT length(date) FROM daily_report
GROUP BY  length(date);



// Borramos los 0 de mas.
SELECT  SUBSTRING(daily_report.date, 1, 19),daily_report.date
FROM daily_report
where  length(daily_report.date) = 23
// Aqui falta agregar un update


// aqui un ejemplo de ocmo se concatena las horas.
SELECT  SUBSTRING(daily_report.date, 1, 19),
        daily_report.date,
        hour,
         SUBSTRING(daily_report.date, 1, 11) || daily_report.hour || ':00',
        -- Aqui le restamos 5 horas.
        -- y hacemos que la fecha este igual a la hora registrada.
        -- datetime(daily_report.date,'-5 hour'  ) AS 'MORE HOURS',
        datetime(daily_report.date) 
FROM daily_report
where  
    daily_report.userId = 13
    AND length(daily_report.date) = 23
    AND status = true;
        
select * from voyage
where userId= 27;

select * from port
where userid = 27
order by id desc;


select * from daily_report
  where userId = 27
order by id desc;
  

select *
from voyage
  where userId = 27
order by id desc;





order by id desc;

SELECT datetime(daily_report.date,'8.999999 hour'),MIN(daily_report.date), MAX(daily_report.date),SUM(distance),MIN(daily_report.hour), MAX(daily_report.hour), SUM(daily_report.steamingTime)
FROM daily_report
INNER JOIN PORT on daily_report.portId = port.id AND port.status =1
INNER JOIN VOYAGE on port.voyageId = voyage.id AND voyage.status = 1
where daily_report.status =1
AND daily_report.userId = 27;



select * from daily_report
where  daily_report.userId = 27;



SELECT daily_report.id, datetime(daily_report.date,'8.999999 hour'), daily_report.date
FROM daily_report
INNER JOIN PORT on daily_report.portId = port.id AND port.status =1
INNER JOIN VOYAGE on port.voyageId = voyage.id AND voyage.status = 1
where daily_report.status =1
AND daily_report.userId = 27
order by daily_report.id asc;




SELECT  SUBSTRING(daily_report.date, 1, 19),
        daily_report.date,
        hour,
         SUBSTRING(daily_report.date, 1, 11) || daily_report.hour || ':00',
        -- Aqui le restamos 5 horas.
        -- y hacemos que la fecha este igual a la hora registrada.
        -- datetime(daily_report.date,'-5 hour'  ) AS 'MORE HOURS',
        datetime(daily_report.date) 
FROM daily_report
where  
    daily_report.userId = 27
    AND length(daily_report.date) = 23
    AND status = true;
        



// actualizar fecha, agregar hora  a la fecha
UPDATE daily_report
set date = SUBSTRING(daily_report.date, 1, 11) || daily_report.hour || ':00'
where daily_report.userId = 27;


-- MARIA JOSE - ENAMORADA DE JORGE

--------------------------------------
-----------[  LEONARDO B  ]-----------
--------------------------------------
-- Primero actualizar el horario a todos los registros.
-- ya que desde la subida de data masiva no agrega la hora.

UPDATE daily_report
SET date =   SUBSTRING(date, 1, 11) || hour || ':00'
WHERE
    daily_report.userId = 22
    AND id >= 5329;


-- Luego le resto la diferencia de horario por la zona horaria.

UPDATE daily_report
SET date =   datetime(date,'+3 hour'  )
WHERE  
    daily_report.userId = 22
    AND id >= 5329;







