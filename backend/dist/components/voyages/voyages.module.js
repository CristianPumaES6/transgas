"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoyagesModule = void 0;
const common_1 = require("@nestjs/common");
const voyages_service_1 = require("./voyages.service");
const voyages_controller_1 = require("./voyages.controller");
const typeorm_1 = require("@nestjs/typeorm");
const voyage_entity_1 = require("../../models/voyage.entity");
const ports_module_1 = require("./ports/ports.module");
const daily_reports_module_1 = require("./daily-reports/daily-reports.module");
const format_excel_last_voyage_service_1 = require("../../services/format-excel-last-voyage/format-excel-last-voyage.service");
const users_module_1 = require("../users/users.module");
const dailyReportSummary_entity_1 = require("../../models/dailyReportSummary.entity");
let VoyagesModule = class VoyagesModule {
};
exports.VoyagesModule = VoyagesModule;
exports.VoyagesModule = VoyagesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([voyage_entity_1.Voyage, dailyReportSummary_entity_1.DailyReportSummary]),
            ports_module_1.PortsModule,
            daily_reports_module_1.DailyReportsModule,
            users_module_1.UsersModule
        ],
        providers: [voyages_service_1.VoyagesService, format_excel_last_voyage_service_1.FormatExcelLastVoyageService],
        controllers: [voyages_controller_1.VoyagesController]
    })
], VoyagesModule);
//# sourceMappingURL=voyages.module.js.map