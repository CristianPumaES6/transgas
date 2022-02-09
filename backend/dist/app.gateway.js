"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const moment_assets_1 = require("./assets/moment.assets");
const server_config_1 = require("./config/server.config");
const loggedUser_1 = require("./models/loggedUser");
const socketEmit_1 = require("./models/socketEmit");
let AppGateway = class AppGateway {
    constructor() {
        this.logger = new common_1.Logger('AppGateway');
        this.loggedUsers = [];
    }
    handleConnection(client) {
        this.logger.log('New client connected' + client.id);
        if (client && client.id) {
            let IsUserLogeatedExit = new loggedUser_1.LoggedUser();
            IsUserLogeatedExit.clientId = client.id;
            this.IsUserLogeatedExit(IsUserLogeatedExit);
        }
        client.emit('isOnlineConection');
    }
    handleDisconnect(client) {
        this.logger.log('Client disconnected' + client.id);
        if (client && client.id) {
            let userDisconnect = this.loggedUsers.find((logeate) => {
                return (logeate.clientId === client.id && logeate.isActive == true);
            });
            if (userDisconnect) {
                userDisconnect.lastConnection = moment_assets_1.GetDate();
                userDisconnect.isActive = false;
                this.UpdateUserLogeated(userDisconnect);
            }
        }
    }
    handleEvent(socketEmitModel, client) {
        if (socketEmitModel && socketEmitModel.action == 'REGISTER_CONECTION_USER') {
            let IsUserLogeatedExit = socketEmitModel.data;
            IsUserLogeatedExit.clientId = client.id;
            this.IsUserLogeatedExit(IsUserLogeatedExit);
        }
        else if (socketEmitModel && socketEmitModel.action == 'SYNC_DATA_BY_USER') {
            let userLogeate = socketEmitModel.data;
            this.wss.to(userLogeate.clientId).emit('EmitConnect', socketEmitModel);
        }
        else {
            this.logger.log('No entro revisar.');
            this.logger.log('Socket updateConectionUser');
            this.logger.log(JSON.stringify(socketEmitModel));
        }
        return [];
    }
    IsUserLogeatedExit(loggedUser) {
        let isUserExit = this.loggedUsers.find((logeate) => {
            return (logeate.clientId === loggedUser.clientId);
        });
        if (isUserExit) {
            isUserExit.userName = loggedUser.userName || isUserExit.userName;
            isUserExit.lastConnection = moment_assets_1.GetDate();
            isUserExit.isActive = true;
            this.UpdateUserLogeated(isUserExit);
        }
        else {
            this.AddUserLogeated(loggedUser);
        }
        return true;
    }
    AddUserLogeated(loggedUser) {
        loggedUser.firstConnection = moment_assets_1.GetDate();
        loggedUser.lastConnection = moment_assets_1.GetDate();
        loggedUser.isActive = true;
        this.loggedUsers.push(loggedUser);
        return true;
    }
    UpdateUserLogeated(loggedUser) {
        this.loggedUsers.forEach(logged => {
            if (logged.clientId === loggedUser.clientId) {
                logged.userName = loggedUser.userName;
                logged.lastConnection = loggedUser.lastConnection;
                logged.isActive = loggedUser.isActive;
                if (loggedUser.lat == 0 && loggedUser.lng == 0) {
                }
                else {
                    logged.lat = loggedUser.lat;
                    logged.lat = loggedUser.lng;
                }
            }
        });
        return true;
    }
    GetLoggedUsers() {
        return this.loggedUsers;
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], AppGateway.prototype, "wss", void 0);
__decorate([
    websockets_1.SubscribeMessage('EmitConnect'),
    __param(0, websockets_1.MessageBody()),
    __param(1, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socketEmit_1.SocketEmitModel, Object]),
    __metadata("design:returntype", Array)
], AppGateway.prototype, "handleEvent", null);
AppGateway = __decorate([
    websockets_1.WebSocketGateway(server_config_1.URL_Server.puertoSocket, { transport: ['websocket'] })
], AppGateway);
exports.AppGateway = AppGateway;
//# sourceMappingURL=app.gateway.js.map