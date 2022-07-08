 


// Si la hora esta correcta saldra 5 que es el total de caracteres de 08:00
SELECT LENGTH(hour) FROM daily_report
GROUP by LENGTH(hour);

CONSULTAS SQLITE
UPDATE HORA CON 4 digitos.

// Consultamos si hay algun registro de hora con 4 caracteres.
SELECT hour FROM daily_report
WHERE LENGTH(hour) = 4

SELECT ("0"||daily_report.hour ) AS 'Modi' FROM daily_report
WHERE LENGTH(hour) = 4

UPDATE daily_report
SET hour = "0"||daily_report.hour
WHERE LENGTH(hour) = 4

 