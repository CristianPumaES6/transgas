SELECT * FROM daily_report


SELECT daily_report.date, datetime(daily_report.date) FROM daily_report

UPDATE daily_report
SET date = datetime(date)

select * from user where user.nick like '%ADR%';
--ALEJANDRO 2
-- WINCANTON 6
--ADRIAN 9
select * from daily_report  WHERE userid = 2 order by id DESC

-- Saber que reporte se registro en un puerto que no pertenece al usuario.
select * from daily_report  
WHERE daily_report.userId = @userId
        AND daily_report.portId NOT IN(
                                        select id from port where port.userId = @userId
                                        );



-- Que puerto se registro un viaje que no pertenece.
select * from port  
WHERE port.userId = @userId
        AND port.voyageId NOT IN(
                                        select id from voyage where voyage.userId = @userId   
                                        )
