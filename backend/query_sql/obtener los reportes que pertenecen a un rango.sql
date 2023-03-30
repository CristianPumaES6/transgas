
 -- Obtine los reportes de que esten activos o no lo esten
	SELECT daily_report.id, daily_report.date, daily_report.status 'REPORTE' , port.id,  port.status 'port2', voyage.id, voyage.status 'VOYAGE'
	FROM
		daily_report
	INNER JOIN 
		PORT on daily_report.portId = port.id 
	INNER JOIN 
		VOYAGE on port.voyageId = voyage.id  

	where daily_report.userId =24

		AND daily_report.date <= datetime("2022-06-29 14:30:00.000")

		AND daily_report.date >= datetime("2021-12-31 14:30:00.000")
	order by daily_report.date ASC; 

-- retorna todos los que esten activos desde el viaje port 
					SELECT *
					FROM daily_report
					INNER JOIN PORT on daily_report.portId = port.id AND port.status =1
					INNER JOIN VOYAGE on port.voyageId = voyage.id AND voyage.status = 1
					where daily_report.status =1
					AND daily_report.userId = 10  
					 ORDER by daily_report.date ASC;
					 
				 
 
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
	
	 ;
 
 
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


-- eliminar todos los reportes


 update  daily_report
 SET status=0
 where  userId = 10; 
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
 
 
 
 
 