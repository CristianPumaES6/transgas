				  

/*

EXEC SP_BuscarReportePorId   @dailyReportId = 1

*/
CREATE OR ALTER PROCEDURE  SP_BuscarReportePorId
 	 @dailyReportId int
AS
BEGIN

	SELECT * FROM daily_report WHERE daily_report.id =   @dailyReportId AND daily_report.status = 1;
END
GO 




/*

EXEC SP_ObtenerLosReportesDelPuerto @portId

*/
CREATE OR ALTER PROCEDURE  SP_ObtenerLosReportesDelPuerto
 	 @portId int
AS
BEGIN

	SELECT * FROM daily_report

	WHERE daily_report.portId = @portId
	AND daily_report.status = 1

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
           ,@date  nvarchar(255)  
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
           , TRY_CONVERT(datetime2, @date , 103)
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





 /*
 
-- USUARIO : 
-- Create by: Cristian Puma Villalva
-- Date     :  2021/12/10
-- Update by: 
-- Date     :


 EXEC SP_UpdateDailyReport
			@id= 1,
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
			,@userIdUpdated = 0
			,@dateUpdated = ''
			,@status = 1

	*/
CREATE OR ALTER PROCEDURE SP_UpdateDailyReport
			@id int,
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
			@userIdUpdated int,
			@dateUpdated nvarchar(255),
			@status bit
AS
BEGIN

 
UPDATE [dbo].[daily_report]
   SET [userId] = @userId 
      ,[portId] = @portId 
      ,[activityPerformed] = @activityPerformed 
      ,[speedStraction] = @speedStraction 
      ,[date] = @date 
      ,[hour] = @hour
      ,[bunkeringIfo] = @bunkeringIfo 
      ,[bunkeringMgo] = @bunkeringMgo 
      ,[mplaIfo] = @mplaIfo 
      ,[auxIfo] = @auxIfo 
      ,[boilerIfo] = @boilerIfo 
      ,[otherIfo] = @otherIfo 
      ,[mplaMgo] = @mplaMgo 
      ,[auxMgo] = @auxMgo 
      ,[boilerMgo] = @boilerMgo 
      ,[ppMgo] = @ppMgo 
      ,[giMgo] = @giMgo 
      ,[otherMgo] = @otherMgo 
      ,[steamingTime] = @steamingTime 
      ,[distance] = @distance 
      ,[beaufour] = @beaufour 
      ,[observation] = @observation  
      ,[userIdUpdated] = @userIdUpdated 
      ,[dateUpdated] = @dateUpdated 
      ,[status] = @status 
 WHERE 
  [id] = @id;
	
 SELECT TOP 1 * FROM daily_report WHERE daily_report.id = @id;


END

GO 

  