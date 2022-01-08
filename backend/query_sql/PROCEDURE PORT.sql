

				  

/*

EXEC SP_BuscarPuertoPorId   @portId = 1

*/
CREATE OR ALTER PROCEDURE  SP_BuscarPuertoPorId
 	 @portId int
AS
BEGIN

	SELECT * FROM port WHERE port.id =   @portId;
END
GO 




 /*
 
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :


 EXEC SP_CreateNewPort
	@userId =1,
	@voyageId =1,
	@portNumber =1,
	@departurePort ='',
	@arrivalPort = '',
	@userIdCreated =1,
	@dateCreated ='',
	@userIdUpdated =1,
	@dateUpdated ='',
	@status =1

	*/
CREATE OR ALTER PROCEDURE SP_CreateNewPort
	@userId int,
	@voyageId int,
	@portNumber int,
	@departurePort nvarchar(255),
	@arrivalPort nvarchar(255),
	@userIdCreated int,
	@dateCreated nvarchar(255),
	@userIdUpdated int,
	@dateUpdated nvarchar(255),
	@status bit
AS
BEGIN



	DECLARE @OutputTable TABLE ("id" int);
	
	
	INSERT INTO "port"("userId", "voyageId", "portNumber", "departurePort", "arrivalPort", "userIdCreated", "dateCreated", "userIdUpdated", "dateUpdated", "status")
	OUTPUT INSERTED."id" INTO @OutputTable VALUES (@userId, @voyageId, @portNumber, @departurePort, @arrivalPort, @userIdCreated, @dateCreated, @userIdUpdated, @dateUpdated, @status);
	
	 SELECT TOP 1 * FROM PORT WHERE PORT.id = (SELECT TOP 1 id FROM  @OutputTable);


END

GO 



 /*
 
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :


 EXEC SP_UpdatePort
	@portId = 1,
	@userId =1,
	@voyageId =1,
	@portNumber =1,
	@departurePort ='',
	@arrivalPort = '',
	@userIdCreated =1,
	@dateCreated ='',
	@userIdUpdated =1,
	@dateUpdated ='',
	@status =1

	*/
CREATE OR ALTER PROCEDURE SP_UpdatePort
	@portId int,
	@userId int,
	@voyageId int,
	@portNumber int,
	@departurePort nvarchar(255),
	@arrivalPort nvarchar(255),
	@userIdCreated int,
	@dateCreated nvarchar(255),
	@userIdUpdated int,
	@dateUpdated nvarchar(255),
	@status bit
AS
BEGIN



	UPDATE [dbo].[port]
   SET [userId] = @userId
      ,[voyageId] = @voyageId
      ,[portNumber] = @portNumber
      ,[departurePort] = @departurePort
      ,[arrivalPort] = @arrivalPort
      ,[userIdCreated] = @userIdCreated
      ,[dateCreated] = @dateCreated 
      ,[userIdUpdated] = @userIdUpdated 
      ,[dateUpdated] = @dateUpdated 
      ,[status] = @status
 WHERE [id] = @portId

	
	 SELECT TOP 1 * FROM PORT WHERE PORT.id = @portId;


END

GO 


