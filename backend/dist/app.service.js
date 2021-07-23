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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const app_gateway_1 = require("./app.gateway");
const moment_assets_1 = require("./assets/moment.assets");
let AppService = class AppService {
    constructor(gateway) {
        this.gateway = gateway;
        this.loggedUsers = [];
    }
    getHello() {
        return 'Hello World!';
    }
    IsUserLogeatedExit(loggedUser) {
        let isUserExit = this.loggedUsers.find((logeate) => {
            return logeate.token === loggedUser.token;
        });
        if (isUserExit) {
            this.UpdateUserLogeated(loggedUser);
            return false;
        }
        else {
            this.AddUserLogeated(loggedUser);
            return true;
        }
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
            if (logged.token === loggedUser.token) {
                logged.lastConnection = moment_assets_1.GetDate();
                if (loggedUser.lat == 0 && loggedUser.lng == 0) {
                }
                else {
                    logged.lat = loggedUser.lat;
                    logged.lat = loggedUser.lng;
                }
                logged.isActive = true;
            }
        });
        return true;
    }
    GetLoggedUsers() {
        return this.loggedUsers;
    }
    EmitConnect() {
        this.loggedUsers.forEach(loggedUser => {
            loggedUser.isActive = false;
        });
        return true;
    }
};
AppService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [app_gateway_1.AppGateway])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map