
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







