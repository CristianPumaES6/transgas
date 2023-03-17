// El DailyReport es una entidad en la BD.

// Mejora => las entidades que existen en BD, deberian llevar la palabra Entity, para saber que es una entidad, esto se deberia de aplicar a todas las entidades de BD.
export class DailyReport {

    constructor(
        // Id Detalle
        public id?: number,
        // UserId que registra el dato
        public userId?: number,
        // Puerto ID
        public portId?: number,
        // Actividades realizada
        public activityPerformed?: string,
        // TypeActivity realizada
        public typeActivityPerformed?: string,
        //  SpeedStraction ECO_SPEED | FULL_SPEED
        public speedStraction?: string,
        // Fecha de registro
        public date?: Date,
        // Hora
        public hour?: string,

        //

        public north_degree?: number,
        public north_minutes?: number,
        public north_north_south?: string,
        public east_degree?: number,
        public east_minutes?: number,
        public east_east_west?: string,


        // Recarga de IFO
        public bunkeringIfo?: number,
        // Recarga de MGO
        public bunkeringMgo?: number,


        // Consumo mplaIfo
        public mplaIfo?: number,
        // Consumo auxIfo
        public auxIfo?: number,
        // consumo boilerIfo
        public boilerIfo?: number,
        // Otros consumos Ifo
        public otherIfo?: number,

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


        // Tempo navegando
        public steamingTime?: number,
        // Distancia
        public distance?: number,
        // beaufour
        public beaufour?: string,
        // Observaciones
        public observation?: string,


        // Auditoria
        public userIdCreated?: number,
        public dateCreated?: Date,
        public userIdUpdated?: number,
        public dateUpdated?: Date,
        public status?: boolean,
        public syncStatus?: string,// none added, updated, deleted
    ) {
        this.id = id || null;
        this.userId = userId || null;
        this.portId = portId || null;
        this.activityPerformed = activityPerformed || '';
        this.typeActivityPerformed = typeActivityPerformed || '';
        this.speedStraction = speedStraction || '';
        this.date = date || null;
        this.hour = hour || '';



        this.north_degree = north_degree || 0,
            this.north_minutes = north_minutes || 0,
            this.north_north_south = north_north_south || '',
            this.east_degree = east_degree || 0,
            this.east_minutes = east_minutes || 0,
            this.east_east_west = east_east_west || '',

            this.bunkeringIfo = bunkeringIfo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;
        // Consumo IFO
        this.mplaIfo = mplaIfo || 0;
        this.auxIfo = auxIfo || 0;
        this.boilerIfo = boilerIfo || 0;
        this.otherIfo = otherIfo || 0;
        // Consumo MGO
        this.mplaMgo = mplaMgo || 0;
        this.auxMgo = auxMgo || 0;
        this.boilerMgo = boilerMgo || 0;
        this.ppMgo = ppMgo || 0;
        this.giMgo = giMgo || 0;
        this.otherMgo = otherMgo || 0;

        this.steamingTime = steamingTime || 0;
        this.distance = distance || 0;
        this.beaufour = beaufour || '';
        this.observation = observation || '';

        // Audiotoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
        this.syncStatus = '';
    }

    // estos campos se estan agregando para tener el total de consumo
    // ya no segmentado por maquina.
    public robIfo = 0;
    public robMgo = 0;
}


// En el daily report tambien podemos tener el modelo de velocida.
// el cual se obtiene mediante un calculo.
// distancia entre tiempo.
export class Speed {

    constructor(
        // userId : servira para hacer auditoria.
        public distance?: number,
        // Lugar de partida,
        public steamingTime?: number,
        // Lugar de partida,

        // MEJORA
        // Solo se agregara la distancia y tiempo si hay consumo IFO
        public distanceIFO?: number,
        public timeOperationIFO?: number,

        // Solo se agregara la distancia y tiempo si hay consumo MGO
        public distanceMGO?: number,
        public timeOperationMGO?: number,
    ) {
        this.distance = distance || 0;
        this.steamingTime = steamingTime || 0;


        this.distanceIFO = distanceIFO || 0;
        this.timeOperationIFO = timeOperationIFO || 0;


        this.distanceMGO = distanceMGO || 0;
        this.timeOperationMGO = timeOperationMGO || 0;
    }

    // funcion para agregar mas distancia y tiempo a la variable.
    public add(addDistance, addSteamingTime) {
        this.distance = this.distance + addDistance;
        this.steamingTime = this.steamingTime + addSteamingTime;
    }


    // funcion para agregar mas distancia y tiempo a la variable solo si hay consumo IFO
    public addInfoIFO(addDistanceIFO, addTimeOperationIFO) {
        this.distanceIFO = this.distanceIFO + addDistanceIFO;
        this.timeOperationIFO = this.timeOperationIFO + addTimeOperationIFO;
    }


    // funcion para agregar mas distancia y tiempo a la variable solo si hay consumo MGO
    public addInfoMGO(addDistanceMGO, addTimeOperationMGO) {
        this.distanceMGO = this.distanceMGO + addDistanceMGO;
        this.timeOperationMGO = this.timeOperationMGO + addTimeOperationMGO;
    }
}

// Estructura del servicio.
export class GetROBByUser {
    constructor(
        public total_ifo?: number,
        public total_mgo?: number,
        public total_bunkering_ifo?: number,
        public total_bunkering_mgo?: number
    ) {
        this.total_ifo = total_ifo || 0;
        this.total_mgo = total_mgo || 0;
        this.total_bunkering_ifo = total_bunkering_ifo || 0;
        this.total_bunkering_mgo = total_bunkering_mgo || 0;
    }

}

// Este objeto indica el inicio y fin del combustible.
export class InfoFuelStartEndForDate {

    constructor(
        public infoFuelStart?: GetROBByUser,
        public infoFuelEnd?: GetROBByUser
    ) {
        this.infoFuelStart = infoFuelStart || new GetROBByUser();
        this.infoFuelEnd = infoFuelEnd || new GetROBByUser();
    }
}



// Info de consumo de viaje y bunkering.
export class GetInfoVoyageROBBunkering {

    voyageId: number;
    voyageNumber: number;
    minDate: Date;
    maxDate: Date;
    totalIFO: number;
    totalMGO: number;
    listInfoBunkering: GetInfoBunkering[]


    constructor(

        voyageId?: number,
        voyageNumber?: number,
        minDate?: Date,
        maxDate?: Date,
        totalIFO?: number,
        totalMGO?: number,
        listInfoBunkering?: GetInfoBunkering[]

    ) {

        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;
        this.minDate = minDate || null;
        this.maxDate = maxDate || null;
        this.totalIFO = totalIFO || 0;
        this.totalMGO = totalMGO || 0;
        this.listInfoBunkering = listInfoBunkering || [];

    }

}


// datos de bunkering
export class GetInfoBunkering {

    portId: number;
    portNumber: number;
    portDeparture: string;
    daily_reportId: number;
    dailyReportDate: Date;
    bunkeringIfo: number;
    bunkeringMgo: number;
    observation: string;

    constructor(
        portId?: number,
        portNumber?: number,
        portDeparture?: string,
        daily_reportId?: number,
        dailyReportDate?: Date,
        bunkeringIfo?: number,
        bunkeringMgo?: number,
        observation?: string,
    ) {
        this.portId = portId || 0;
        this.portNumber = portNumber || 0;
        this.portDeparture = portDeparture || '';
        this.daily_reportId = daily_reportId || 0;
        this.dailyReportDate = dailyReportDate || null;
        this.bunkeringIfo = bunkeringIfo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;
        this.observation = observation || '';
    }
}


export class GetFormatDNV {


    constructor(
        public reportId?: number,
        public date?: String,
        public time?: String,

        public north_degree?: number,
        public north_minutes?: number,
        public north_north_south?: String,

        public east_degree?: number,
        public east_minutes?: number,
        public east_east_west?: String,

        public event?: String,

        public event_time_previous?: number,
        public event_time_sailing?: number,

        public distance?: number,

        public machinery_hfo?: number,
        public machinery_lfo?: number,
        public machinery_mgo?: number,
        public machinery_mdo?: number,
        public machinery_lpg?: number,
        public machinery_lng?: number,
        public machinery_methanol?: number,
        public machinery_ethanol?: number,
        public machinery_other_fuel_consumption?: number,
        public machinery_other_fuel_type?: number,
        public machinery_other_full_emission?: number,

        public rob_hfo?: number,
        public rob_lfo?: number,
        public rob_mgo?: number,
        public rob_mdo?: number,
        public rob_lpg?: number,
        public rob_lng?: number,
        public rob_methanol?: number,
        public rob_ethanol?: number,
        public rob_other_fuel?: number,
        public rob_other_fuel_type?: number,

    ) {
        this.reportId = reportId || 0;
        this.date = date || '';
        this.time = time || '';

        this.north_degree = north_degree || 0;
        this.north_minutes = north_minutes || 0;
        this.north_north_south = north_north_south || '';

        this.east_degree = east_degree || 0;
        this.east_minutes = east_minutes || 0;
        this.east_east_west = east_east_west || '';

        this.event = event || '';

        this.event_time_previous = event_time_previous || 0;
        this.event_time_sailing = event_time_sailing || 0;


        this.distance = distance || 0;

        this.machinery_hfo = machinery_hfo || 0;
        this.machinery_lfo = machinery_lfo || 0;
        this.machinery_mgo = machinery_mgo || 0;
        this.machinery_mdo = machinery_mdo || 0;
        this.machinery_lpg = machinery_lpg || 0;
        this.machinery_methanol = machinery_methanol || 0;
        this.machinery_ethanol = machinery_ethanol || 0;
        this.machinery_other_fuel_consumption = machinery_other_fuel_consumption || 0;
        this.machinery_other_fuel_type = machinery_other_fuel_type || 0;
        this.machinery_other_full_emission = machinery_other_full_emission || 0;


        this.rob_hfo = rob_hfo || 0;
        this.rob_lfo = rob_lfo || 0;
        this.rob_mgo = rob_mgo || 0;
        this.rob_mdo = rob_mdo || 0;
        this.rob_lpg = rob_lpg || 0;
        this.rob_lng = rob_lng || 0;
        this.rob_methanol = rob_methanol || 0;
        this.rob_ethanol = rob_ethanol || 0;
        this.rob_other_fuel = rob_other_fuel || 0;
        this.rob_other_fuel_type = rob_other_fuel_type || 0;




    }
}


export class GetFormatDNV_DCS_NOON_FULL {

    constructor(
        public reportId?: number,
        public date?: String,
        public time?: String,

        public north_degree?: number,
        public north_minutes?: number,
        public north_north_south?: String,

        public east_degree?: number,
        public east_minutes?: number,
        public east_east_west?: String,

        public event?: String,

        public event_time_previous?: number,
        public event_time_sailing?: number,

        public distance?: number,

        // MP
        public me_machinery_hfo?: number,
        public me_machinery_lfo?: number,
        public me_machinery_mgo?: number,
        public me_machinery_mdo?: number,
        public me_machinery_lpg?: number,
        public me_machinery_lng?: number,
        public me_machinery_methanol?: number,
        public me_machinery_ethanol?: number,
        public me_machinery_other_fuel_consumption?: number,
        public me_machinery_other_fuel_type?: number,
        public me_machinery_other_full_emission?: number,

        //AUX
        public aux_machinery_hfo?: number,
        public aux_machinery_lfo?: number,
        public aux_machinery_mgo?: number,
        public aux_machinery_mdo?: number,
        public aux_machinery_lpg?: number,
        public aux_machinery_lng?: number,
        public aux_machinery_methanol?: number,
        public aux_machinery_ethanol?: number,
        public aux_machinery_other_fuel_consumption?: number,
        public aux_machinery_other_fuel_type?: number,
        public aux_machinery_other_full_emission?: number,

        // Boiler
        public boiler_machinery_hfo?: number,
        public boiler_machinery_lfo?: number,
        public boiler_machinery_mgo?: number,
        public boiler_machinery_mdo?: number,
        public boiler_machinery_lpg?: number,
        public boiler_machinery_lng?: number,
        public boiler_machinery_methanol?: number,
        public boiler_machinery_ethanol?: number,
        public boiler_machinery_other_fuel_consumption?: number,
        public boiler_machinery_other_fuel_type?: number,
        public boiler_machinery_other_full_emission?: number,

        // Gas Innerte
        public gi_machinery_hfo?: number,
        public gi_machinery_lfo?: number,
        public gi_machinery_mgo?: number,
        public gi_machinery_mdo?: number,
        public gi_machinery_lpg?: number,
        public gi_machinery_lng?: number,
        public gi_machinery_methanol?: number,
        public gi_machinery_ethanol?: number,
        public gi_machinery_other_fuel_consumption?: number,
        public gi_machinery_other_fuel_type?: number,
        public gi_machinery_other_full_emission?: number,



        public ifo_other?: number,
        public mgo_pp?: number,
        public mgo_other?: number,


        /*        public machinery_hfo?: number,
                public machinery_lfo?: number,
                public machinery_mgo?: number,
                public machinery_mdo?: number,
                public machinery_lpg?: number,
                public machinery_lng?: number,
                public machinery_methanol?: number,
                public machinery_ethanol?: number,
                public machinery_other_fuel_consumption?: number,
                public machinery_other_fuel_type?: number,
                public machinery_other_full_emission?: number,
        */

        public rob_hfo?: number,
        public rob_lfo?: number,
        public rob_mgo?: number,
        public rob_mdo?: number,
        public rob_lpg?: number,
        public rob_lng?: number,
        public rob_methanol?: number,
        public rob_ethanol?: number,
        public rob_other_fuel?: number,
        public rob_other_fuel_type?: number,

    ) {
        this.reportId = reportId || 0;
        this.date = date || '';
        this.time = time || '';

        this.north_degree = north_degree || 0;
        this.north_minutes = north_minutes || 0;
        this.north_north_south = north_north_south || '';

        this.east_degree = east_degree || 0;
        this.east_minutes = east_minutes || 0;
        this.east_east_west = east_east_west || '';

        this.event = event || '';

        this.event_time_previous = event_time_previous || 0;
        this.event_time_sailing = event_time_sailing || 0;


        this.distance = distance || 0;

        this.me_machinery_hfo = me_machinery_hfo || 0;
        this.me_machinery_lfo = me_machinery_lfo || 0;
        this.me_machinery_mgo = me_machinery_mgo || 0;
        this.me_machinery_mdo = me_machinery_mdo || 0;
        this.me_machinery_lpg = me_machinery_lpg || 0;
        this.me_machinery_methanol = me_machinery_methanol || 0;
        this.me_machinery_ethanol = me_machinery_ethanol || 0;
        this.me_machinery_other_fuel_consumption = me_machinery_other_fuel_consumption || 0;
        this.me_machinery_other_fuel_type = me_machinery_other_fuel_type || 0;
        this.me_machinery_other_full_emission = me_machinery_other_full_emission || 0;


        this.aux_machinery_hfo = aux_machinery_hfo || 0;
        this.aux_machinery_lfo = aux_machinery_lfo || 0;
        this.aux_machinery_mgo = aux_machinery_mgo || 0;
        this.aux_machinery_mdo = aux_machinery_mdo || 0;
        this.aux_machinery_lpg = aux_machinery_lpg || 0;
        this.aux_machinery_methanol = aux_machinery_methanol || 0;
        this.aux_machinery_ethanol = aux_machinery_ethanol || 0;
        this.aux_machinery_other_fuel_consumption = aux_machinery_other_fuel_consumption || 0;
        this.aux_machinery_other_fuel_type = aux_machinery_other_fuel_type || 0;
        this.aux_machinery_other_full_emission = aux_machinery_other_full_emission || 0;


        this.boiler_machinery_hfo = boiler_machinery_hfo || 0;
        this.boiler_machinery_lfo = boiler_machinery_lfo || 0;
        this.boiler_machinery_mgo = boiler_machinery_mgo || 0;
        this.boiler_machinery_mdo = boiler_machinery_mdo || 0;
        this.boiler_machinery_lpg = boiler_machinery_lpg || 0;
        this.boiler_machinery_methanol = boiler_machinery_methanol || 0;
        this.boiler_machinery_ethanol = boiler_machinery_ethanol || 0;
        this.boiler_machinery_other_fuel_consumption = boiler_machinery_other_fuel_consumption || 0;
        this.boiler_machinery_other_fuel_type = boiler_machinery_other_fuel_type || 0;
        this.boiler_machinery_other_full_emission = boiler_machinery_other_full_emission || 0;


        this.gi_machinery_hfo = gi_machinery_hfo || 0;
        this.gi_machinery_lfo = gi_machinery_lfo || 0;
        this.gi_machinery_mgo = gi_machinery_mgo || 0;
        this.gi_machinery_mdo = gi_machinery_mdo || 0;
        this.gi_machinery_lpg = gi_machinery_lpg || 0;
        this.gi_machinery_methanol = gi_machinery_methanol || 0;
        this.gi_machinery_ethanol = gi_machinery_ethanol || 0;
        this.gi_machinery_other_fuel_consumption = gi_machinery_other_fuel_consumption || 0;
        this.gi_machinery_other_fuel_type = gi_machinery_other_fuel_type || 0;
        this.gi_machinery_other_full_emission = gi_machinery_other_full_emission || 0;


        this.ifo_other = ifo_other || 0;
        this.mgo_pp = mgo_pp || 0;
        this.mgo_other = mgo_other || 0;

        this.rob_hfo = rob_hfo || 0;
        this.rob_lfo = rob_lfo || 0;
        this.rob_mgo = rob_mgo || 0;
        this.rob_mdo = rob_mdo || 0;
        this.rob_lpg = rob_lpg || 0;
        this.rob_lng = rob_lng || 0;
        this.rob_methanol = rob_methanol || 0;
        this.rob_ethanol = rob_ethanol || 0;
        this.rob_other_fuel = rob_other_fuel || 0;
        this.rob_other_fuel_type = rob_other_fuel_type || 0;

    }
}


export class  FormatDNV_Bunker_Report {

    constructor(
        public bunker_delivery_number?: String,
        public bunker_delivery_date?: String,
        public fuel_type?: String,

        public mass?: number,
        public sulphur_content?: number,
        public density?: number,
        public lower_heating_value?: number, 

    ) { 
        this.bunker_delivery_number = bunker_delivery_number || '';
        this.bunker_delivery_date = bunker_delivery_date || '';
        this.fuel_type = fuel_type || '';
        
        this.mass = mass || 0;
        this.sulphur_content = sulphur_content || 0; 
        this.density = density || 0;
        this.lower_heating_value = lower_heating_value || 0; 

    }
}

export class ListExcelFormatDNV {

    constructor(
        public GetFormatDNV?: GetFormatDNV[],
        public GetFormatDNV_DCS_NOON_FULL?: GetFormatDNV_DCS_NOON_FULL[],
        public FormatDNV_Bunker_Report?: FormatDNV_Bunker_Report[]
    ) {
        this.GetFormatDNV = GetFormatDNV || [];
        this.GetFormatDNV_DCS_NOON_FULL = GetFormatDNV_DCS_NOON_FULL || [];
        this.FormatDNV_Bunker_Report = FormatDNV_Bunker_Report || [];
    }

}


export class TotalConsumptioAndTimeEquiment {

    constructor(
        // Fecha de registro
        public lastDate?: Date,
        // Hora
        public lastHour?: string,

        // Recarga de IFO
        public bunkeringIfo?: number,
        // Recarga de MGO
        public bunkeringMgo?: number,


        // Consumo mplaIfo
        public mplaIfo?: number,
        public mplaIfoTime?: number,
        // Consumo auxIfo
        public auxIfo?: number,
        public auxIfoTime?: number,
        // consumo boilerIfo
        public boilerIfo?: number,
        public boilerIfoTime?: number,
        // Otros consumos Ifo
        public otherIfo?: number,
        public otherIfoTime?: number,

        // Consumo mplaMgo
        public mplaMgo?: number,
        public mplaMgoTime?: number,
        // Consumo auxMgo
        public auxMgo?: number,
        public auxMgoTime?: number,
        // Consumo boilerMgo
        public boilerMgo?: number,
        public boilerMgoTime?: number,
        // Consumo ppMgo
        public ppMgo?: number,
        public ppMgoTime?: number,
        // Consumo giMgo
        public giMgo?: number,
        public giMgoTime?: number,
        // Consumo otherMgo
        public otherMgo?: number,
        public otherMgoTime?: number,




        public distance?: number,

    ) {
        this.lastDate = lastDate || null;
        this.lastHour = lastHour || '';
        this.bunkeringIfo = bunkeringIfo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;

        this.mplaIfo = mplaIfo || 0;
        this.mplaIfoTime = mplaIfoTime || 0;
        this.auxIfo = auxIfo || 0;
        this.auxIfoTime = auxIfoTime || 0;
        this.boilerIfo = boilerIfo || 0;
        this.boilerIfoTime = boilerIfoTime || 0;
        this.otherIfo = otherIfo || 0;
        this.otherIfoTime = otherIfoTime || 0;


        this.mplaMgo = mplaMgo || 0;
        this.mplaMgoTime = mplaMgoTime || 0;
        this.auxMgo = auxMgo || 0;
        this.auxMgoTime = auxMgoTime || 0;
        this.boilerMgo = boilerMgo || 0;
        this.boilerMgoTime = boilerMgoTime || 0;
        this.ppMgo = ppMgo || 0;
        this.ppMgoTime = ppMgoTime || 0;
        this.giMgo = giMgo || 0;
        this.giMgoTime = giMgoTime || 0;
        this.otherMgo = otherMgo || 0;
        this.otherMgoTime = otherMgoTime || 0;


        this.distance = distance || 0;
    }

    public totalIfo: number = 0;
    public totalMgo: number = 0;
    AddConsumptionAndTime(dailReport: DailyReport) {

        this.lastDate = dailReport.date;
        this.lastHour = dailReport.hour;

        // Sumamos el total de bunkering de IFO
        this.bunkeringIfo += dailReport.bunkeringIfo;
        this.bunkeringMgo += dailReport.bunkeringMgo;

        // Consumo mplaIfo
        if (dailReport.mplaIfo) {
            this.mplaIfo += dailReport.mplaIfo;
            this.mplaIfoTime += dailReport.steamingTime;
        }
        // Consumo auxIfo
        if (dailReport.auxIfo) {
            this.auxIfo += dailReport.auxIfo;
            this.auxIfoTime += dailReport.steamingTime;
        }
        // consumo boilerIfo
        if (dailReport.boilerIfo) {
            this.boilerIfo += dailReport.boilerIfo;
            this.boilerIfoTime += dailReport.steamingTime;
        }
        // Otros consumos Ifo
        if (dailReport.otherIfo) {
            this.otherIfo += dailReport.otherIfo;
            this.otherIfoTime += dailReport.steamingTime;
        }

        // Consumo mplaMgo
        if (dailReport.mplaMgo) {
            this.mplaMgo += dailReport.mplaMgo;
            this.mplaMgoTime += dailReport.steamingTime;
        }
        // Consumo auxMgo
        if (dailReport.auxMgo) {
            this.auxMgo += dailReport.auxMgo;
            this.auxMgoTime += dailReport.steamingTime;
        }
        // Consumo boilerMgo
        if (dailReport.boilerMgo) {
            this.boilerMgo += dailReport.boilerMgo;
            this.boilerMgoTime += dailReport.steamingTime;
        }
        // Consumo ppMgo
        if (dailReport.ppMgo) {
            this.ppMgo += dailReport.ppMgo;
            this.ppMgoTime += dailReport.steamingTime;
        }
        // Consumo giMgo
        if (dailReport.giMgo) {
            this.giMgo += dailReport.giMgo;
            this.giMgoTime += dailReport.steamingTime;
        }
        // Consumo otherMgo
        if (dailReport.otherMgo) {
            this.otherMgo += dailReport.otherMgo;
            this.otherMgoTime += dailReport.steamingTime;
        }


        // total de Distancia
        this.distance += dailReport.distance;


        this.totalIfo += dailReport.mplaIfo + dailReport.auxIfo + dailReport.boilerIfo + dailReport.otherIfo;
        this.totalMgo += dailReport.mplaMgo + dailReport.auxMgo + dailReport.boilerMgo + dailReport.ppMgo + dailReport.giMgo + dailReport.otherMgo;

    }

}