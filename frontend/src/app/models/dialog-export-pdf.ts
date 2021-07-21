import { string } from "mathjs";

export class SummaryVesselPerformanceReport {

    constructor(
        // ruta del Logo transgas
        public logoTransgas?: string,
        public titleDocument?: string,
        public preparedFor?: string,
        public totalVoyageSailing?: number,
        public lastVoyageSailing?: number,
        public totalPortSailing?: number,
        public totalDistanceBallast?: number,
        public totalDistanceLaden?: number,
        public atdAndAta?: string,
        public dateStart?: string,
        public dateEnd?: string,
        public listSummarySpeedCondition?: SummarySpeedCondition[],
    ) {
        this.logoTransgas = logoTransgas || '';
        this.titleDocument = titleDocument || '';
        this.preparedFor = preparedFor || '';
        this.totalVoyageSailing = totalVoyageSailing || 0;
        this.lastVoyageSailing = lastVoyageSailing || 0;
        this.totalPortSailing = totalPortSailing || 0;
        this.totalDistanceBallast = totalDistanceBallast || 0;
        this.totalDistanceLaden = totalDistanceLaden || 0;
        this.atdAndAta = atdAndAta || '';
        this.dateStart = dateStart || '';
        this.dateEnd = dateEnd || '';
        this.listSummarySpeedCondition = listSummarySpeedCondition || [];
    }

}


// Estructura del resumen de speed por
export class SummarySpeedCondition {

    constructor(
        public departureToArrival?: string,
        public condition?: string,
        public distanceIFO?: number,
        public distanceMGO?: number,
        public timeIFO?: number,
        public timeMGO?: number,
        public speedIFO?: number,
        public speedMGO?: number,
    ) {
        this.departureToArrival = departureToArrival || '';
        this.condition = condition || '';
        this.distanceIFO = distanceIFO || 0;
        this.distanceMGO = distanceMGO || 0;
        this.timeIFO = timeIFO || 0;
        this.timeMGO = timeMGO || 0;
        this.speedIFO = speedIFO || 0;
        this.speedMGO = speedMGO || 0;
    }

}

export class GenerateSummaryTableOverallPerformanceAnalisis {
    constructor(
        public title?: string,
        public puertos?: string,
        public dateStart?: string,
        public dateEnd?: string,

        public numberVoyage?: number,
        public totalPort?: number,

        // Distance Laden
        public distanceLadenIFO?: number,
        public distanceLadenMGO?: number,
        public distanceCharterLadenIFO?: number,
        public distanceCharterLadenMGO?: number,
        //Distande ballast 
        public distanceBallastIFO?: number,
        public distanceBallastMGO?: number,
        public distanceCharterBallastIFO?: number,
        public distanceCharterBallastMGO?: number,

        // Time Laden
        public timeLadenIFO?: number,
        public timeLadenMGO?: number,
        public timeCharterLadenIFO?: number,
        public timeCharterLadenMGO?: number,
        // Time Ballast
        public timeBallastIFO?: number,
        public timeBallastMGO?: number,
        public timeCharterBallastIFO?: number,
        public timeCharterBallastMGO?: number,

        // Consumption Laden
        public consumptionLadenIFO?: number,
        public consumptionLadenMGO?: number,
        public consumptionCharterLadenIFO?: number,
        public consumptionCharterLadenMGO?: number,
        // Consumption Ballast
        public consumptionBallastIFO?: number,
        public consumptionBallastMGO?: number,
        public consumptionCharterBallastIFO?: number,
        public consumptionCharterBallastMGO?: number,

        // Daily Consumption Laden
        public dailyConsumptionLadenIFO?: number,
        public dailyConsumptionLadenMGO?: number,
        public dailyConsumptionCharterLadenIFO?: number,
        public dailyConsumptionCharterLadenMGO?: number,
        // Daily Consumption Ballast
        public dailyConsumptionBallastIFO?: number,
        public dailyConsumptionBallastMGO?: number,
        public dailyConsumptionCharterBallastIFO?: number,
        public dailyConsumptionCharterBallastMGO?: number,

        // Speed Laden
        public speedLadenIFO?: number,
        public speedLadenMGO?: number,
        public speedCharterLadenIFO?: number,
        public speedCharterLadenMGO?: number,
        // Speed Ballast
        public speedBallastIFO?: number,
        public speedBallastMGO?: number,
        public speedCharterBallastIFO?: number,
        public speedCharterBallastMGO?: number,

    ) {
        this.title = title || '';
        this.puertos = puertos || '';
        this.dateStart = dateStart || '';
        this.dateEnd = dateEnd || '';

        this.numberVoyage = numberVoyage || 0;
        this.totalPort = totalPort || 0;

        // Distance Laden
        this.distanceLadenIFO = distanceLadenIFO || 0;
        this.distanceLadenMGO = distanceLadenMGO || 0;
        this.distanceCharterLadenIFO = distanceCharterLadenIFO || 0;
        this.distanceCharterLadenMGO = distanceCharterLadenMGO || 0;
        //Distande ballast 
        this.distanceBallastIFO = distanceBallastIFO || 0;
        this.distanceBallastMGO = distanceBallastMGO || 0;
        this.distanceCharterBallastIFO = distanceCharterBallastIFO || 0;
        this.distanceCharterBallastMGO = distanceCharterBallastMGO || 0;

        // Time Laden
        this.timeLadenIFO = timeLadenIFO || 0;
        this.timeLadenMGO = timeLadenMGO || 0;
        this.timeCharterLadenIFO = timeCharterLadenIFO || 0;
        this.timeCharterLadenMGO = timeCharterLadenMGO || 0;
        // Time Ballast
        this.timeBallastIFO = timeBallastIFO || 0;
        this.timeBallastMGO = timeBallastMGO || 0;
        this.timeCharterBallastIFO = timeCharterBallastIFO || 0;
        this.timeCharterBallastMGO = timeCharterBallastMGO || 0;

        // Consumption Laden
        this.consumptionLadenIFO = consumptionLadenIFO || 0;
        this.consumptionLadenMGO = consumptionLadenMGO || 0;
        this.consumptionCharterLadenIFO = consumptionCharterLadenIFO || 0;
        this.consumptionCharterLadenMGO = consumptionCharterLadenMGO || 0;
        // Consumption Ballast
        this.consumptionBallastIFO = consumptionBallastIFO || 0;
        this.consumptionBallastMGO = consumptionBallastMGO || 0;
        this.consumptionCharterBallastIFO = consumptionCharterBallastIFO || 0;
        this.consumptionCharterBallastMGO = consumptionCharterBallastMGO || 0;

        // Daily Consumption Laden
        this.dailyConsumptionLadenIFO = dailyConsumptionLadenIFO || 0;
        this.dailyConsumptionLadenMGO = dailyConsumptionLadenMGO || 0;
        this.dailyConsumptionCharterLadenIFO = dailyConsumptionCharterLadenIFO || 0;
        this.dailyConsumptionCharterLadenMGO = dailyConsumptionCharterLadenMGO || 0;
        // Daily Consumption Ballast
        this.dailyConsumptionBallastIFO = dailyConsumptionBallastIFO || 0;
        this.dailyConsumptionBallastMGO = dailyConsumptionBallastMGO || 0;
        this.dailyConsumptionCharterBallastIFO = dailyConsumptionCharterBallastIFO || 0;
        this.dailyConsumptionCharterBallastMGO = dailyConsumptionCharterBallastMGO || 0;

        // Speed Laden
        this.speedLadenIFO = speedLadenIFO || 0;
        this.speedLadenMGO = speedLadenMGO || 0;
        this.speedCharterLadenIFO = speedCharterLadenIFO || 0;
        this.speedCharterLadenMGO = speedCharterLadenMGO || 0;
        // Speed Ballast
        this.speedBallastIFO = speedBallastIFO || 0;
        this.speedBallastMGO = speedBallastMGO || 0;
        this.speedCharterBallastIFO = speedCharterBallastIFO || 0;
        this.speedCharterBallastMGO = speedCharterBallastMGO || 0;


    }
}

export class GenerateTableSummaryOverallPerformanceAnalisis {
    constructor(
        public voyageId?: number,
        public voyageNumber?: number,
        public distanceIFO?: number,
        public distanceMGO?: number,
        // Consumo
        public consumptionIFO?: number,
        public consumptionMGO?: number,
        public consumptionIFOCharter?: number,
        public consumptionMGOCharter?: number,
        // time
        public timeIFO?: number,
        public timeMGO?: number,
        public timeIFOCharter?: number,
        public timeMGOCharter?: number,
        // speed
        public speedIFO?: number,
        public speedMGO?: number,
        public speedIFOCharter?: number,
        public speedMGOCharter?: number,
        // Daily Consumption
        public dailyConsumptionIFO?: number,
        public dailyConsumptionMGO?: number,
        // Daily Consumption Charter
        public dailyConsumptionCharterIFO?: number,
        public dailyConsumptionCharterMGO?: number,
    ) {

        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;
        this.distanceIFO = distanceIFO || 0;
        this.distanceMGO = distanceMGO || 0;
        // Consumo
        this.consumptionIFO = consumptionIFO || 0;
        this.consumptionMGO = consumptionMGO || 0;
        this.consumptionIFOCharter = consumptionIFOCharter || 0;
        this.consumptionMGOCharter = consumptionMGOCharter || 0;
        // time
        this.timeIFO = timeIFO || 0;
        this.timeMGO = timeMGO || 0;
        this.timeIFOCharter = timeIFOCharter || 0;
        this.timeMGOCharter = timeMGOCharter || 0;

        // speed
        this.speedIFO = speedIFO || 0;
        this.speedMGO = speedMGO || 0;
        this.speedIFOCharter = speedIFOCharter || 0;
        this.speedMGOCharter = speedMGOCharter || 0;


        // Daily Consumption
        this.dailyConsumptionIFO = dailyConsumptionIFO || 0;
        this.dailyConsumptionMGO = dailyConsumptionMGO || 0;

        // Daily Consumption Charter
        this.dailyConsumptionCharterIFO = dailyConsumptionCharterIFO || 0;
        this.dailyConsumptionCharterMGO = dailyConsumptionCharterMGO || 0;
    }

}

export class GenerateTableTotalSummaryOverallPerformanceAnalisis {

    constructor(
        //Distance
        public distanceIFOLaden?: number,
        public distanceMGOLaden?: number,
        public distanceIFOBallast?: number,
        public distanceMGOBallast?: number,
        // Time
        public timeIFOLaden?: number,
        public timeMGOLaden?: number,
        public timeIFOBallast?: number,
        public timeMGOBallast?: number,
        // Time Charter
        public timeCharterIFOLaden?: number,
        public timeCharterMGOLaden?: number,
        public timeCharterIFOBallast?: number,
        public timeCharterMGOBallast?: number,
        // Speed
        public speedIFOLaden?: number,
        public speedMGOLaden?: number,
        public speedIFOBallast?: number,
        public speedMGOBallast?: number,
        // Speed Charter
        public speedCharterIFOLaden?: number,
        public speedCharterMGOLaden?: number,
        public speedCharterIFOBallast?: number,
        public speedCharterMGOBallast?: number,

        // Consumo
        public consumptionIFOLaden?: number,
        public consumptionMGOLaden?: number,
        public consumptionIFOBallast?: number,
        public consumptionMGOBallast?: number,
        // Consumo Charter
        public consumptionCharterIFOLaden?: number,
        public consumptionCharterMGOLaden?: number,
        public consumptionCharterIFOBallast?: number,
        public consumptionCharterMGOBallast?: number,
        // Daily Consumo
        public dailyConsumptionIFOLaden?: number,
        public dailyConsumptionMGOLaden?: number,
        public dailyConsumptionIFOBallast?: number,
        public dailyConsumptionMGOBallast?: number,
        // Consumo Charter
        public dailyConsumptionCharterIFOLaden?: number,
        public dailyConsumptionCharterMGOLaden?: number,
        public dailyConsumptionCharterIFOBallast?: number,
        public dailyConsumptionCharterMGOBallast?: number,
        // Anotate
        public anotateTime?: string,
        public anotateConsumption?: string,
    ) {

        //Distance
        this.distanceIFOLaden = distanceIFOLaden || 0;
        this.distanceMGOLaden = distanceMGOLaden || 0;
        this.distanceIFOBallast = distanceIFOBallast || 0;
        this.distanceMGOBallast = distanceMGOBallast || 0;
        // Time
        this.timeIFOLaden = timeIFOLaden || 0;
        this.timeMGOLaden = timeMGOLaden || 0;
        this.timeIFOBallast = timeIFOBallast || 0;
        this.timeMGOBallast = timeMGOBallast || 0;
        // Time Charter
        this.timeCharterIFOLaden = timeCharterIFOLaden || 0;
        this.timeCharterMGOLaden = timeCharterMGOLaden || 0;
        this.timeCharterIFOBallast = timeCharterIFOBallast || 0;
        this.timeCharterMGOBallast = timeCharterMGOBallast || 0;
        // Speed
        this.speedIFOLaden = speedIFOLaden || 0;
        this.speedMGOLaden = speedMGOLaden || 0;
        this.speedIFOBallast = speedIFOBallast || 0;
        this.speedMGOBallast = speedMGOBallast || 0;
        // Speed Charter
        this.speedCharterIFOLaden = speedCharterIFOLaden || 0;
        this.speedCharterMGOLaden = speedCharterMGOLaden || 0;
        this.speedCharterIFOBallast = speedCharterIFOBallast || 0;
        this.speedCharterMGOBallast = speedCharterMGOBallast || 0;

        // Consumo
        this.consumptionIFOLaden = consumptionIFOLaden || 0;
        this.consumptionMGOLaden = consumptionMGOLaden || 0;
        this.consumptionIFOBallast = consumptionIFOBallast || 0;
        this.consumptionMGOBallast = consumptionMGOBallast || 0;
        // Consumo Charter
        this.consumptionCharterIFOLaden = consumptionCharterIFOLaden || 0;
        this.consumptionCharterMGOLaden = consumptionCharterMGOLaden || 0;
        this.consumptionCharterIFOBallast = consumptionCharterIFOBallast || 0;
        this.consumptionCharterMGOBallast = consumptionCharterMGOBallast || 0;
        // Daily Consumo
        this.dailyConsumptionIFOLaden = dailyConsumptionIFOLaden || 0;
        this.dailyConsumptionMGOLaden = dailyConsumptionMGOLaden || 0;
        this.dailyConsumptionIFOBallast = dailyConsumptionIFOBallast || 0;
        this.dailyConsumptionMGOBallast = dailyConsumptionMGOBallast || 0;
        // Consumo Charter
        this.dailyConsumptionCharterIFOLaden = dailyConsumptionCharterIFOLaden || 0;
        this.dailyConsumptionCharterMGOLaden = dailyConsumptionCharterMGOLaden || 0;
        this.dailyConsumptionCharterIFOBallast = dailyConsumptionCharterIFOBallast || 0;
        this.dailyConsumptionCharterMGOBallast = dailyConsumptionCharterMGOBallast || 0;
        // Anotate
        this.anotateTime = anotateTime || '';
        this.anotateConsumption = anotateConsumption || '';
    }
}