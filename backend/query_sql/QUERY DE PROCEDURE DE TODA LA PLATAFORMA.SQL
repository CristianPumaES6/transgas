USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[ConsultaMantenimientoPorBD]    Script Date: 1/16/2025 5:48:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[ConsultaMantenimientoPorBD]
    @dbName NVARCHAR(128),       -- Parámetro para el nombre de la base de datos
    @tareaId UNIQUEIDENTIFIER     -- Parámetro para el valor de N0.Tarea
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);
    DECLARE @params NVARCHAR(500);

    -- Definir los parámetros que se van a pasar al SQL dinámico
    SET @params = N'@tareaId UNIQUEIDENTIFIER';

    -- Construir el query dinámico con el nombre de la base de datos y el parámetro N0.Tarea
    SET @sql = N'SELECT TOP 3 
           ELM.Oid AS ELM_Oid, ELM.Codigo AS ELM_Codigo,
           ETM.Oid AS ETM_Oid, ETM.Descripcion AS ETM_Descripcion,
           N0.FechaProgramacion, N0.FechaEjecucion, N0.EstaTerminado
    FROM ' + QUOTENAME(@dbName) + N'.dbo.EquipoListaMantenimientoTarea N0
        INNER JOIN ' + QUOTENAME(@dbName) + N'.dbo.EquipoListaMantenimiento ELM 
            ON ELM.Oid = N0.Lista
        INNER JOIN ' + QUOTENAME(@dbName) + N'.dbo.EquipoTareaMantenimiento ETM
            ON ETM.Oid = N0.Tarea
    WHERE N0.GCRecord IS NULL 
      AND N0.Tarea = @tareaId 
      AND ELM.GCRecord IS NULL
      AND ETM.GCRecord IS NULL
    ORDER BY N0.FechaProgramacion DESC;';

    -- Ejecutar el SQL dinámico pasando el parámetro de tarea
    EXEC sp_executesql @sql, @params, @tareaId = @tareaId;
END;
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_BuscarNickDisponible]    Script Date: 1/16/2025 5:50:05 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE  PROCEDURE [dbo].[SP_BuscarNickDisponible]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_BuscarUsuarioPorId]    Script Date: 1/16/2025 5:50:30 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE  PROCEDURE [dbo].[SP_BuscarUsuarioPorId]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_BuscarUsuariosByFilter]    Script Date: 1/16/2025 5:50:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE  PROCEDURE [dbo].[SP_BuscarUsuariosByFilter]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_CheckTheLastPortTrip]    Script Date: 1/16/2025 5:51:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SP_CheckTheLastPortTrip]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_CheckTheLastRecordedTrip]    Script Date: 1/16/2025 5:51:20 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE  PROCEDURE [dbo].[SP_CheckTheLastRecordedTrip]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_CreateNewVoyage]    Script Date: 1/16/2025 5:51:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE  PROCEDURE [dbo].[SP_CreateNewVoyage]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_DeleteVoyageById]    Script Date: 1/16/2025 5:52:03 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE  [dbo].[SP_DeleteVoyageById]
 	 @voyageId int
AS
BEGIN

	UPDATE   voyage
	SET voyage.status = 0

	WHERE voyage.id = @voyageId



	select 1

END

GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_GetUserByNick]    Script Date: 1/16/2025 5:52:16 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetUserByNick]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_ObtenerLosPuertoDeUnViaje]    Script Date: 1/16/2025 5:52:31 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE  [dbo].[SP_ObtenerLosPuertoDeUnViaje]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_ObtenerLosReportesDelPuerto]    Script Date: 1/16/2025 5:52:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SP_ObtenerLosReportesDelPuerto]
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

GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_ObtenerLosUltimos5Viajes]    Script Date: 1/16/2025 5:53:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE  [dbo].[SP_ObtenerLosUltimos5Viajes]
	 @userId int,
	 @year int
AS
BEGIN
	 SELECT TOP 5 * FROM voyage
	 WHERE voyage.userId = @userId
		AND voyage.year = @year
		AND voyage.status = 1
	 ORDER BY voyage.voyageNumber DESC
END
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_ObtenerViajePorId]    Script Date: 1/16/2025 5:53:13 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE  [dbo].[SP_ObtenerViajePorId]
 	 @voyageId int
AS
BEGIN

	SELECT * FROM voyage

	WHERE voyage.id = @voyageId
	AND voyage.status = 1

END

GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_ThereIsThisPortInTheVoyage]    Script Date: 1/16/2025 5:53:25 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE  PROCEDURE [dbo].[SP_ThereIsThisPortInTheVoyage]
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


USE [FuelOilPlatformDBTest]
GO

/****** Object:  StoredProcedure [dbo].[SP_ViewFileAnalysisOil]    Script Date: 1/16/2025 5:53:38 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SP_ViewFileAnalysisOil]
    @nameBaseDatos NVARCHAR(128),  -- Nombre de la base de datos
    @OidTarea UNIQUEIDENTIFIER     -- Oid de la tarea
AS
BEGIN
    -- Declarar una variable para almacenar el query dinámico
    DECLARE @sql NVARCHAR(MAX);

    -- Construir el query dinámico utilizando el nombre de la base de datos y el Oid de la tarea
    SET @sql = N'
        SELECT 
          fd.Filename,fd.Content,fd.size
        FROM 
            ' + QUOTENAME(@nameBaseDatos) + '.dbo.EquipoListaMantenimiento lm
            INNER JOIN ' + QUOTENAME(@nameBaseDatos) + '.dbo.EquipoListaMantenimientoTarea lmt ON lm.Oid = lmt.Lista
            INNER JOIN ' + QUOTENAME(@nameBaseDatos) + '.dbo.EquipoTareaMantenimiento tm ON lmt.Tarea = tm.Oid
            INNER JOIN ' + QUOTENAME(@nameBaseDatos) + '.dbo.EquipoListaMantenimientoTareaArchivo lmta ON lmt.Oid = lmta.Tarea
            INNER JOIN ' + QUOTENAME(@nameBaseDatos) + '.dbo.Filedata fd ON lmta.Archivo = fd.Oid
        WHERE 
            tm.Oid = @OidTarea';

    -- Ejecutar el query dinámico
    EXEC sp_executesql @sql, N'@OidTarea UNIQUEIDENTIFIER', @OidTarea;
END;

GO


