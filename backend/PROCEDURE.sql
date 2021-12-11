
INSERT INTO [dbo].[user]
           ([nick]
           ,[name]
           ,[filename]
           ,[password]
           ,[language]
           ,[role]
           ,[years]
           ,[minSpeed]
           ,[maxSpeed]
           ,[isConsumptionIFO]
           ,[isConsumptionLSFO]
           ,[isConsumptionVLSFO]
           ,[isConsumptionMGO]
           ,[maxIFOConsumption]
           ,[maxMGOConsumption]
           ,[minIFOConsumption]
           ,[minMGOConsumption]
           ,[isMEMGO]
           ,[isAEMGO]
           ,[isBoilerMGO]
           ,[isIGMGO]
           ,[isPowerPMGO]
           ,[isOtherMGO]
           ,[isMEIFO]
           ,[isAEIFO]
           ,[isBoilerIFO]
           ,[isOtherIFO]
           ,[contractSpeedSailingBallastMGO]
           ,[contractSpeedSailingLadenMGO]
           ,[contractSpeedSailingEconomicalMGO]
           ,[loadingConsumptionMGO]
           ,[dischargeConsumptionMGO]
           ,[sailingBallastConsumptionMGO]
           ,[sailingLoadConsumptionMGO]
           ,[sailingEconomicConsumptionMGO]
           ,[anchoredConsumptionMGO]
           ,[maneuverConsumptionMGO]
           ,[otherConsumptionMGO]
           ,[contractSpeedSailingBallastIFO]
           ,[contractSpeedSailingLadenIFO]
           ,[contractSpeedSailingEconomicalIFO]
           ,[loadingConsumptionIFO]
           ,[dischargeConsumptionIFO]
           ,[sailingBallastConsumptionIFO]
           ,[sailingLoadConsumptionIFO]
           ,[sailingEconomicConsumptionIFO]
           ,[anchoredConsumptionIFO]
           ,[maneuverConsumptionIFO]
           ,[otherConsumptionIFO]
           ,[isDisplayLSFOConsumption]
           ,[isDisplayMGOConsumption]
           ,[isDisplayAverageSpeed]
           ,[isDisplayDataMGO]
           ,[isDisplayDataLSFO]
           ,[isDisplayVesselPerformanceLSFO]
           ,[isDisplayVesselPerformanceMGO]
           ,[consumptionEquipmentME_MGO]
           ,[consumptionEquipmentAE_MGO]
           ,[consumptionEquipmentBOILER_MGO]
           ,[consumptionEquipmentIG_MGO]
           ,[consumptionEquipmentPP_MGO]
           ,[consumptionEquipmentOther_MGO]
           ,[consumptionEquipmentME_IFO]
           ,[consumptionEquipmentAE_IFO]
           ,[consumptionEquipmentBOILER_IFO]
           ,[consumptionEquipmentOther_IFO]
           ,[userIdCreated]
           ,[dateCreated]
           ,[userIdUpdated]
           ,[dateUpdated]
           ,[status])
     VALUES
           ('SUPPORT_PE'
           ,'Support PE'
           ,'https://transgas.codev.site/images-f34c.png'
           ,'$2b$04$w00DiZWti2j/vo4v7glJPuj8ravRd.iU/ge.urF0T90oEEM7WYCiy'
           ,'EN'
           ,'SUPPORT'
           ,'[]'
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,0
           ,1
           ,''
           ,1
           ,''
           ,1)
GO




-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
CREATE OR ALTER PROCEDURE SP_ThisVoyageNumberExistsInTheYear
	@voyageNumber int,
	@yearVoyage int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM VOYAGE

	WHERE voyage.voyageNumber = @voyageNumber
	AND voyage.year =  @yearVoyage

END

GO


-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
CREATE OR ALTER PROCEDURE SP_CheckTheLastRecordedTrip
	@userId int,
	@year int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP 1 *
	FROM VOYAGE

	WHERE voyage.userId = @userId
	AND voyage.year =  @year
	AND voyage.status = 1

	ORDER BY VOYAGE.voyageNumber DESC
END

GO 

 /*
 
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :

 EXEC SP_CreateNewVoyage
	@userId =1,
	@voyageNumber =1235,
	@year =1,
	@userIdCreated =1,
	@dateCreated ='',
	@userIdUpdated =1,
	@dateUpdated ='',
	@status =1
	*/
CREATE OR ALTER PROCEDURE SP_CreateNewVoyage
	@userId int,
	@voyageNumber int,
	@year int,
	@userIdCreated int,
	@dateCreated nvarchar(255),
	@userIdUpdated int,
	@dateUpdated nvarchar(255),
	@status bit
AS
BEGIN

	DECLARE @OutputTable TABLE ("id" int);

	INSERT INTO VOYAGE ("userId", "voyageNumber", "year", "userIdCreated", "dateCreated", "userIdUpdated", "dateUpdated", "status") 
	OUTPUT INSERTED."id" INTO @OutputTable VALUES (@userId, @voyageNumber, @year, @userIdCreated, @dateCreated, @userIdUpdated, @dateUpdated, @status)
	
	SELECT TOP 1 * FROM VOYAGE WHERE VOYAGE.id = (SELECT TOP 1 id FROM  @OutputTable );


END

GO 




 /*
 
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :

 EXEC SP_ThereIsThisPortInTheVoyage
	@voyageId = 1,
	@portNumber = 2
*/
CREATE OR ALTER PROCEDURE SP_ThereIsThisPortInTheVoyage
	@voyageId int,
	@portNumber int
AS
BEGIN
	SELECT TOP 1 *
	FROM PORT

	WHERE PORT.voyageId = @voyageId
	AND PORT.portNumber =  @portNumber
	AND PORT.status = 1
END
GO 




-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
-- EXEC SP_CheckTheLastPortTrip '1','2'
CREATE OR ALTER PROCEDURE SP_CheckTheLastPortTrip
	@userId int,
	@voyageId int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP 1 *
	FROM PORT

	WHERE port.userId = @userId
	AND PORT.voyageId =  @voyageId
	AND PORT.status = 1

	ORDER BY port.portNumber DESC
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


 EXEC SP_CreateNewDailyReport
			@userId = 1
           ,@portId = 2
           ,@activityPerformed = ''
           ,@speedStraction = 'asd'
           ,@date =''
           ,@hour = ''
           ,@bunkeringIfo = 0
           ,@bunkeringMgo = 0
           ,@mplaIfo  = 0
           ,@auxIfo  = 0
           ,@boilerIfo  = 0
           ,@otherIfo = 0
           ,@mplaMgo = 0
           ,@auxMgo   = 0
           ,@boilerMgo   = 0
           ,@ppMgo = 0
           ,@giMgo = 0
           ,@otherMgo  = 0
           ,@steamingTime  = 0
           ,@distance =0
           ,@beaufour = ''
           ,@observation ='' 
			,@userIdCreated = 0
			,@dateCreated = ''
			,@userIdUpdated = 0
			,@dateUpdated = ''
			,@status = 0

	*/
CREATE OR ALTER PROCEDURE SP_CreateNewDailyReport
			@userId int 
           ,@portId int 
           ,@activityPerformed nvarchar(255) 
           ,@speedStraction nvarchar(255) 
           ,@date datetime 
           ,@hour nvarchar(255) 
           ,@bunkeringIfo  int  
           ,@bunkeringMgo   int 
           ,@mplaIfo   int 
           ,@auxIfo  int 
           ,@boilerIfo   int 
           ,@otherIfo  int 
           ,@mplaMgo  int 
           ,@auxMgo  int 
           ,@boilerMgo  int 
           ,@ppMgo int 
           ,@giMgo int 
           ,@otherMgo int 
           ,@steamingTime  int 
           ,@distance int 
           ,@beaufour nvarchar(255) 
           ,@observation nvarchar(255),
			@userIdCreated int,
			@dateCreated nvarchar(255),
			@userIdUpdated int,
			@dateUpdated nvarchar(255),
			@status bit
AS
BEGIN



	DECLARE @OutputTable TABLE ("id" int);
 

 
INSERT INTO [dbo].[daily_report]
           ([userId]
           ,[portId]
           ,[activityPerformed]
           ,[speedStraction]
           ,[date]
           ,[hour]
           ,[bunkeringIfo]
           ,[bunkeringMgo]
           ,[mplaIfo]
           ,[auxIfo]
           ,[boilerIfo]
           ,[otherIfo]
           ,[mplaMgo]
           ,[auxMgo]
           ,[boilerMgo]
           ,[ppMgo]
           ,[giMgo]
           ,[otherMgo]
           ,[steamingTime]
           ,[distance]
           ,[beaufour]
           ,[observation]
           ,[userIdCreated]
           ,[dateCreated]
           ,[userIdUpdated]
           ,[dateUpdated]
           ,[status])
    OUTPUT INSERTED."id" INTO @OutputTable VALUES 
           (@userId   
           ,@portId   
           ,@activityPerformed  
           ,@speedStraction 
           ,@date 
           ,@hour 
           ,@bunkeringIfo  
           ,@bunkeringMgo  
           ,@mplaIfo  
           ,@auxIfo  
           ,@boilerIfo    
           ,@otherIfo  
           ,@mplaMgo  
           ,@auxMgo  
           ,@boilerMgo 
           ,@ppMgo 
           ,@giMgo 
           ,@otherMgo 
           ,@steamingTime  
           ,@distance  
           ,@beaufour 
           ,@observation 
           ,@userIdCreated, @dateCreated, @userIdUpdated, @dateUpdated, @status);
	
 SELECT TOP 1 * FROM daily_report WHERE daily_report.id = (SELECT TOP 1 id FROM  @OutputTable);


END

GO 




							
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
-- EXEC SP_GetUserByNick  @nick = ''
CREATE OR ALTER PROCEDURE SP_GetUserByNick
	@nick varchar(55)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP 1 *
	FROM [dbo].[user]

	WHERE nick = @nick
	AND  status = 1

END

GO 





							
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
-- EXEC SP_GetUserByNick  @nick = ''
CREATE OR ALTER PROCEDURE SP_BuscarUsuarioPorId
	@userId int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP 1 *
	FROM [dbo].[user]

	WHERE id = @userId
	AND  status = 1


END

GO 



							
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
-- EXEC SP_BuscarUsuariosByFilter  @userId =0,@nick = '', @name = '',@role=''
CREATE OR ALTER PROCEDURE SP_BuscarUsuariosByFilter
	@userId  varchar(255),
	@nick varchar(255),
	@name varchar(255),
	@role varchar(255)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[user]

	
WHERE id LIKE '%%'
	AND nick LIKE '%'+ @nick +'%'
	AND name LIKE '%'+ @name +'%'
	AND role LIKE '%' +@role +'%'
	AND status != 0

END

GO 



							
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
-- EXEC SP_BuscarNickDisponible @nick = 'SUPPORT_PE'
CREATE OR ALTER PROCEDURE SP_BuscarNickDisponible
	@nick varchar(255)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[user]

	
WHERE	
	nick = @nick
	AND status != 0

END

GO 


 /*
 
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :


 EXEC SP_CreateNewUser
			@nick =''
           ,@name =''
           ,@filename =''
           ,@password =''
           ,@language =''
           ,@role =''
           ,@years  ='[]'
           ,@minSpeed  = 0
           ,@maxSpeed  = 0
           ,@isConsumptionIFO  = 1
           ,@isConsumptionLSFO = 1
           ,@isConsumptionVLSFO  = 1
           ,@isConsumptionMGO   = 1
           ,@maxIFOConsumption   = 0
           ,@maxMGOConsumption   = 0
           ,@minIFOConsumption   = 0
           ,@minMGOConsumption   = 0
           ,@isMEMGO   = 1
           ,@isAEMGO   = 1
           ,@isBoilerMGO   = 1
           ,@isIGMGO   = 1
           ,@isPowerPMGO   = 1
           ,@isOtherMGO   = 1
           ,@isMEIFO   = 1
           ,@isAEIFO   = 1
           ,@isBoilerIFO   = 1
           ,@isOtherIFO   = 1
           ,@contractSpeedSailingBallastMGO   = 0
           ,@contractSpeedSailingLadenMGO   = 0
           ,@contractSpeedSailingEconomicalMGO   = 0
           ,@loadingConsumptionMGO   = 0
           ,@dischargeConsumptionMGO   = 0
           ,@sailingBallastConsumptionMGO   = 0
           ,@sailingLoadConsumptionMGO   = 0
           ,@sailingEconomicConsumptionMGO   = 0
           ,@anchoredConsumptionMGO   = 0
           ,@maneuverConsumptionMGO   = 0
           ,@otherConsumptionMGO   = 0
           ,@contractSpeedSailingBallastIFO   = 0
           ,@contractSpeedSailingLadenIFO   = 0
           ,@contractSpeedSailingEconomicalIFO   = 0
           ,@loadingConsumptionIFO   = 0
           ,@dischargeConsumptionIFO   = 0
           ,@sailingBallastConsumptionIFO   = 0
           ,@sailingLoadConsumptionIFO   = 0
           ,@sailingEconomicConsumptionIFO   = 0
           ,@anchoredConsumptionIFO   = 0
           ,@maneuverConsumptionIFO   = 0
           ,@otherConsumptionIFO   = 0
           ,@isDisplayLSFOConsumption   = 1
           ,@isDisplayMGOConsumption   = 1
           ,@isDisplayAverageSpeed   = 1
           ,@isDisplayDataMGO   = 1
           ,@isDisplayDataLSFO   = 1
           ,@isDisplayVesselPerformanceLSFO   = 1
           ,@isDisplayVesselPerformanceMGO   = 1
           ,@consumptionEquipmentME_MGO   = 0
           ,@consumptionEquipmentAE_MGO   = 0
           ,@consumptionEquipmentBOILER_MGO   = 0
           ,@consumptionEquipmentIG_MGO   = 0
           ,@consumptionEquipmentPP_MGO   = 0
           ,@consumptionEquipmentOther_MGO   = 0
           ,@consumptionEquipmentME_IFO   = 0
           ,@consumptionEquipmentAE_IFO   = 0
           ,@consumptionEquipmentBOILER_IFO   = 0
           ,@consumptionEquipmentOther_IFO   = 0
           ,@userIdCreated   = 0
           ,@dateCreated   = ''
           ,@userIdUpdated   = 0
           ,@dateUpdated   = ''
           ,@status   = 1
	*/
CREATE OR ALTER PROCEDURE SP_CreateNewUser
			(@nick  nvarchar(255)
           ,@name  nvarchar(255)
           ,@filename  nvarchar(255)
           ,@password  nvarchar(255)
           ,@language  nvarchar(255)
           ,@role  nvarchar(255)
           ,@years  nvarchar(255)
           ,@minSpeed  int
           ,@maxSpeed  int
           ,@isConsumptionIFO  bit
           ,@isConsumptionLSFO  bit
           ,@isConsumptionVLSFO  bit
           ,@isConsumptionMGO  bit
           ,@maxIFOConsumption  int
           ,@maxMGOConsumption  int
           ,@minIFOConsumption  int
           ,@minMGOConsumption  int
           ,@isMEMGO  bit
           ,@isAEMGO  bit
           ,@isBoilerMGO  bit
           ,@isIGMGO  bit
           ,@isPowerPMGO  bit
           ,@isOtherMGO  bit
           ,@isMEIFO  bit
           ,@isAEIFO  bit
           ,@isBoilerIFO  bit
           ,@isOtherIFO  bit
           ,@contractSpeedSailingBallastMGO  int
           ,@contractSpeedSailingLadenMGO  int
           ,@contractSpeedSailingEconomicalMGO  int
           ,@loadingConsumptionMGO  int
           ,@dischargeConsumptionMGO  int
           ,@sailingBallastConsumptionMGO  int
           ,@sailingLoadConsumptionMGO  int
           ,@sailingEconomicConsumptionMGO  int
           ,@anchoredConsumptionMGO  int
           ,@maneuverConsumptionMGO  int
           ,@otherConsumptionMGO  int
           ,@contractSpeedSailingBallastIFO  int
           ,@contractSpeedSailingLadenIFO  int
           ,@contractSpeedSailingEconomicalIFO  int
           ,@loadingConsumptionIFO  int
           ,@dischargeConsumptionIFO  int
           ,@sailingBallastConsumptionIFO  int
           ,@sailingLoadConsumptionIFO  int
           ,@sailingEconomicConsumptionIFO  int
           ,@anchoredConsumptionIFO  int
           ,@maneuverConsumptionIFO  int
           ,@otherConsumptionIFO  int
           ,@isDisplayLSFOConsumption  bit
           ,@isDisplayMGOConsumption  bit
           ,@isDisplayAverageSpeed  bit
           ,@isDisplayDataMGO  bit
           ,@isDisplayDataLSFO  bit
           ,@isDisplayVesselPerformanceLSFO  bit
           ,@isDisplayVesselPerformanceMGO  bit
           ,@consumptionEquipmentME_MGO  int
           ,@consumptionEquipmentAE_MGO  int
           ,@consumptionEquipmentBOILER_MGO  int
           ,@consumptionEquipmentIG_MGO  int
           ,@consumptionEquipmentPP_MGO  int
           ,@consumptionEquipmentOther_MGO  int
           ,@consumptionEquipmentME_IFO  int
           ,@consumptionEquipmentAE_IFO  int
           ,@consumptionEquipmentBOILER_IFO  int
           ,@consumptionEquipmentOther_IFO  int
           ,@userIdCreated  int
           ,@dateCreated  nvarchar(255)
           ,@userIdUpdated  int
           ,@dateUpdated  nvarchar(255)
           ,@status  bit
           )
AS
BEGIN



	DECLARE @OutputTable TABLE ("id" int);
 

 

	INSERT INTO [dbo].[user]
			   ([nick]
			   ,[name]
			   ,[filename]
			   ,[password]
			   ,[language]
			   ,[role]
			   ,[years]
			   ,[minSpeed]
			   ,[maxSpeed]
			   ,[isConsumptionIFO]
			   ,[isConsumptionLSFO]
			   ,[isConsumptionVLSFO]
			   ,[isConsumptionMGO]
			   ,[maxIFOConsumption]
			   ,[maxMGOConsumption]
			   ,[minIFOConsumption]
			   ,[minMGOConsumption]
			   ,[isMEMGO]
			   ,[isAEMGO]
			   ,[isBoilerMGO]
			   ,[isIGMGO]
			   ,[isPowerPMGO]
			   ,[isOtherMGO]
			   ,[isMEIFO]
			   ,[isAEIFO]
			   ,[isBoilerIFO]
			   ,[isOtherIFO]
			   ,[contractSpeedSailingBallastMGO]
			   ,[contractSpeedSailingLadenMGO]
			   ,[contractSpeedSailingEconomicalMGO]
			   ,[loadingConsumptionMGO]
			   ,[dischargeConsumptionMGO]
			   ,[sailingBallastConsumptionMGO]
			   ,[sailingLoadConsumptionMGO]
			   ,[sailingEconomicConsumptionMGO]
			   ,[anchoredConsumptionMGO]
			   ,[maneuverConsumptionMGO]
			   ,[otherConsumptionMGO]
			   ,[contractSpeedSailingBallastIFO]
			   ,[contractSpeedSailingLadenIFO]
			   ,[contractSpeedSailingEconomicalIFO]
			   ,[loadingConsumptionIFO]
			   ,[dischargeConsumptionIFO]
			   ,[sailingBallastConsumptionIFO]
			   ,[sailingLoadConsumptionIFO]
			   ,[sailingEconomicConsumptionIFO]
			   ,[anchoredConsumptionIFO]
			   ,[maneuverConsumptionIFO]
			   ,[otherConsumptionIFO]
			   ,[isDisplayLSFOConsumption]
			   ,[isDisplayMGOConsumption]
			   ,[isDisplayAverageSpeed]
			   ,[isDisplayDataMGO]
			   ,[isDisplayDataLSFO]
			   ,[isDisplayVesselPerformanceLSFO]
			   ,[isDisplayVesselPerformanceMGO]
			   ,[consumptionEquipmentME_MGO]
			   ,[consumptionEquipmentAE_MGO]
			   ,[consumptionEquipmentBOILER_MGO]
			   ,[consumptionEquipmentIG_MGO]
			   ,[consumptionEquipmentPP_MGO]
			   ,[consumptionEquipmentOther_MGO]
			   ,[consumptionEquipmentME_IFO]
			   ,[consumptionEquipmentAE_IFO]
			   ,[consumptionEquipmentBOILER_IFO]
			   ,[consumptionEquipmentOther_IFO]
			   ,[userIdCreated]
			   ,[dateCreated]
			   ,[userIdUpdated]
			   ,[dateUpdated]
			   ,[status])
		OUTPUT INSERTED."id" INTO @OutputTable VALUES 
			  (@nick
			   ,@name
			   ,@filename
			   ,@password
			   ,@language
			   ,@role 
			   ,@years 
			   ,@minSpeed 
			   ,@maxSpeed
			   ,@isConsumptionIFO
			   ,@isConsumptionLSFO 
			   ,@isConsumptionVLSFO 
			   ,@isConsumptionMGO
			   ,@maxIFOConsumption
			   ,@maxMGOConsumption
			   ,@minIFOConsumption 
			   ,@minMGOConsumption 
			   ,@isMEMGO 
			   ,@isAEMGO
			   ,@isBoilerMGO 
			   ,@isIGMGO
			   ,@isPowerPMGO
			   ,@isOtherMGO 
			   ,@isMEIFO 
			   ,@isAEIFO
			   ,@isBoilerIFO 
			   ,@isOtherIFO
			   ,@contractSpeedSailingBallastMGO 
			   ,@contractSpeedSailingLadenMGO
			   ,@contractSpeedSailingEconomicalMGO 
			   ,@loadingConsumptionMGO 
			   ,@dischargeConsumptionMGO 
			   ,@sailingBallastConsumptionMGO 
			   ,@sailingLoadConsumptionMGO  
			   ,@sailingEconomicConsumptionMGO
			   ,@anchoredConsumptionMGO 
			   ,@maneuverConsumptionMGO
			   ,@otherConsumptionMGO 
			   ,@contractSpeedSailingBallastIFO 
			   ,@contractSpeedSailingLadenIFO 
			   ,@contractSpeedSailingEconomicalIFO 
			   ,@loadingConsumptionIFO
			   ,@dischargeConsumptionIFO 
			   ,@sailingBallastConsumptionIFO
			   ,@sailingLoadConsumptionIFO 
			   ,@sailingEconomicConsumptionIFO  
			   ,@anchoredConsumptionIFO 
			   ,@maneuverConsumptionIFO 
			   ,@otherConsumptionIFO 
			   ,@isDisplayLSFOConsumption  
			   ,@isDisplayMGOConsumption 
			   ,@isDisplayAverageSpeed 
			   ,@isDisplayDataMGO  
			   ,@isDisplayDataLSFO 
			   ,@isDisplayVesselPerformanceLSFO
			   ,@isDisplayVesselPerformanceMGO 
			   ,@consumptionEquipmentME_MGO
			   ,@consumptionEquipmentAE_MGO
			   ,@consumptionEquipmentBOILER_MGO
			   ,@consumptionEquipmentIG_MGO 
			   ,@consumptionEquipmentPP_MGO 
			   ,@consumptionEquipmentOther_MGO 
			   ,@consumptionEquipmentME_IFO
			   ,@consumptionEquipmentAE_IFO 
			   ,@consumptionEquipmentBOILER_IFO
			   ,@consumptionEquipmentOther_IFO
 
			   ,@userIdCreated, @dateCreated, @userIdUpdated, @dateUpdated, @status);
	
	 SELECT TOP 1 * FROM [dbo].[user] WHERE id = (SELECT TOP 1 id FROM  @OutputTable);


END

GO 






							
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
-- EXEC SP_GETEmailEstaEnUso @userId = '1', @nick = 'SUPPORT_PE'

CREATE OR ALTER PROCEDURE SP_GETEmailEstaEnUso
	@userId int,
	@nick varchar(255)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM [dbo].[user]
	WHERE id != @userId
	AND nick = @nick
	AND status = 1

END

GO   





 /*
 
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :


 EXEC SP_UpdateUser
			@id = '1'
			,@nick =''
           ,@name =''
           ,@filename =''
           ,@password =''
           ,@language =''
           ,@role =''
           ,@years  ='[]'
           ,@minSpeed  = 0
           ,@maxSpeed  = 0
           ,@isConsumptionIFO  = 1
           ,@isConsumptionLSFO = 1
           ,@isConsumptionVLSFO  = 1
           ,@isConsumptionMGO   = 1
           ,@maxIFOConsumption   = 0
           ,@maxMGOConsumption   = 0
           ,@minIFOConsumption   = 0
           ,@minMGOConsumption   = 0
           ,@isMEMGO   = 1
           ,@isAEMGO   = 1
           ,@isBoilerMGO   = 1
           ,@isIGMGO   = 1
           ,@isPowerPMGO   = 1
           ,@isOtherMGO   = 1
           ,@isMEIFO   = 1
           ,@isAEIFO   = 1
           ,@isBoilerIFO   = 1
           ,@isOtherIFO   = 1
           ,@contractSpeedSailingBallastMGO   = 0
           ,@contractSpeedSailingLadenMGO   = 0
           ,@contractSpeedSailingEconomicalMGO   = 0
           ,@loadingConsumptionMGO   = 0
           ,@dischargeConsumptionMGO   = 0
           ,@sailingBallastConsumptionMGO   = 0
           ,@sailingLoadConsumptionMGO   = 0
           ,@sailingEconomicConsumptionMGO   = 0
           ,@anchoredConsumptionMGO   = 0
           ,@maneuverConsumptionMGO   = 0
           ,@otherConsumptionMGO   = 0
           ,@contractSpeedSailingBallastIFO   = 0
           ,@contractSpeedSailingLadenIFO   = 0
           ,@contractSpeedSailingEconomicalIFO   = 0
           ,@loadingConsumptionIFO   = 0
           ,@dischargeConsumptionIFO   = 0
           ,@sailingBallastConsumptionIFO   = 0
           ,@sailingLoadConsumptionIFO   = 0
           ,@sailingEconomicConsumptionIFO   = 0
           ,@anchoredConsumptionIFO   = 0
           ,@maneuverConsumptionIFO   = 0
           ,@otherConsumptionIFO   = 0
           ,@isDisplayLSFOConsumption   = 1
           ,@isDisplayMGOConsumption   = 1
           ,@isDisplayAverageSpeed   = 1
           ,@isDisplayDataMGO   = 1
           ,@isDisplayDataLSFO   = 1
           ,@isDisplayVesselPerformanceLSFO   = 1
           ,@isDisplayVesselPerformanceMGO   = 1
           ,@consumptionEquipmentME_MGO   = 0
           ,@consumptionEquipmentAE_MGO   = 0
           ,@consumptionEquipmentBOILER_MGO   = 0
           ,@consumptionEquipmentIG_MGO   = 0
           ,@consumptionEquipmentPP_MGO   = 0
           ,@consumptionEquipmentOther_MGO   = 0
           ,@consumptionEquipmentME_IFO   = 0
           ,@consumptionEquipmentAE_IFO   = 0
           ,@consumptionEquipmentBOILER_IFO   = 0
           ,@consumptionEquipmentOther_IFO   = 0
           ,@userIdCreated   = 0
           ,@dateCreated   = ''
           ,@userIdUpdated   = 0
           ,@dateUpdated   = ''
           ,@status   = 1
	*/
CREATE OR ALTER PROCEDURE SP_UpdateUser
			(
			@id int
			,@nick  nvarchar(255)
           ,@name  nvarchar(255)
           ,@filename  nvarchar(255)
           ,@password  nvarchar(255)
           ,@language  nvarchar(255)
           ,@role  nvarchar(255)
           ,@years  nvarchar(255)
           ,@minSpeed  int
           ,@maxSpeed  int
           ,@isConsumptionIFO  bit
           ,@isConsumptionLSFO  bit
           ,@isConsumptionVLSFO  bit
           ,@isConsumptionMGO  bit
           ,@maxIFOConsumption  int
           ,@maxMGOConsumption  int
           ,@minIFOConsumption  int
           ,@minMGOConsumption  int
           ,@isMEMGO  bit
           ,@isAEMGO  bit
           ,@isBoilerMGO  bit
           ,@isIGMGO  bit
           ,@isPowerPMGO  bit
           ,@isOtherMGO  bit
           ,@isMEIFO  bit
           ,@isAEIFO  bit
           ,@isBoilerIFO  bit
           ,@isOtherIFO  bit
           ,@contractSpeedSailingBallastMGO  int
           ,@contractSpeedSailingLadenMGO  int
           ,@contractSpeedSailingEconomicalMGO  int
           ,@loadingConsumptionMGO  int
           ,@dischargeConsumptionMGO  int
           ,@sailingBallastConsumptionMGO  int
           ,@sailingLoadConsumptionMGO  int
           ,@sailingEconomicConsumptionMGO  int
           ,@anchoredConsumptionMGO  int
           ,@maneuverConsumptionMGO  int
           ,@otherConsumptionMGO  int
           ,@contractSpeedSailingBallastIFO  int
           ,@contractSpeedSailingLadenIFO  int
           ,@contractSpeedSailingEconomicalIFO  int
           ,@loadingConsumptionIFO  int
           ,@dischargeConsumptionIFO  int
           ,@sailingBallastConsumptionIFO  int
           ,@sailingLoadConsumptionIFO  int
           ,@sailingEconomicConsumptionIFO  int
           ,@anchoredConsumptionIFO  int
           ,@maneuverConsumptionIFO  int
           ,@otherConsumptionIFO  int
           ,@isDisplayLSFOConsumption  bit
           ,@isDisplayMGOConsumption  bit
           ,@isDisplayAverageSpeed  bit
           ,@isDisplayDataMGO  bit
           ,@isDisplayDataLSFO  bit
           ,@isDisplayVesselPerformanceLSFO  bit
           ,@isDisplayVesselPerformanceMGO  bit
           ,@consumptionEquipmentME_MGO  int
           ,@consumptionEquipmentAE_MGO  int
           ,@consumptionEquipmentBOILER_MGO  int
           ,@consumptionEquipmentIG_MGO  int
           ,@consumptionEquipmentPP_MGO  int
           ,@consumptionEquipmentOther_MGO  int
           ,@consumptionEquipmentME_IFO  int
           ,@consumptionEquipmentAE_IFO  int
           ,@consumptionEquipmentBOILER_IFO  int
           ,@consumptionEquipmentOther_IFO  int
           ,@userIdCreated  int
           ,@dateCreated  nvarchar(255)
           ,@userIdUpdated  int
           ,@dateUpdated  nvarchar(255)
           ,@status  bit
           )
AS
BEGIN

 

 
 UPDATE [dbo].[user]
 SET              nick=@nick
			,name=@name
			,filename=@filename
			,password=@password
			,language=@language
			,role =@role 
			,years =@years 
			,minSpeed =@minSpeed 
			,maxSpeed=@maxSpeed
			,isConsumptionIFO=@isConsumptionIFO
			,isConsumptionLSFO =@isConsumptionLSFO 
			,isConsumptionVLSFO =@isConsumptionVLSFO 
			,isConsumptionMGO=@isConsumptionMGO
			,maxIFOConsumption=@maxIFOConsumption
			,maxMGOConsumption=@maxMGOConsumption
			,minIFOConsumption =@minIFOConsumption 
			,minMGOConsumption =@minMGOConsumption 
			,isMEMGO =@isMEMGO 
			,isAEMGO=@isAEMGO
			,isBoilerMGO =@isBoilerMGO 
			,isIGMGO=@isIGMGO
			,isPowerPMGO=@isPowerPMGO
			,isOtherMGO =@isOtherMGO 
			,isMEIFO =@isMEIFO 
			,isAEIFO=@isAEIFO
			,isBoilerIFO =@isBoilerIFO 
			,isOtherIFO=@isOtherIFO
			,contractSpeedSailingBallastMGO =@contractSpeedSailingBallastMGO 
			,contractSpeedSailingLadenMGO=@contractSpeedSailingLadenMGO
			,contractSpeedSailingEconomicalMGO =@contractSpeedSailingEconomicalMGO 
			,loadingConsumptionMGO =@loadingConsumptionMGO 
			,dischargeConsumptionMGO =@dischargeConsumptionMGO 
			,sailingBallastConsumptionMGO =@sailingBallastConsumptionMGO 
			,sailingLoadConsumptionMGO  =@sailingLoadConsumptionMGO  
			,sailingEconomicConsumptionMGO=@sailingEconomicConsumptionMGO
			,anchoredConsumptionMGO =@anchoredConsumptionMGO 
			,maneuverConsumptionMGO=@maneuverConsumptionMGO
			,otherConsumptionMGO =@otherConsumptionMGO 
			,contractSpeedSailingBallastIFO =@contractSpeedSailingBallastIFO 
			,contractSpeedSailingLadenIFO =@contractSpeedSailingLadenIFO 
			,contractSpeedSailingEconomicalIFO =@contractSpeedSailingEconomicalIFO 
			,loadingConsumptionIFO=@loadingConsumptionIFO
			,dischargeConsumptionIFO =@dischargeConsumptionIFO 
			,sailingBallastConsumptionIFO=@sailingBallastConsumptionIFO
			,sailingLoadConsumptionIFO =@sailingLoadConsumptionIFO 
			,sailingEconomicConsumptionIFO  =@sailingEconomicConsumptionIFO  
			,anchoredConsumptionIFO =@anchoredConsumptionIFO 
			,maneuverConsumptionIFO =@maneuverConsumptionIFO 
			,otherConsumptionIFO =@otherConsumptionIFO 
			,isDisplayLSFOConsumption  =@isDisplayLSFOConsumption  
			,isDisplayMGOConsumption =@isDisplayMGOConsumption 
			,isDisplayAverageSpeed =@isDisplayAverageSpeed 
			,isDisplayDataMGO  =@isDisplayDataMGO  
			,isDisplayDataLSFO =@isDisplayDataLSFO 
			,isDisplayVesselPerformanceLSFO=@isDisplayVesselPerformanceLSFO
			,isDisplayVesselPerformanceMGO =@isDisplayVesselPerformanceMGO 
			,consumptionEquipmentME_MGO=@consumptionEquipmentME_MGO
			,consumptionEquipmentAE_MGO=@consumptionEquipmentAE_MGO
			,consumptionEquipmentBOILER_MGO=@consumptionEquipmentBOILER_MGO
			,consumptionEquipmentIG_MGO =@consumptionEquipmentIG_MGO 
			,consumptionEquipmentPP_MGO =@consumptionEquipmentPP_MGO 
			,consumptionEquipmentOther_MGO =@consumptionEquipmentOther_MGO 
			,consumptionEquipmentME_IFO=@consumptionEquipmentME_IFO
			,consumptionEquipmentAE_IFO =@consumptionEquipmentAE_IFO 
			,consumptionEquipmentBOILER_IFO=@consumptionEquipmentBOILER_IFO
			,consumptionEquipmentOther_IFO=@consumptionEquipmentOther_IFO
			,userIdCreated=@userIdCreated
            ,dateCreated=@dateCreated
            ,userIdUpdated=@userIdUpdated
            ,dateUpdated=@dateUpdated
            ,status=@status
	WHERE
		id = @id;

	 SELECT TOP 1 * FROM [dbo].[user] WHERE id = @id;


END

GO 




							
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :
-- EXEC SP_UpdateImageUser @id = 1 ,@urlImage = 'SUPPORT_PE'
CREATE OR ALTER PROCEDURE SP_UpdateImageUser
	@id int,
	@urlImage varchar(255)
AS
BEGIN
	SET NOCOUNT ON;

	
	UPDATE [dbo].[user]
	SET filename = @urlImage
	
WHERE	
	id = @id


	select 1
END

GO 

