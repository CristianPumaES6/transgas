// El DailyReport es una entidad en la BD.
// Mejora => las entidades que existen en BD, deberian llevar la palabra Entity, para saber que es una entidad, esto se deberia de aplicar a todas las entidades de BD.
export class DailyReport {
    constructor(
    // Id Detalle
    id, 
    // UserId que registra el dato
    userId, 
    // Puerto ID
    portId, 
    // Actividades realizada
    activityPerformed, 
    // TypeActivity realizada
    typeActivityPerformed, 
    //  SpeedStraction ECO_SPEED | FULL_SPEED
    speedStraction, 
    // Fecha de registro
    date, 
    // Hora
    hour, 
    //
    north_degree, north_minutes, north_north_south, east_degree, east_minutes, east_east_west, 
    // Recarga de IFO
    bunkeringIfo, 
    // Recarga de MGO
    bunkeringMgo, 
    // Consumo mplaIfo
    mplaIfo, 
    // Consumo auxIfo
    auxIfo, 
    // consumo boilerIfo
    boilerIfo, 
    // Otros consumos Ifo
    otherIfo, 
    // Consumo mplaMgo
    mplaMgo, 
    // Consumo auxMgo
    auxMgo, 
    // Consumo boilerMgo
    boilerMgo, 
    // Consumo ppMgo
    ppMgo, 
    // Consumo giMgo
    giMgo, 
    // Consumo otherMgo
    otherMgo, 
    // Tempo navegando
    steamingTime, 
    // Distancia
    distance, 
    // beaufour
    beaufour, 
    // Observaciones
    observation, 
    // Auditoria
    userIdCreated, dateCreated, userIdUpdated, dateUpdated, status, syncStatus) {
        this.id = id;
        this.userId = userId;
        this.portId = portId;
        this.activityPerformed = activityPerformed;
        this.typeActivityPerformed = typeActivityPerformed;
        this.speedStraction = speedStraction;
        this.date = date;
        this.hour = hour;
        this.north_degree = north_degree;
        this.north_minutes = north_minutes;
        this.north_north_south = north_north_south;
        this.east_degree = east_degree;
        this.east_minutes = east_minutes;
        this.east_east_west = east_east_west;
        this.bunkeringIfo = bunkeringIfo;
        this.bunkeringMgo = bunkeringMgo;
        this.mplaIfo = mplaIfo;
        this.auxIfo = auxIfo;
        this.boilerIfo = boilerIfo;
        this.otherIfo = otherIfo;
        this.mplaMgo = mplaMgo;
        this.auxMgo = auxMgo;
        this.boilerMgo = boilerMgo;
        this.ppMgo = ppMgo;
        this.giMgo = giMgo;
        this.otherMgo = otherMgo;
        this.steamingTime = steamingTime;
        this.distance = distance;
        this.beaufour = beaufour;
        this.observation = observation;
        this.userIdCreated = userIdCreated;
        this.dateCreated = dateCreated;
        this.userIdUpdated = userIdUpdated;
        this.dateUpdated = dateUpdated;
        this.status = status;
        this.syncStatus = syncStatus;
        // estos campos se estan agregando para tener el total de consumo
        // ya no segmentado por maquina.
        this.robIfo = 0;
        this.robMgo = 0;
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
}
// En el daily report tambien podemos tener el modelo de velocida.
// el cual se obtiene mediante un calculo.
// distancia entre tiempo.
export class Speed {
    constructor(
    // userId : servira para hacer auditoria.
    distance, 
    // Lugar de partida,
    steamingTime, 
    // Lugar de partida,
    // MEJORA
    // Solo se agregara la distancia y tiempo si hay consumo IFO
    distanceIFO, timeOperationIFO, 
    // Solo se agregara la distancia y tiempo si hay consumo MGO
    distanceMGO, timeOperationMGO) {
        this.distance = distance;
        this.steamingTime = steamingTime;
        this.distanceIFO = distanceIFO;
        this.timeOperationIFO = timeOperationIFO;
        this.distanceMGO = distanceMGO;
        this.timeOperationMGO = timeOperationMGO;
        this.distance = distance || 0;
        this.steamingTime = steamingTime || 0;
        this.distanceIFO = distanceIFO || 0;
        this.timeOperationIFO = timeOperationIFO || 0;
        this.distanceMGO = distanceMGO || 0;
        this.timeOperationMGO = timeOperationMGO || 0;
    }
    // funcion para agregar mas distancia y tiempo a la variable.
    add(addDistance, addSteamingTime) {
        this.distance = this.distance + addDistance;
        this.steamingTime = this.steamingTime + addSteamingTime;
    }
    // funcion para agregar mas distancia y tiempo a la variable solo si hay consumo IFO
    addInfoIFO(addDistanceIFO, addTimeOperationIFO) {
        this.distanceIFO = this.distanceIFO + addDistanceIFO;
        this.timeOperationIFO = this.timeOperationIFO + addTimeOperationIFO;
    }
    // funcion para agregar mas distancia y tiempo a la variable solo si hay consumo MGO
    addInfoMGO(addDistanceMGO, addTimeOperationMGO) {
        this.distanceMGO = this.distanceMGO + addDistanceMGO;
        this.timeOperationMGO = this.timeOperationMGO + addTimeOperationMGO;
    }
}
// Estructura del servicio.
export class GetROBByUser {
    constructor(total_ifo, total_mgo, total_bunkering_ifo, total_bunkering_mgo) {
        this.total_ifo = total_ifo;
        this.total_mgo = total_mgo;
        this.total_bunkering_ifo = total_bunkering_ifo;
        this.total_bunkering_mgo = total_bunkering_mgo;
        this.total_ifo = total_ifo || 0;
        this.total_mgo = total_mgo || 0;
        this.total_bunkering_ifo = total_bunkering_ifo || 0;
        this.total_bunkering_mgo = total_bunkering_mgo || 0;
    }
}
// Este objeto indica el inicio y fin del combustible.
export class InfoFuelStartEndForDate {
    constructor(infoFuelStart, infoFuelEnd) {
        this.infoFuelStart = infoFuelStart;
        this.infoFuelEnd = infoFuelEnd;
        this.infoFuelStart = infoFuelStart || new GetROBByUser();
        this.infoFuelEnd = infoFuelEnd || new GetROBByUser();
    }
}
// Info de consumo de viaje y bunkering.
export class GetInfoVoyageROBBunkering {
    constructor(voyageId, voyageNumber, minDate, maxDate, totalIFO, totalMGO, listInfoBunkering) {
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
    constructor(portId, portNumber, portDeparture, daily_reportId, dailyReportDate, bunkeringIfo, bunkeringMgo, observation) {
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
    constructor(reportId, date, time, north_degree, north_minutes, north_north_south, east_degree, east_minutes, east_east_west, event, event_time_previous, event_time_sailing, distance, machinery_hfo, machinery_lfo, machinery_mgo, machinery_mdo, machinery_lpg, machinery_lng, machinery_methanol, machinery_ethanol, machinery_other_fuel_consumption, machinery_other_fuel_type, machinery_other_full_emission, rob_hfo, rob_lfo, rob_mgo, rob_mdo, rob_lpg, rob_lng, rob_methanol, rob_ethanol, rob_other_fuel, rob_other_fuel_type) {
        this.reportId = reportId;
        this.date = date;
        this.time = time;
        this.north_degree = north_degree;
        this.north_minutes = north_minutes;
        this.north_north_south = north_north_south;
        this.east_degree = east_degree;
        this.east_minutes = east_minutes;
        this.east_east_west = east_east_west;
        this.event = event;
        this.event_time_previous = event_time_previous;
        this.event_time_sailing = event_time_sailing;
        this.distance = distance;
        this.machinery_hfo = machinery_hfo;
        this.machinery_lfo = machinery_lfo;
        this.machinery_mgo = machinery_mgo;
        this.machinery_mdo = machinery_mdo;
        this.machinery_lpg = machinery_lpg;
        this.machinery_lng = machinery_lng;
        this.machinery_methanol = machinery_methanol;
        this.machinery_ethanol = machinery_ethanol;
        this.machinery_other_fuel_consumption = machinery_other_fuel_consumption;
        this.machinery_other_fuel_type = machinery_other_fuel_type;
        this.machinery_other_full_emission = machinery_other_full_emission;
        this.rob_hfo = rob_hfo;
        this.rob_lfo = rob_lfo;
        this.rob_mgo = rob_mgo;
        this.rob_mdo = rob_mdo;
        this.rob_lpg = rob_lpg;
        this.rob_lng = rob_lng;
        this.rob_methanol = rob_methanol;
        this.rob_ethanol = rob_ethanol;
        this.rob_other_fuel = rob_other_fuel;
        this.rob_other_fuel_type = rob_other_fuel_type;
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
    constructor(reportId, date, time, north_degree, north_minutes, north_north_south, east_degree, east_minutes, east_east_west, event, event_time_previous, event_time_sailing, distance, 
    // MP
    me_machinery_hfo, me_machinery_lfo, me_machinery_mgo, me_machinery_mdo, me_machinery_lpg, me_machinery_lng, me_machinery_methanol, me_machinery_ethanol, me_machinery_other_fuel_consumption, me_machinery_other_fuel_type, me_machinery_other_full_emission, 
    //AUX
    aux_machinery_hfo, aux_machinery_lfo, aux_machinery_mgo, aux_machinery_mdo, aux_machinery_lpg, aux_machinery_lng, aux_machinery_methanol, aux_machinery_ethanol, aux_machinery_other_fuel_consumption, aux_machinery_other_fuel_type, aux_machinery_other_full_emission, 
    // Boiler
    boiler_machinery_hfo, boiler_machinery_lfo, boiler_machinery_mgo, boiler_machinery_mdo, boiler_machinery_lpg, boiler_machinery_lng, boiler_machinery_methanol, boiler_machinery_ethanol, boiler_machinery_other_fuel_consumption, boiler_machinery_other_fuel_type, boiler_machinery_other_full_emission, 
    // Gas Innerte
    gi_machinery_hfo, gi_machinery_lfo, gi_machinery_mgo, gi_machinery_mdo, gi_machinery_lpg, gi_machinery_lng, gi_machinery_methanol, gi_machinery_ethanol, gi_machinery_other_fuel_consumption, gi_machinery_other_fuel_type, gi_machinery_other_full_emission, ifo_other, mgo_pp, mgo_other, 
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
    rob_hfo, rob_lfo, rob_mgo, rob_mdo, rob_lpg, rob_lng, rob_methanol, rob_ethanol, rob_other_fuel, rob_other_fuel_type) {
        this.reportId = reportId;
        this.date = date;
        this.time = time;
        this.north_degree = north_degree;
        this.north_minutes = north_minutes;
        this.north_north_south = north_north_south;
        this.east_degree = east_degree;
        this.east_minutes = east_minutes;
        this.east_east_west = east_east_west;
        this.event = event;
        this.event_time_previous = event_time_previous;
        this.event_time_sailing = event_time_sailing;
        this.distance = distance;
        this.me_machinery_hfo = me_machinery_hfo;
        this.me_machinery_lfo = me_machinery_lfo;
        this.me_machinery_mgo = me_machinery_mgo;
        this.me_machinery_mdo = me_machinery_mdo;
        this.me_machinery_lpg = me_machinery_lpg;
        this.me_machinery_lng = me_machinery_lng;
        this.me_machinery_methanol = me_machinery_methanol;
        this.me_machinery_ethanol = me_machinery_ethanol;
        this.me_machinery_other_fuel_consumption = me_machinery_other_fuel_consumption;
        this.me_machinery_other_fuel_type = me_machinery_other_fuel_type;
        this.me_machinery_other_full_emission = me_machinery_other_full_emission;
        this.aux_machinery_hfo = aux_machinery_hfo;
        this.aux_machinery_lfo = aux_machinery_lfo;
        this.aux_machinery_mgo = aux_machinery_mgo;
        this.aux_machinery_mdo = aux_machinery_mdo;
        this.aux_machinery_lpg = aux_machinery_lpg;
        this.aux_machinery_lng = aux_machinery_lng;
        this.aux_machinery_methanol = aux_machinery_methanol;
        this.aux_machinery_ethanol = aux_machinery_ethanol;
        this.aux_machinery_other_fuel_consumption = aux_machinery_other_fuel_consumption;
        this.aux_machinery_other_fuel_type = aux_machinery_other_fuel_type;
        this.aux_machinery_other_full_emission = aux_machinery_other_full_emission;
        this.boiler_machinery_hfo = boiler_machinery_hfo;
        this.boiler_machinery_lfo = boiler_machinery_lfo;
        this.boiler_machinery_mgo = boiler_machinery_mgo;
        this.boiler_machinery_mdo = boiler_machinery_mdo;
        this.boiler_machinery_lpg = boiler_machinery_lpg;
        this.boiler_machinery_lng = boiler_machinery_lng;
        this.boiler_machinery_methanol = boiler_machinery_methanol;
        this.boiler_machinery_ethanol = boiler_machinery_ethanol;
        this.boiler_machinery_other_fuel_consumption = boiler_machinery_other_fuel_consumption;
        this.boiler_machinery_other_fuel_type = boiler_machinery_other_fuel_type;
        this.boiler_machinery_other_full_emission = boiler_machinery_other_full_emission;
        this.gi_machinery_hfo = gi_machinery_hfo;
        this.gi_machinery_lfo = gi_machinery_lfo;
        this.gi_machinery_mgo = gi_machinery_mgo;
        this.gi_machinery_mdo = gi_machinery_mdo;
        this.gi_machinery_lpg = gi_machinery_lpg;
        this.gi_machinery_lng = gi_machinery_lng;
        this.gi_machinery_methanol = gi_machinery_methanol;
        this.gi_machinery_ethanol = gi_machinery_ethanol;
        this.gi_machinery_other_fuel_consumption = gi_machinery_other_fuel_consumption;
        this.gi_machinery_other_fuel_type = gi_machinery_other_fuel_type;
        this.gi_machinery_other_full_emission = gi_machinery_other_full_emission;
        this.ifo_other = ifo_other;
        this.mgo_pp = mgo_pp;
        this.mgo_other = mgo_other;
        this.rob_hfo = rob_hfo;
        this.rob_lfo = rob_lfo;
        this.rob_mgo = rob_mgo;
        this.rob_mdo = rob_mdo;
        this.rob_lpg = rob_lpg;
        this.rob_lng = rob_lng;
        this.rob_methanol = rob_methanol;
        this.rob_ethanol = rob_ethanol;
        this.rob_other_fuel = rob_other_fuel;
        this.rob_other_fuel_type = rob_other_fuel_type;
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
export class ListExcelFormatDNV {
    constructor(GetFormatDNV, GetFormatDNV_DCS_NOON_FULL) {
        this.GetFormatDNV = GetFormatDNV;
        this.GetFormatDNV_DCS_NOON_FULL = GetFormatDNV_DCS_NOON_FULL;
        this.GetFormatDNV = GetFormatDNV || [];
        this.GetFormatDNV_DCS_NOON_FULL = GetFormatDNV_DCS_NOON_FULL || [];
    }
}
export class TotalConsumptioAndTimeEquiment {
    constructor(
    // Fecha de registro
    lastDate, 
    // Hora
    lastHour, 
    // Recarga de IFO
    bunkeringIfo, 
    // Recarga de MGO
    bunkeringMgo, 
    // Consumo mplaIfo
    mplaIfo, mplaIfoTime, 
    // Consumo auxIfo
    auxIfo, auxIfoTime, 
    // consumo boilerIfo
    boilerIfo, boilerIfoTime, 
    // Otros consumos Ifo
    otherIfo, otherIfoTime, 
    // Consumo mplaMgo
    mplaMgo, mplaMgoTime, 
    // Consumo auxMgo
    auxMgo, auxMgoTime, 
    // Consumo boilerMgo
    boilerMgo, boilerMgoTime, 
    // Consumo ppMgo
    ppMgo, ppMgoTime, 
    // Consumo giMgo
    giMgo, giMgoTime, 
    // Consumo otherMgo
    otherMgo, otherMgoTime, distance) {
        this.lastDate = lastDate;
        this.lastHour = lastHour;
        this.bunkeringIfo = bunkeringIfo;
        this.bunkeringMgo = bunkeringMgo;
        this.mplaIfo = mplaIfo;
        this.mplaIfoTime = mplaIfoTime;
        this.auxIfo = auxIfo;
        this.auxIfoTime = auxIfoTime;
        this.boilerIfo = boilerIfo;
        this.boilerIfoTime = boilerIfoTime;
        this.otherIfo = otherIfo;
        this.otherIfoTime = otherIfoTime;
        this.mplaMgo = mplaMgo;
        this.mplaMgoTime = mplaMgoTime;
        this.auxMgo = auxMgo;
        this.auxMgoTime = auxMgoTime;
        this.boilerMgo = boilerMgo;
        this.boilerMgoTime = boilerMgoTime;
        this.ppMgo = ppMgo;
        this.ppMgoTime = ppMgoTime;
        this.giMgo = giMgo;
        this.giMgoTime = giMgoTime;
        this.otherMgo = otherMgo;
        this.otherMgoTime = otherMgoTime;
        this.distance = distance;
        this.totalIfo = 0;
        this.totalMgo = 0;
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
    AddConsumptionAndTime(dailReport) {
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
//# sourceMappingURL=daily-report.js.map