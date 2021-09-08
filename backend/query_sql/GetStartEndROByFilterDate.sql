-- Buscamos con cuanto de combustible estamos inciando.
SELECT 
    SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) AS 'total_ifo',
    SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) AS 'total_mgo',
    SUM( daily_report.bunkeringIfo ) AS 'total_bunkering_ifo',
    SUM( daily_report.bunkeringMgo ) AS 'total_bunkering_mgo'
FROM daily_report AS 'daily_report'
    INNER JOIN port AS 'port'
        ON daily_report.portId = port.id    
    INNER JOIN voyage AS 'voyage'
        ON port.voyageId = voyage.id
WHERE 
    daily_report.status = 1
    AND port.status = 1
    AND voyage.status = 1   
    AND daily_report.userId = 2
    AND datetime(daily_report.date) <= datetime('2021-09-01T05:00:00.000Z');
    


-- Buscamos cuanto de combustible y bunkering hemos hecho en el rago de fecha.
SELECT 
    SUM( daily_report.mplaIfo + daily_report.auxIfo + daily_report.boilerIfo + daily_report.otherIfo ) AS 'total_ifo',
    SUM( daily_report.mplaMgo + daily_report.auxMgo + daily_report.boilerMgo + daily_report.ppMgo + daily_report.giMgo + daily_report.otherMgo ) AS 'total_mgo',
    SUM( daily_report.bunkeringIfo ) AS 'total_bunkering_ifo',
    SUM( daily_report.bunkeringMgo ) AS 'total_bunkering_mgo'
FROM daily_report AS 'daily_report'
    INNER JOIN port AS 'port'
        ON daily_report.portId = port.id    
    INNER JOIN voyage AS 'voyage'
        ON port.voyageId = voyage.id
WHERE 
    daily_report.status = 1
    AND port.status = 1
    AND voyage.status = 1   
    AND daily_report.userId = 2
    AND datetime(daily_report.date) > datetime('2021-09-01T05:00:00.000Z')
    AND datetime(daily_report.date) <= datetime('2021-09-02T04:32:00.000Z')
    