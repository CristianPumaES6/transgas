"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedUser = void 0;
class LoggedUser {
    constructor(clientId, token, userName, firstConnection, lastConnection, lat, lng, isActive) {
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
exports.LoggedUser = LoggedUser;
//# sourceMappingURL=loggedUser.js.map