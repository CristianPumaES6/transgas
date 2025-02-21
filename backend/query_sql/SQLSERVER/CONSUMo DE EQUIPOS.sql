DECLARE @startDate DATE = '2025-01-01';
DECLARE @endDate DATE = '2025-02-28';
DECLARE @userId INT = 7;

WITH OilList AS (
    SELECT 
        EOC.entityEquipmentId,
        STUFF((
            SELECT DISTINCT ', ' + O.name
            FROM equipmentOilCompatibility EOC2
            INNER JOIN oil O ON EOC2.entityOilId = O.id
            WHERE EOC2.entityEquipmentId = EOC.entityEquipmentId
            FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 
        1, 2, ''
        ) AS oilsUsed
    FROM equipmentOilCompatibility EOC
    GROUP BY EOC.entityEquipmentId
)

SELECT 
    ES.id AS equipmentId,
    ES.equipment AS equipmentName,
    COALESCE(OilList.oilsUsed, 'N/A') AS oilsUsed, -- Aceites concatenados
    SUM(CE.amount) AS totalConsumption,
    SUM(CE.hourConsumption) AS totalHoursWorked
FROM consumptionEquipment CE
INNER JOIN equipmentOilCompatibility EOC ON CE.entityEquipmentOilCompatibilityId = EOC.id
INNER JOIN equipmentSystem ES ON EOC.entityEquipmentId = ES.id
LEFT JOIN OilList ON ES.id = OilList.entityEquipmentId
WHERE CE.date BETWEEN @startDate AND @endDate
GROUP BY ES.id, ES.equipment, OilList.oilsUsed
ORDER BY ES.equipment;
