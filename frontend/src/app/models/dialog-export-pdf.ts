import { string } from "mathjs";

export class SummaryVesselPerformanceReport {

    constructor(
        // ruta del Logo transgas
        public logoTransgas?: string,
        public titleDocument?: string,
        public preparedFor?: string,
        public totalVoyageSailing?: number,
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