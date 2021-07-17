import { string } from "mathjs";

export class SummaryVesselPerformanceReport {

    constructor(
        // ruta del Logo transgas
        public logoTransgas?: string,
        public titleDocument?: string,
        public preparedFor?: string,
        public totalVoyageSailing?:number,
        public totalPortSailing?:number,
        public totalDistanceBallast?:number,
        public totalDistanceLaden?:number,
        public atdAndAta?:string,
        public dateStart?: string,
        public dateEnd?: string,
        
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
    }

}
  