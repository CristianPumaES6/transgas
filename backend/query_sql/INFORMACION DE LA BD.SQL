USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[voyage]    Script Date: 1/22/2025 6:26:02 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[voyage](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NOT NULL,
	[voyageNumber] [int] NOT NULL,
	[year] [int] NOT NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_b1c94a580f8750873bc11952032] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO





USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[user]    Script Date: 1/22/2025 6:25:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[imo] [nvarchar](255) NULL,
	[nick] [nvarchar](255) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[filename] [nvarchar](255) NULL,
	[password] [nvarchar](255) NOT NULL,
	[language] [nvarchar](255) NULL,
	[role] [nvarchar](255) NOT NULL,
	[years] [nvarchar](255) NOT NULL,
	[minSpeed] [decimal](18, 8) NOT NULL,
	[maxSpeed] [decimal](18, 8) NOT NULL,
	[isConsumptionIFO] [bit] NOT NULL,
	[isConsumptionLSFO] [bit] NOT NULL,
	[isConsumptionVLSFO] [bit] NOT NULL,
	[isConsumptionMGO] [bit] NOT NULL,
	[maxIFOConsumption] [decimal](18, 8) NOT NULL,
	[maxMGOConsumption] [decimal](18, 8) NOT NULL,
	[minIFOConsumption] [decimal](18, 8) NOT NULL,
	[minMGOConsumption] [decimal](18, 8) NOT NULL,
	[isMEMGO] [bit] NOT NULL,
	[isAEMGO] [bit] NOT NULL,
	[isBoilerMGO] [bit] NOT NULL,
	[isIGMGO] [bit] NOT NULL,
	[isPowerPMGO] [bit] NOT NULL,
	[isOtherMGO] [bit] NOT NULL,
	[isMEIFO] [bit] NOT NULL,
	[isAEIFO] [bit] NOT NULL,
	[isBoilerIFO] [bit] NOT NULL,
	[isOtherIFO] [bit] NOT NULL,
	[contractSpeedSailingBallastMGO] [decimal](18, 8) NOT NULL,
	[contractSpeedSailingLadenMGO] [decimal](18, 8) NOT NULL,
	[contractSpeedSailingEconomicalMGO] [decimal](18, 8) NOT NULL,
	[loadingConsumptionMGO] [decimal](18, 8) NOT NULL,
	[dischargeConsumptionMGO] [decimal](18, 8) NOT NULL,
	[sailingBallastConsumptionMGO] [decimal](18, 8) NOT NULL,
	[sailingLoadConsumptionMGO] [decimal](18, 8) NOT NULL,
	[sailingEconomicConsumptionMGO] [decimal](18, 8) NOT NULL,
	[anchoredConsumptionMGO] [decimal](18, 8) NOT NULL,
	[maneuverConsumptionMGO] [decimal](18, 8) NOT NULL,
	[otherConsumptionMGO] [decimal](18, 8) NOT NULL,
	[contractSpeedSailingBallastIFO] [decimal](18, 8) NOT NULL,
	[contractSpeedSailingLadenIFO] [decimal](18, 8) NOT NULL,
	[contractSpeedSailingEconomicalIFO] [decimal](18, 8) NOT NULL,
	[loadingConsumptionIFO] [decimal](18, 8) NOT NULL,
	[dischargeConsumptionIFO] [decimal](18, 8) NOT NULL,
	[sailingBallastConsumptionIFO] [decimal](18, 8) NOT NULL,
	[sailingLoadConsumptionIFO] [decimal](18, 8) NOT NULL,
	[sailingEconomicConsumptionIFO] [decimal](18, 8) NOT NULL,
	[anchoredConsumptionIFO] [decimal](18, 8) NOT NULL,
	[maneuverConsumptionIFO] [decimal](18, 8) NOT NULL,
	[otherConsumptionIFO] [decimal](18, 8) NOT NULL,
	[isDisplayLSFOConsumption] [bit] NOT NULL,
	[isDisplayMGOConsumption] [bit] NOT NULL,
	[isDisplayAverageSpeed] [bit] NOT NULL,
	[isDisplayDataMGO] [bit] NOT NULL,
	[isDisplayDataLSFO] [bit] NOT NULL,
	[isDisplayVesselPerformanceLSFO] [bit] NOT NULL,
	[isDisplayVesselPerformanceMGO] [bit] NOT NULL,
	[consumptionEquipmentME_MGO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentAE_MGO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentBOILER_MGO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentIG_MGO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentPP_MGO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentOther_MGO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentME_IFO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentAE_IFO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentBOILER_IFO] [decimal](18, 8) NOT NULL,
	[consumptionEquipmentOther_IFO] [decimal](18, 8) NOT NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_cace4a159ff9f2512dd42373760] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_22db046af6c54dc4bce009da1de]  DEFAULT ('') FOR [years]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_e08adbc368e346b8091be24b02b]  DEFAULT ((0)) FOR [minSpeed]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_9d937746d400f71cb4f744f6593]  DEFAULT ((0)) FOR [maxSpeed]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_8f1f215f6495d5aa12119da6d42]  DEFAULT ((1)) FOR [isConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_5be6815424b3c9133a235c62202]  DEFAULT ((1)) FOR [isConsumptionLSFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_bfcdca3e9b3b9a5f0a155640428]  DEFAULT ((0)) FOR [isConsumptionVLSFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_5a0c39ab248382d50de29501f4c]  DEFAULT ((1)) FOR [isConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_57b48c2d31d46ef5c8a08119359]  DEFAULT ((0)) FOR [maxIFOConsumption]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_dd54501e0fa84df16ff1a4879ff]  DEFAULT ((0)) FOR [maxMGOConsumption]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_2a32b0351b5242ac1199090d70f]  DEFAULT ((0)) FOR [minIFOConsumption]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_ddc98a7d5be1f5e6b6aba2ef471]  DEFAULT ((0)) FOR [minMGOConsumption]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_99ca5c04f4695f4c0191d99ce7e]  DEFAULT ((1)) FOR [isMEMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_a1a8d523aacd4c067cced237a3b]  DEFAULT ((1)) FOR [isAEMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_8f950f06d2f94477ebe0abdd18a]  DEFAULT ((1)) FOR [isBoilerMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_7aacea61c5ae101ab0dcb8edb4a]  DEFAULT ((1)) FOR [isIGMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_b1e303fc42337bfe209c6267720]  DEFAULT ((1)) FOR [isPowerPMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_c964a18da233f8bfd07ef12862c]  DEFAULT ((1)) FOR [isOtherMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_f5b3a41649e956a2e35e2df5ac4]  DEFAULT ((1)) FOR [isMEIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_7478e952d58d0c1ce9afe8391f3]  DEFAULT ((1)) FOR [isAEIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_274f6e5bdc30fd689c1fea093e8]  DEFAULT ((1)) FOR [isBoilerIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_a4e034ea6c67a2a2479be109045]  DEFAULT ((1)) FOR [isOtherIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_56464512e579a66001608ed7bef]  DEFAULT ((0)) FOR [contractSpeedSailingBallastMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_234a434e621a366fd04c79e6759]  DEFAULT ((0)) FOR [contractSpeedSailingLadenMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_d4777285b26c0e7e2ef684e611b]  DEFAULT ((0)) FOR [contractSpeedSailingEconomicalMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_1d72cda654ada8bb02626aaaeb2]  DEFAULT ((0)) FOR [loadingConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_9695ff883956f1ed35963545b6f]  DEFAULT ((0)) FOR [dischargeConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_ffa010a7074e6d520e2019add0e]  DEFAULT ((0)) FOR [sailingBallastConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_f1ee7407a3af6f41472f4d340f2]  DEFAULT ((0)) FOR [sailingLoadConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_3c2cdc1f4438360449ad466355a]  DEFAULT ((0)) FOR [sailingEconomicConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_53eb72898eba6f08dd36d2a128b]  DEFAULT ((0)) FOR [anchoredConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_966563075a8b0780d301881c2bb]  DEFAULT ((0)) FOR [maneuverConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_2f90bc8f807636035b9e559af3e]  DEFAULT ((0)) FOR [otherConsumptionMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_25e166dff76aac50912e3f90505]  DEFAULT ((0)) FOR [contractSpeedSailingBallastIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_6e8e82185d195ad4f4030bf7713]  DEFAULT ((0)) FOR [contractSpeedSailingLadenIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_2af1b20f9676eb25fd10c4ab2d1]  DEFAULT ((0)) FOR [contractSpeedSailingEconomicalIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_5c9c6b93cc50aaf28bc20f9cfef]  DEFAULT ((0)) FOR [loadingConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_91228e575264826ed9a499a38e1]  DEFAULT ((0)) FOR [dischargeConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_2eb2bc4a063f20e2262d89fcd4c]  DEFAULT ((0)) FOR [sailingBallastConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_902e2ce28bcc63fe6fcc565871c]  DEFAULT ((0)) FOR [sailingLoadConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_c48f9e022c8ad39e0b7cb00dc73]  DEFAULT ((0)) FOR [sailingEconomicConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_6d6bd5d6b78309b83da67cd0437]  DEFAULT ((0)) FOR [anchoredConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_08026f84640437717dd84aec342]  DEFAULT ((0)) FOR [maneuverConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_eb1219e341d107241ce77fae7e1]  DEFAULT ((0)) FOR [otherConsumptionIFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_8ab4f8ba558de0c14731e2d454e]  DEFAULT ((1)) FOR [isDisplayLSFOConsumption]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_0a07e0fb3792203acd2755b304e]  DEFAULT ((1)) FOR [isDisplayMGOConsumption]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_b734ed4a84ebcca375183a07b37]  DEFAULT ((1)) FOR [isDisplayAverageSpeed]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_de79132f3ef8d8c9f586a2475b5]  DEFAULT ((1)) FOR [isDisplayDataMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_9f18d3c1eda86ffa34565a6fa3b]  DEFAULT ((1)) FOR [isDisplayDataLSFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_726758d898cabb4edefa5ff96f2]  DEFAULT ((1)) FOR [isDisplayVesselPerformanceLSFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_a94ee120491c05f3d02053ee60a]  DEFAULT ((1)) FOR [isDisplayVesselPerformanceMGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_d223e5fa598dd9f38700090f0af]  DEFAULT ((0)) FOR [consumptionEquipmentME_MGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_dc54fc65b994512642cd8cb60d0]  DEFAULT ((0)) FOR [consumptionEquipmentAE_MGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_493d331d5de1513f96cfc45110e]  DEFAULT ((0)) FOR [consumptionEquipmentBOILER_MGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_94b3b689bd421a0743a75ce6a52]  DEFAULT ((0)) FOR [consumptionEquipmentIG_MGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_27a58238dca378ea23ba49f336b]  DEFAULT ((0)) FOR [consumptionEquipmentPP_MGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_01029f9e0a79143ba56a23f1bc3]  DEFAULT ((0)) FOR [consumptionEquipmentOther_MGO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_dc884948a5a46a62a8a3f89f5a7]  DEFAULT ((0)) FOR [consumptionEquipmentME_IFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_f5d761af2065248412d687d027c]  DEFAULT ((0)) FOR [consumptionEquipmentAE_IFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_9b74e45fce55d498bf804977d5d]  DEFAULT ((0)) FOR [consumptionEquipmentBOILER_IFO]
GO

ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_02e7a96dcea13e7b0b4cb79e74d]  DEFAULT ((0)) FOR [consumptionEquipmentOther_IFO]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[send_message_entity]    Script Date: 1/22/2025 6:25:37 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[send_message_entity](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NOT NULL,
	[emails] [nvarchar](255) NOT NULL,
	[typeSend] [nvarchar](255) NOT NULL,
	[html] [varchar](2000) NOT NULL,
	[sendAutomatic] [bit] NOT NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_35ba64eb8e0fd8442fa1662119c] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[send_message_entity] ADD  CONSTRAINT [DF_282a52fbf564f0a76f0068a2a54]  DEFAULT ((1)) FOR [sendAutomatic]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[port]    Script Date: 1/22/2025 6:25:25 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[port](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NOT NULL,
	[voyageId] [int] NOT NULL,
	[portNumber] [int] NOT NULL,
	[departurePort] [nvarchar](255) NOT NULL,
	[arrivalPort] [nvarchar](255) NOT NULL,
	[startDate] [nvarchar](255) NULL,
	[startIFO] [decimal](18, 8) NULL,
	[startMGO] [decimal](18, 8) NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_78381adf2d2b42b2d4e4db5ffc0] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[port] ADD  CONSTRAINT [DF_5c1f7f45e47b9efae84fd807189]  DEFAULT ((0)) FOR [startIFO]
GO

ALTER TABLE [dbo].[port] ADD  CONSTRAINT [DF_840bef3d19a16475370c2ce1b4a]  DEFAULT ((0)) FOR [startMGO]
GO

ALTER TABLE [dbo].[port]  WITH CHECK ADD  CONSTRAINT [FK_402d85bee7520d7094b43837e04] FOREIGN KEY([voyageId])
REFERENCES [dbo].[voyage] ([id])
GO

ALTER TABLE [dbo].[port] CHECK CONSTRAINT [FK_402d85bee7520d7094b43837e04]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[oilPriceHistory]    Script Date: 1/22/2025 6:25:07 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[oilPriceHistory](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[entityOilId] [int] NULL,
	[price] [decimal](18, 8) NULL,
	[typeCurrency] [nvarchar](255) NULL,
	[effectiveDate] [nvarchar](255) NOT NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_5badb256052b620e8f12e8aa0c9] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[oilPriceHistory] ADD  CONSTRAINT [DF_e517c2c0f218b7947c7e3fac2af]  DEFAULT ((0)) FOR [price]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[oilAnalysis]    Script Date: 1/22/2025 6:24:54 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[oilAnalysis](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[equipmentOilCompatibilityId] [int] NOT NULL,
	[fileId] [int] NOT NULL,
	[analysisDate] [timestamp] NOT NULL,
	[comments] [nvarchar](255) NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_5f6ac2af437cb93b9254ca06f0d] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[oil]    Script Date: 1/22/2025 6:17:38 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[oil](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[name] [nvarchar](255) NOT NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_7687c431233413581eb1c765504] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[groupOil]    Script Date: 1/22/2025 6:17:24 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[groupOil](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[label] [nvarchar](255) NOT NULL,
	[description] [nvarchar](255) NULL,
	[groupId] [int] NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_9eff0ab65d12bd3ad4744be66de] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[groupOil] ADD  CONSTRAINT [DF_ec568593a55ec9d7367b0ea1170]  DEFAULT ((0)) FOR [description]
GO

ALTER TABLE [dbo].[groupOil] ADD  CONSTRAINT [DF_d4ed89034cb1a7b442ef6e40332]  DEFAULT ((0)) FOR [groupId]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[file]    Script Date: 1/22/2025 6:17:11 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[file](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[fileName] [nvarchar](255) NOT NULL,
	[filePath] [nvarchar](255) NOT NULL,
	[fileType] [varchar](50) NOT NULL,
	[fileSize] [int] NOT NULL,
	[description] [nvarchar](255) NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_36b46d232307066b3a2c9ea3a1d] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[equipmentSystem]    Script Date: 1/22/2025 6:16:51 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[equipmentSystem](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[equipment] [nvarchar](255) NOT NULL,
	[trialDay] [decimal](18, 8) NOT NULL,
	[lubUsedDuringMaintenance] [decimal](18, 8) NOT NULL,
	[ETM_OilAnalysis_Oid] [nvarchar](255) NULL,
	[frequencyId] [int] NULL,
	[entityGroupId] [int] NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_9b52f2fca36638ad5fb5ee22b35] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[equipmentSystem] ADD  CONSTRAINT [DF_b1e53e5127bf3ff0b1f8a65e8de]  DEFAULT ((0)) FOR [trialDay]
GO

ALTER TABLE [dbo].[equipmentSystem] ADD  CONSTRAINT [DF_fe013688319e5205b6c6e70e1b5]  DEFAULT ((0)) FOR [lubUsedDuringMaintenance]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[equipmentOilCompatibility]    Script Date: 1/22/2025 6:16:38 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[equipmentOilCompatibility](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[entityEquipmentId] [int] NULL,
	[entityOilId] [int] NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_cb071fdc7a66141b0a81973a7aa] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[daily_report]    Script Date: 1/22/2025 6:16:27 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[daily_report](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NOT NULL,
	[portId] [int] NOT NULL,
	[north_degree] [decimal](18, 8) NULL,
	[north_minutes] [decimal](18, 8) NULL,
	[north_north_south] [nvarchar](255) NULL,
	[east_degree] [decimal](18, 8) NULL,
	[east_minutes] [decimal](18, 8) NULL,
	[east_east_west] [nvarchar](255) NULL,
	[activityPerformed] [nvarchar](255) NOT NULL,
	[typeActivityPerformed] [nvarchar](255) NULL,
	[speedStraction] [nvarchar](255) NOT NULL,
	[date] [nvarchar](255) NOT NULL,
	[hour] [nvarchar](255) NOT NULL,
	[bunkeringIfo] [decimal](18, 8) NOT NULL,
	[bunkeringMgo] [decimal](18, 8) NOT NULL,
	[mplaIfo] [decimal](18, 8) NOT NULL,
	[auxIfo] [decimal](18, 8) NOT NULL,
	[boilerIfo] [decimal](18, 8) NOT NULL,
	[otherIfo] [decimal](18, 8) NOT NULL,
	[mplaMgo] [decimal](18, 8) NOT NULL,
	[auxMgo] [decimal](18, 8) NOT NULL,
	[boilerMgo] [decimal](18, 8) NOT NULL,
	[ppMgo] [decimal](18, 8) NOT NULL,
	[giMgo] [decimal](18, 8) NOT NULL,
	[otherMgo] [decimal](18, 8) NOT NULL,
	[steamingTime] [decimal](18, 8) NOT NULL,
	[distance] [decimal](18, 8) NOT NULL,
	[beaufour] [nvarchar](255) NOT NULL,
	[observation] [nvarchar](255) NOT NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_6f51b9eb292151755dc3ade12b1] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_8fb26e3337e0a3d6677438aba3d]  DEFAULT ('') FOR [north_degree]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_a0c2a3d56ec5c3e16bd9bf899ad]  DEFAULT ('') FOR [north_minutes]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_dbf63e01e3244de73e5973e6193]  DEFAULT ('') FOR [north_north_south]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_e2fd64abd14efeac78197882b91]  DEFAULT ('') FOR [east_degree]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_bf049053b5d1c026ac205cc2fc3]  DEFAULT ('') FOR [east_minutes]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_2b05c1f88d6165f574a1346fad7]  DEFAULT ('') FOR [east_east_west]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_def8defcdf4039c873f81b1c354]  DEFAULT ('Otros') FOR [activityPerformed]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_051a04bd4b1c4d7a4f33cef8cf1]  DEFAULT ('') FOR [typeActivityPerformed]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_780399c8273f0626bbf08ab5283]  DEFAULT ('') FOR [speedStraction]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_55706eadec3881e382f23381a7d]  DEFAULT ((0)) FOR [bunkeringIfo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_a5a371e658ce00c63f1ed941a78]  DEFAULT ((0)) FOR [bunkeringMgo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_27c4ee3ef225175c81e165b242c]  DEFAULT ((0)) FOR [mplaIfo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_9da8b71ceabd67189e015c8ef6c]  DEFAULT ((0)) FOR [auxIfo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_e25958f65401ee8b88ffc9e07dc]  DEFAULT ((0)) FOR [boilerIfo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_cda266818c77fa0f592c40649b4]  DEFAULT ((0)) FOR [otherIfo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_5f7982c99eddd7fcf6339bb556b]  DEFAULT ((0)) FOR [mplaMgo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_e9d73c045f0295ee76873f7d739]  DEFAULT ((0)) FOR [auxMgo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_c7f5b4a503644d2251fff560821]  DEFAULT ((0)) FOR [boilerMgo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_187fe04655cfd735725181ed7a0]  DEFAULT ((0)) FOR [ppMgo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_14c10129464192a10b61541cb25]  DEFAULT ((0)) FOR [giMgo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_bdc0f95308f8246727a72ed12f4]  DEFAULT ((0)) FOR [otherMgo]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_f21e0395b06c5b9728aa7b59fed]  DEFAULT ((0)) FOR [steamingTime]
GO

ALTER TABLE [dbo].[daily_report] ADD  CONSTRAINT [DF_1d5dcce837bbc1223232a784431]  DEFAULT ((0)) FOR [distance]
GO

ALTER TABLE [dbo].[daily_report]  WITH CHECK ADD  CONSTRAINT [FK_9d97ff9f8ad46260c8a8ea90e36] FOREIGN KEY([portId])
REFERENCES [dbo].[port] ([id])
GO

ALTER TABLE [dbo].[daily_report] CHECK CONSTRAINT [FK_9d97ff9f8ad46260c8a8ea90e36]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[consumptionEquipment]    Script Date: 1/22/2025 6:16:15 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[consumptionEquipment](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[date] [nvarchar](255) NOT NULL,
	[amount] [decimal](18, 8) NOT NULL,
	[hourConsumption] [decimal](18, 8) NOT NULL,
	[observation] [nvarchar](255) NULL,
	[entityEquipmentOilCompatibilityId] [int] NOT NULL,
	[consumptionTypeId] [int] NOT NULL,
	[entityOilAnalysisId] [int] NOT NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_c93191304b9e3efce6db13ff167] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[consumptionEquipment] ADD  CONSTRAINT [DF_1532b4e39cd34b7ed8cbc0f8f9c]  DEFAULT ((0)) FOR [amount]
GO

ALTER TABLE [dbo].[consumptionEquipment] ADD  CONSTRAINT [DF_2ff2f256a9487b18dc2f26e813e]  DEFAULT ((0)) FOR [hourConsumption]
GO

ALTER TABLE [dbo].[consumptionEquipment] ADD  CONSTRAINT [DF_dbcf06bb9a539335a24a912e67e]  DEFAULT ((0)) FOR [entityEquipmentOilCompatibilityId]
GO

ALTER TABLE [dbo].[consumptionEquipment] ADD  CONSTRAINT [DF_bfd371f22a271b7a633de5ee80c]  DEFAULT ((0)) FOR [consumptionTypeId]
GO

ALTER TABLE [dbo].[consumptionEquipment] ADD  CONSTRAINT [DF_e52f27983a8875fb0faaf92f989]  DEFAULT ((0)) FOR [entityOilAnalysisId]
GO


USE [FuelOilPlatformDBTest]
GO

/****** Object:  Table [dbo].[bunkerOil]    Script Date: 1/22/2025 6:15:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[bunkerOil](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[entityOilId] [int] NULL,
	[bunker] [decimal](18, 8) NOT NULL,
	[comment] [nvarchar](255) NULL,
	[datetime] [nvarchar](255) NOT NULL,
	[userIdCreated] [int] NOT NULL,
	[dateCreated] [nvarchar](255) NOT NULL,
	[userIdUpdated] [int] NULL,
	[dateUpdated] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
 CONSTRAINT [PK_e3d084bdca960bb7fc3685b612e] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[bunkerOil] ADD  CONSTRAINT [DF_28dbfa40be4b90b3d85ed1cc426]  DEFAULT ((0)) FOR [bunker]
GO


