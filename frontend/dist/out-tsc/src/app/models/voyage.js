export class Voyage {
    constructor(
    // Id unique.
    id, 
    // userId : servira para hacer auditoria.
    userId, 
    // Lugar de partida,
    voyageNumber, 
    // Lugar de llegada.
    year, 
    // Auditoria
    userIdCreated, dateCreated, userIdUpdated, dateUpdated, status, syncStatus) {
        this.id = id;
        this.userId = userId;
        this.voyageNumber = voyageNumber;
        this.year = year;
        this.userIdCreated = userIdCreated;
        this.dateCreated = dateCreated;
        this.userIdUpdated = userIdUpdated;
        this.dateUpdated = dateUpdated;
        this.status = status;
        this.syncStatus = syncStatus;
        this.ports = [];
        //Numero total de reportes
        this.totalReport = 0;
        // Numero total de puertos
        this.totalPort = 0;
        this.id = id || null;
        this.userId = userId || null;
        this.voyageNumber = voyageNumber || null;
        this.year = year || null;
        // Audiotoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
        this.syncStatus = '';
    }
}
// Modelo para la consulta de viajes por años.
// Es un modeo generico.
export class VoyageFilterByYears {
    constructor(
    // userId : servira para hacer auditoria.
    userId, 
    // Lugar de partida,
    years) {
        this.userId = userId;
        this.years = years;
        this.userId = userId || null;
        this.years = years || [];
    }
}
//# sourceMappingURL=voyage.js.map