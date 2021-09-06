
-- Verificamos si todo esta ok, Ordennado de adelante para atras la fecha
SELECT id, DATETIME(DATE(date), hour)  , daily_report.date , daily_report.hour from daily_report;

-- Si existe una fecha que con null lo volvemos a verificar, buscando por ID
SELECT id,  daily_report.date , daily_report.hour , '22:24'
FROM daily_report
WHERE id = 937;


-- Actualizamos la fecha con la hora.
UPDATE daily_report
SET date =  DATETIME(DATE(date), hour)
WHERE id >= 1;


-- Una vez actualizado lo que hacemos es le sumamos 5 horas.
UPDATE daily_report
SET date =  DATETIME(date, '+300 minutes') 
WHERE id >= 1;
