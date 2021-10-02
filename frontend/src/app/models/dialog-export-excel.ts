
export class GetReportVoyagePortDaily {


    constructor(
        public userId?: number,
        public year?: number,
        public voyageId?: number,
        public voyageNumber?: number,
        public portId?: number,
        public portNumber?: number,
        public departurePort?: string,
        public arrivalPort?: string,

        public dailyReportId?: number,
        // Fecha de registro
        public date?: Date,
        // Hora
        public hour?: string,
        // Tempo transcurrido
        public steamingTime?: number,

        // Actividades realizada
        public activityPerformed?: string,
        //  SpeedStraction ECO_SPEED | FULL_SPEED
        public speedStraction?: string,
        // Observaciones
        public observation?: string,

        public distance?:number,
        // beaufour
        public beaufour?: string,

        // Consumo mplaIfo
        public mplaIfo?: number,
        // Consumo auxIfo
        public auxIfo?: number,
        // consumo boilerIfo
        public boilerIfo?: number,
        // Otros consumos Ifo
        public otherIfo?: number,
        // Recarga de IFO
        public bunkeringIfo?: number,

        // Consumo mplaMgo
        public mplaMgo?: number,
        // Consumo auxMgo
        public auxMgo?: number,
        // Consumo boilerMgo
        public boilerMgo?: number,
        // Consumo ppMgo
        public ppMgo?: number,
        // Consumo giMgo
        public giMgo?: number,
        // Consumo otherMgo
        public otherMgo?: number,
        // Recarga de MGO
        public bunkeringMgo?: number,
    ) {
        this.userId = userId || 0;
        this.year = year || 0;
        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;
        this.portId = portId || 0;
        this.portNumber = portNumber || 0;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';

        this.dailyReportId = dailyReportId || 0;
        this.date = date || null;
        this.hour = hour || '';
        this.steamingTime = steamingTime || 0;

        this.activityPerformed = activityPerformed || '';
        this.speedStraction = speedStraction || '';
        this.observation = observation || '';

        this.distance = distance || 0;
        this.beaufour = beaufour || '';

        // Consumo IFO
        this.mplaIfo = mplaIfo || 0;
        this.auxIfo = auxIfo || 0;
        this.boilerIfo = boilerIfo || 0;
        this.otherIfo = otherIfo || 0;
        this.bunkeringIfo = bunkeringIfo || 0;
        
        // Consumo MGO
        this.mplaMgo = mplaMgo || 0;
        this.auxMgo = auxMgo || 0;
        this.boilerMgo = boilerMgo || 0;
        this.ppMgo = ppMgo || 0;
        this.giMgo = giMgo || 0;
        this.otherMgo = otherMgo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;

    }


}