export class Port {
    constructor(
    // Id unique.
    id, 
    // userId : servira para hacer auditoria.
    userId, 
    // Numero de viaje.
    voyageId, 
    // Numero de puerto.
    portNumber, 
    // Lugar de partida,
    departurePort, 
    // Lugar de llegada.
    arrivalPort, 
    // Atributos de inicio de fecha IFO Y MGO
    startDate, startIFO, startMGO, 
    // Auditoria
    userIdCreated, dateCreated, userIdUpdated, dateUpdated, status, syncStatus) {
        this.id = id;
        this.userId = userId;
        this.voyageId = voyageId;
        this.portNumber = portNumber;
        this.departurePort = departurePort;
        this.arrivalPort = arrivalPort;
        this.startDate = startDate;
        this.startIFO = startIFO;
        this.startMGO = startMGO;
        this.userIdCreated = userIdCreated;
        this.dateCreated = dateCreated;
        this.userIdUpdated = userIdUpdated;
        this.dateUpdated = dateUpdated;
        this.status = status;
        this.syncStatus = syncStatus;
        this.id = id || null;
        this.userId = userId || null;
        this.voyageId = voyageId || null;
        this.portNumber = portNumber || null;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';
        this.startDate = startDate || null;
        this.startIFO = startIFO || 0;
        this.startMGO = startMGO || 0;
        // Audiotoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
        this.syncStatus = '';
    }
}
export class GetLastPortAndTotalConsump {
    constructor(portId, userId, departurePort, arrivalPort, startDate, startIFO, startMGO, lastDate, bunkeringIfo, bunkeringMgo, mplaIfo, auxIfo, boilerIfo, otherIfo, mplaMgo, auxMgo, boilerMgo, ppMgo, giMgo, otherMgo, distance) {
        this.portId = portId || 0;
        this.userId = userId || 0;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';
        this.startDate = startDate || '';
        this.startIFO = startIFO || 0;
        this.startMGO = startMGO || 0;
        this.lastDate = lastDate || '';
        this.bunkeringIfo = bunkeringIfo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;
        this.mplaIfo = mplaIfo || 0;
        this.auxIfo = auxIfo || 0;
        this.boilerIfo = boilerIfo || 0;
        this.otherIfo = otherIfo || 0;
        this.mplaMgo = mplaMgo || 0;
        this.auxMgo = auxMgo || 0;
        this.boilerMgo = boilerMgo || 0;
        this.ppMgo = ppMgo || 0;
        this.giMgo = giMgo || 0;
        this.otherMgo = otherMgo || 0;
        this.distance = distance || 0;
    }
}
//# sourceMappingURL=port.js.map