/*

EXEC SP_ObtenerLosUltimos5Viajes @userId=2

*/
CREATE OR ALTER PROCEDURE SP_ObtenerLosUltimos5Viajes
	 @userId int
AS
BEGIN
	 SELECT TOP 5 * FROM voyage
	 WHERE voyage.userId = @userId
		AND voyage.status = 1
	 ORDER BY voyage.voyageNumber DESC
END

GO

/*
EXEC SP_ObtenerLosPuertoDeUnViaje @userId=2
*/
CREATE OR ALTER PROCEDURE  SP_ObtenerLosPuertoDeUnViaje
	 @userId int,
	 @voyageId int
AS
BEGIN
	 SELECT   * FROM port
	 WHERE 
		port.userId = @userId 
		AND port.voyageId = @voyageId
		AND port.status = 1

	 ORDER BY port.portNumber DESC
END

GO 


/*
Crear los reportes
*/
CREATE PROCEDURE SP_ObtenerLosReportesDelPuerto
	@userId int,
	@portId int
AS
BEGIN
	 SELECT   * FROM daily_report
	 WHERE 
		daily_report.userId = @userId 
		AND daily_report.portId = @portId
		AND daily_report.status = 1

	 ORDER BY daily_report.id DESC
END

/*
EXEC SP_DeleteVoyageById @voyageId=2
*/
CREATE OR ALTER PROCEDURE  SP_DeleteVoyageById
 	 @voyageId int
AS
BEGIN

	UPDATE   voyage
	SET voyage.status = 0

	WHERE voyage.id = @voyageId



	select 1

END

GO  


/*

EXEC SP_ObtenerViajePorId @voyageId=1

*/
CREATE OR ALTER PROCEDURE  SP_ObtenerViajePorId
 	 @voyageId int
AS
BEGIN

	SELECT * FROM voyage

	WHERE voyage.id = @voyageId
	AND voyage.status = 1

END

GO 



