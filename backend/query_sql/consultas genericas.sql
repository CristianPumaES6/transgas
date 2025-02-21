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



-- Que viaje se registro en unusuario que no correspomde
select * from voyage  
WHERE voyage.userId = @userId
        AND voyage.id NOT IN(
                            select id from voyage  
                            WHERE voyage.userId = @userId
                                        )
                                        
-- solucion para los rpeortes registrados en otro puerto.
UPDATE daily_report
SET status = 0
where id in(991,992,993,994,995,996,997,998,999,1000) 


-- SOLUCION
UPDATE daily_report
SET bunkeringIfo = '1095.13'
WHERE id = 1048



--ver viajes duplicados
SELECT 
     voyageNumber, year,COUNT(*)
FROM 
    voyage
WHERE USERiD=31 AND STATUS =1
GROUP BY 
    voyageNumber, year
HAVING 
    COUNT(*) > 1;



-- ver puertos duplicados
SELECT 
     portNumber, voyageId,COUNT(*)
FROM 
    port
WHERE USERiD=31 AND STATUS =1
GROUP BY 
   portNumber, voyageId
HAVING 
    COUNT(*) > 1;


-- dias duplicados
SELECT 
     activityPerformed, date, hour,bunkeringIfo,bunkeringMgo, COUNT(*)
FROM 
    daily_report
WHERE USERiD=31 AND STATUS =1
GROUP BY 
   activityPerformed, date, hour,bunkeringIfo,bunkeringMgo
HAVING 
    COUNT(*) > 1;