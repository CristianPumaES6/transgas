-- consultar todas las tablas
select * from [dbo].[bunkerOil];
select * from [dbo].[consumptionEquipment];
select * from [dbo].[equipmentOilCompatibility];
select * from [dbo].[equipmentSystem];
select * from [dbo].[groupOil];
select * from [dbo].[oil];
select * from [dbo].[daily_report];
select * from [dbo].[oilPriceHistory];
select * from [dbo].[port];
select * from [dbo].[send_message_entity];
select * from [dbo].[user];
select * from [dbo].[voyage];



DELETE FROM [dbo].[daily_report]; 
DELETE FROM [dbo].[port];  
DELETE FROM [dbo].[voyage]; 

DELETE FROM [dbo].[oilPriceHistory];
DELETE FROM [dbo].[equipmentOilCompatibility]; 
DELETE FROM [dbo].[equipmentSystem];
DELETE FROM [dbo].[file];
DELETE FROM [dbo].[groupOil];
DELETE FROM [dbo].[oil];
DELETE FROM [dbo].[oilAnalysis];
DELETE FROM [dbo].[groupOil];
DELETE FROM [dbo].[bunkerOil];
DELETE FROM [dbo].[send_message_entity];


-- BORRAR TABLAS
DROP TABLE [dbo].[groupOil];
DROP TABLE [dbo].[bunkerOil];
DROP TABLE [dbo].[daily_report];
DROP TABLE [dbo].[daily_report_summary]; 
DROP TABLE [dbo].[equipmentOilCompatibility]; 
DROP TABLE  [dbo].[equipmentSystem];
DROP TABLE  [dbo].[file];
DROP TABLE  [dbo].[groupOil];
DROP TABLE  [dbo].[oil];
DROP TABLE  [dbo].[oilAnalysis];
DROP TABLE [dbo].[oilPriceHistory];
DROP TABLE  [dbo].[port];
DROP TABLE [dbo].[send_message_entity];  
DROP TABLE  [dbo].[voyage]; 
DROP TABLE  [dbo].[consumptionEquipment]

