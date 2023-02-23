
// Esto se debe corregir o sustituir por GetReportVoyagePortDaily2
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
        public startDate?: Date,
        public startIFO?: number,
        public startMGO?: number,
        

        public dailyReportId?: number,
        // Fecha de registro
        public date?: Date,
        // Hora
        public hour?: string,
        // Tempo transcurrido
        public steamingTime?: number,

        // Actividades realizada
        public activityPerformed?: string,
        public typeActivityPerformed?: string,
        
        //  SpeedStraction ECO_SPEED | FULL_SPEED
        public speedStraction?: string,
        // Observaciones
        public observation?: string,

        public distance?: number,
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


        public syncStatusDaily?: string,
        public statusDaily?: boolean,
        public syncStatusPort?: string,
        public statusPort?: boolean,
        public syncStatusVoyage?: string,
        public statusVoyage?: boolean,


        
        // ULTIMOS CAMPOS DE UBICACION
        public north_degree?: number,
        public north_minutes?: number,
        public north_north_south?: String,
        public east_degree?: number,
        public east_minutes?: number,
        public east_east_west?: String,

    ) {
        this.userId = userId || 0;
        this.year = year || 0;
        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;

        this.portId = portId || 0;
        this.portNumber = portNumber || 0;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';
        this.startDate = startDate || null;
        this.startIFO = startIFO ||0;
        this.startMGO = startMGO || 0;
        

        this.dailyReportId = dailyReportId || 0;
        this.date = date || null;
        this.hour = hour || '';
        this.steamingTime = steamingTime || 0;

        this.activityPerformed = activityPerformed || '';
        this.typeActivityPerformed = typeActivityPerformed || '';
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

        this.syncStatusDaily = syncStatusDaily || '';
        this.statusDaily = statusDaily || false;
        this.syncStatusPort = syncStatusPort || '';
        this.statusPort = statusDaily || false;
        this.syncStatusVoyage = syncStatusVoyage || '';
        this.statusVoyage = statusVoyage || false;


        // ULTIMOS CAMPOS
        this.north_degree = north_degree || 0;
        this.north_minutes = north_minutes || 0;
        this.north_north_south = north_north_south || '';
        this.east_degree = east_degree || 0;
        this.east_minutes = east_minutes || 0;
        this.east_east_west = east_east_west || '';
    }

    
    // variables que contien la suma.
    countReports: number;
    countPorts: number;
    dayStart: string;
    dayEnd: string;
}


export class GetReportVoyagePortDaily2 {


    constructor(
        public userId?: number,

        // Datos del viaje
        public voyageId?: number,
        public voyageNumber?: number,
        public year?: number,
        
        public portId?: number,
        public portNumber?: number,
        public departurePort?: string,
        public arrivalPort?: string,
        public startDate?: Date,
        public startIFO?: number,
        public startMGO?: number,
        

        public dailyReportId?: number,
        // Fecha de registro
        public date?: Date,
        // Hora
        public hour?: string,
        // Tempo transcurrido
        public steamingTime?: number,

        // Actividades realizada
        public activityPerformed?: string,
        public typeActivityPerformed?: string,
        //  SpeedStraction ECO_SPEED | FULL_SPEED
        public speedStraction?: string,
        // Observaciones
        public observation?: string,

        public distance?: number,
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


        public syncStatusDaily?: string,
        public statusDaily?: boolean,
        public syncStatusPort?: string,
        public statusPort?: boolean,
        public syncStatusVoyage?: string,
        public statusVoyage?: boolean,


        
        // ULTIMOS CAMPOS DE UBICACION
        public north_degree?: number,
        public north_minutes?: number,
        public north_north_south?: String,
        public east_degree?: number,
        public east_minutes?: number,
        public east_east_west?: String,

    ) {
        this.userId = userId || 0;
        this.year = year || 0;
        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;
        this.portId = portId || 0;
        this.portNumber = portNumber || 0;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';
        this.startDate =  startDate || null,
        this.startIFO = startIFO || 0;
        this.startMGO = startMGO || 0;

        this.dailyReportId = dailyReportId || 0;
        this.date = date || null;
        this.hour = hour || '';
        this.steamingTime = steamingTime || 0;

        this.activityPerformed = activityPerformed || '';
        this.typeActivityPerformed = typeActivityPerformed || '';
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

        this.syncStatusDaily = syncStatusDaily || '';
        this.statusDaily = statusDaily || false;
        this.syncStatusPort = syncStatusPort || '';
        this.statusPort = statusDaily || false;
        this.syncStatusVoyage = syncStatusVoyage || '';
        this.statusVoyage = statusVoyage || false;


        // ULTIMOS CAMPOS
        this.north_degree = north_degree || 0;
        this.north_minutes = north_minutes || 0;
        this.north_north_south = north_north_south || '';
        this.east_degree = east_degree || 0;
        this.east_minutes = east_minutes || 0;
        this.east_east_west = east_east_west || '';
    }

    
    // variables que contien la suma.
    countReports: number;
    countPorts: number;
    dayStart: string;
    dayEnd: string;
}