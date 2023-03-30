export class LoggedUser {
    constructor(clientId, // id del socket
    token, userName, firstConnection, lastConnection, lat, lng, isActive) {
        this.clientId = clientId;
        this.token = token;
        this.userName = userName;
        this.firstConnection = firstConnection;
        this.lastConnection = lastConnection;
        this.lat = lat;
        this.lng = lng;
        this.isActive = isActive;
        this.clientId = clientId || '';
        this.token = token || '';
        this.userName = userName || '';
        this.firstConnection = firstConnection || '';
        this.lastConnection = lastConnection || '';
        this.lat = lat || 0;
        this.lng = lng || 0;
        this.isActive = isActive || true;
    }
}
export class CantidadRestante {
    constructor(voyage, port, report) {
        this.voyage = voyage;
        this.port = port;
        this.report = report;
        this.voyage = voyage || 0;
        this.port = port || 0;
        this.report = report || 0;
    }
}
//# sourceMappingURL=loggedUser.js.map