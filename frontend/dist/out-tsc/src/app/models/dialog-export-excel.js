// Esto se debe corregir o sustituir por GetReportVoyagePortDaily2
export class GetReportVoyagePortDaily {
    constructor(userId, year, voyageId, voyageNumber, portId, portNumber, departurePort, arrivalPort, startDate, startIFO, startMGO, dailyReportId, 
    // Fecha de registro
    date, 
    // Hora
    hour, 
    // Tempo transcurrido
    steamingTime, 
    // Actividades realizada
    activityPerformed, typeActivityPerformed, 
    //  SpeedStraction ECO_SPEED | FULL_SPEED
    speedStraction, 
    // Observaciones
    observation, distance, 
    // beaufour
    beaufour, 
    // Consumo mplaIfo
    mplaIfo, 
    // Consumo auxIfo
    auxIfo, 
    // consumo boilerIfo
    boilerIfo, 
    // Otros consumos Ifo
    otherIfo, 
    // Recarga de IFO
    bunkeringIfo, 
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
    // Recarga de MGO
    bunkeringMgo, syncStatusDaily, statusDaily, syncStatusPort, statusPort, syncStatusVoyage, statusVoyage, 
    // ULTIMOS CAMPOS DE UBICACION
    north_degree, north_minutes, north_north_south, east_degree, east_minutes, east_east_west, navigatedTime) {
        this.userId = userId;
        this.year = year;
        this.voyageId = voyageId;
        this.voyageNumber = voyageNumber;
        this.portId = portId;
        this.portNumber = portNumber;
        this.departurePort = departurePort;
        this.arrivalPort = arrivalPort;
        this.startDate = startDate;
        this.startIFO = startIFO;
        this.startMGO = startMGO;
        this.dailyReportId = dailyReportId;
        this.date = date;
        this.hour = hour;
        this.steamingTime = steamingTime;
        this.activityPerformed = activityPerformed;
        this.typeActivityPerformed = typeActivityPerformed;
        this.speedStraction = speedStraction;
        this.observation = observation;
        this.distance = distance;
        this.beaufour = beaufour;
        this.mplaIfo = mplaIfo;
        this.auxIfo = auxIfo;
        this.boilerIfo = boilerIfo;
        this.otherIfo = otherIfo;
        this.bunkeringIfo = bunkeringIfo;
        this.mplaMgo = mplaMgo;
        this.auxMgo = auxMgo;
        this.boilerMgo = boilerMgo;
        this.ppMgo = ppMgo;
        this.giMgo = giMgo;
        this.otherMgo = otherMgo;
        this.bunkeringMgo = bunkeringMgo;
        this.syncStatusDaily = syncStatusDaily;
        this.statusDaily = statusDaily;
        this.syncStatusPort = syncStatusPort;
        this.statusPort = statusPort;
        this.syncStatusVoyage = syncStatusVoyage;
        this.statusVoyage = statusVoyage;
        this.north_degree = north_degree;
        this.north_minutes = north_minutes;
        this.north_north_south = north_north_south;
        this.east_degree = east_degree;
        this.east_minutes = east_minutes;
        this.east_east_west = east_east_west;
        this.navigatedTime = navigatedTime;
        this.userId = userId || 0;
        this.year = year || 0;
        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;
        this.portId = portId || 0;
        this.portNumber = portNumber || 0;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';
        this.startDate = startDate || null;
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
        this.navigatedTime = navigatedTime || 0;
    }
}
export class GetReportVoyagePortDaily2 {
    constructor(userId, 
    // Datos del viaje
    voyageId, voyageNumber, year, portId, portNumber, departurePort, arrivalPort, startDate, startIFO, startMGO, dailyReportId, 
    // Fecha de registro
    date, 
    // Hora
    hour, 
    // Tempo transcurrido
    steamingTime, 
    // Actividades realizada
    activityPerformed, typeActivityPerformed, 
    //  SpeedStraction ECO_SPEED | FULL_SPEED
    speedStraction, 
    // Observaciones
    observation, distance, 
    // beaufour
    beaufour, 
    // Consumo mplaIfo
    mplaIfo, 
    // Consumo auxIfo
    auxIfo, 
    // consumo boilerIfo
    boilerIfo, 
    // Otros consumos Ifo
    otherIfo, 
    // Recarga de IFO
    bunkeringIfo, 
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
    // Recarga de MGO
    bunkeringMgo, syncStatusDaily, statusDaily, syncStatusPort, statusPort, syncStatusVoyage, statusVoyage, 
    // ULTIMOS CAMPOS DE UBICACION
    north_degree, north_minutes, north_north_south, east_degree, east_minutes, east_east_west) {
        this.userId = userId;
        this.voyageId = voyageId;
        this.voyageNumber = voyageNumber;
        this.year = year;
        this.portId = portId;
        this.portNumber = portNumber;
        this.departurePort = departurePort;
        this.arrivalPort = arrivalPort;
        this.startDate = startDate;
        this.startIFO = startIFO;
        this.startMGO = startMGO;
        this.dailyReportId = dailyReportId;
        this.date = date;
        this.hour = hour;
        this.steamingTime = steamingTime;
        this.activityPerformed = activityPerformed;
        this.typeActivityPerformed = typeActivityPerformed;
        this.speedStraction = speedStraction;
        this.observation = observation;
        this.distance = distance;
        this.beaufour = beaufour;
        this.mplaIfo = mplaIfo;
        this.auxIfo = auxIfo;
        this.boilerIfo = boilerIfo;
        this.otherIfo = otherIfo;
        this.bunkeringIfo = bunkeringIfo;
        this.mplaMgo = mplaMgo;
        this.auxMgo = auxMgo;
        this.boilerMgo = boilerMgo;
        this.ppMgo = ppMgo;
        this.giMgo = giMgo;
        this.otherMgo = otherMgo;
        this.bunkeringMgo = bunkeringMgo;
        this.syncStatusDaily = syncStatusDaily;
        this.statusDaily = statusDaily;
        this.syncStatusPort = syncStatusPort;
        this.statusPort = statusPort;
        this.syncStatusVoyage = syncStatusVoyage;
        this.statusVoyage = statusVoyage;
        this.north_degree = north_degree;
        this.north_minutes = north_minutes;
        this.north_north_south = north_north_south;
        this.east_degree = east_degree;
        this.east_minutes = east_minutes;
        this.east_east_west = east_east_west;
        this.userId = userId || 0;
        this.year = year || 0;
        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;
        this.portId = portId || 0;
        this.portNumber = portNumber || 0;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';
        this.startDate = startDate || null,
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
}
//# sourceMappingURL=dialog-export-excel.js.map