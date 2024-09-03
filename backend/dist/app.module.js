"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const users_module_1 = require("./components/users/users.module");
const auth_module_1 = require("./components/auth/auth.module");
const voyages_module_1 = require("./components/voyages/voyages.module");
const app_gateway_1 = require("./app.gateway");
const format_excel_last_voyage_service_1 = require("./services/format-excel-last-voyage/format-excel-last-voyage.service");
const send_message_module_1 = require("./components/send-message/send-message.module");
const oils_module_1 = require("./components/oils/oils.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mssql',
                host: '4.227.179.75',
                port: 1433,
                username: 'User_sa',
                password: 'Server_Admin',
                database: 'FuelOilPlatformDB',
                entities: [(0, path_1.join)(__dirname, '**/**.entity{.ts,.js}')],
                synchronize: true,
                options: {
                    encrypt: false,
                    enableArithAbort: true,
                },
                extra: {
                    trustServerCertificate: true,
                }
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            voyages_module_1.VoyagesModule,
            app_gateway_1.AppGateway,
            send_message_module_1.SendMessageModule,
            oils_module_1.OilsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService,
            app_gateway_1.AppGateway, format_excel_last_voyage_service_1.FormatExcelLastVoyageService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map