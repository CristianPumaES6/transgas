
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
        







