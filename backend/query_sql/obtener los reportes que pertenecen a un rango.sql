-- retorna todos los que esten activos desde el viaje port 
SELECT *
FROM daily_report
INNER JOIN PORT on daily_report.portId = port.id AND port.status =1
INNER JOIN VOYAGE on port.voyageId = voyage.id AND voyage.status = 1
where daily_report.status =1
AND daily_report.userId = 10  
 ORDER by daily_report.id ASC;
 
 
 
 -- Obtine los reportes de que esten activos o no lo esten
 SELECT daily_report.date,port.status, voyage.status ,  daily_report.status  

FROM daily_report
INNER JOIN PORT on daily_report.portId = port.id 
INNER JOIN VOYAGE on port.voyageId = voyage.id  

where daily_report.userId = 10  
	AND daily_report.date <= datetime("2022-05-12 09:30:00.000")
	;
	
	
	
	-- obtinee sol olos reportes que esten activos
	
 SELECT *
 FROM daily_report
 WHERE daily_report.portId in (
	 
	 SELECT port.id
	 FROM port
	 WHERE port.voyageId in (
		 select voyage.id
		 from voyage
		 where  voyage.id >=84 and  voyage.userId = 10
	 )
 )
	
	 
 
 
 -- Busca los viajes
  select *
		 from voyage
		 where  voyage.userId = 10
 
  
 
 -- Observamos que los reportes apartir de 84 sson del 2022
 select voyage.id
 from voyage
 where  voyage.id >=84 and  voyage.userId = 10;

 -- Actualizo todos los viajes
 update  voyage
 SET status=1
 where id >=84 and userId = 10;
 
		 select *
		 from voyage
		 where  voyage.id >=84 and  voyage.userId = 10
 
;


 SELECT *
 FROM daily_report
 WHERE daily_report.portId in (
	 
	 SELECT port.id
	 FROM port
	 WHERE port.voyageId in (
		 select voyage.id
		 from voyage
		 where  voyage.id >=84 and  voyage.userId = 10
	 )
 )
 
 
 
 
 