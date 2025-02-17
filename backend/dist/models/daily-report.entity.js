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
exports.InfoReport_IFO_AND_MGO = exports.InfoFuelStartEndForDate = exports.GetReportVoyagePortDaily = exports.GetInfoBunkering = exports.GetInfoVoyageROBBunkering = exports.GetROBByUser = exports.DailyReport = void 0;
const typeorm_1 = require("typeorm");
const port_entity_1 = require("./port.entity");
let DailyReport = class DailyReport {
};
exports.DailyReport = DailyReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DailyReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyReport.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyReport.prototype, "portId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => port_entity_1.Port, port => port.id),
    __metadata("design:type", port_entity_1.Port)
], DailyReport.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReport.prototype, "north_degree", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReport.prototype, "north_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '', nullable: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "north_north_south", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReport.prototype, "east_degree", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReport.prototype, "east_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '', nullable: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "east_east_west", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'OTHER_ACT' }),
    __metadata("design:type", String)
], DailyReport.prototype, "activityPerformed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '', nullable: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "typeActivityPerformed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '', nullable: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "nextActivityPerformed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '', nullable: false }),
    __metadata("design:type", String)
], DailyReport.prototype, "speedStraction", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReport.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReport.prototype, "hour", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "bunkeringIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "bunkeringMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "mplaIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "auxIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "boilerIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "otherIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "mplaMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "auxMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "boilerMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "ppMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "giMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "otherMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "steamingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReport.prototype, "beaufour", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReport.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyReport.prototype, "userIdCreated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReport.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], DailyReport.prototype, "userIdUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], DailyReport.prototype, "status", void 0);
exports.DailyReport = DailyReport = __decorate([
    (0, typeorm_1.Entity)()
], DailyReport);
class GetROBByUser {
}
exports.GetROBByUser = GetROBByUser;
class GetInfoVoyageROBBunkering {
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
exports.GetInfoVoyageROBBunkering = GetInfoVoyageROBBunkering;
class GetInfoBunkering {
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
exports.GetInfoBunkering = GetInfoBunkering;
class GetReportVoyagePortDaily {
    constructor(userId, year, voyageId, voyageNumber, portId, portNumber, departurePort, arrivalPort, dailyReportId, date, hour, steamingTime, activityPerformed, typeActivityPerformed, speedStraction, observation, distance, beaufour, mplaIfo, auxIfo, boilerIfo, otherIfo, bunkeringIfo, mplaMgo, auxMgo, boilerMgo, ppMgo, giMgo, otherMgo, bunkeringMgo, north_degree, north_minutes, north_north_south, east_degree, east_minutes, east_east_west, navigatedTime) {
        this.userId = userId;
        this.year = year;
        this.voyageId = voyageId;
        this.voyageNumber = voyageNumber;
        this.portId = portId;
        this.portNumber = portNumber;
        this.departurePort = departurePort;
        this.arrivalPort = arrivalPort;
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
        this.mplaIfo = mplaIfo || 0;
        this.auxIfo = auxIfo || 0;
        this.boilerIfo = boilerIfo || 0;
        this.otherIfo = otherIfo || 0;
        this.bunkeringIfo = bunkeringIfo || 0;
        this.mplaMgo = mplaMgo || 0;
        this.auxMgo = auxMgo || 0;
        this.boilerMgo = boilerMgo || 0;
        this.ppMgo = ppMgo || 0;
        this.giMgo = giMgo || 0;
        this.otherMgo = otherMgo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;
        this.north_degree = north_degree || 0;
        this.north_minutes = north_minutes || 0;
        this.north_north_south = north_north_south || '';
        this.east_degree = east_degree || 0;
        this.east_minutes = east_minutes || 0;
        this.east_east_west = east_east_west || '';
        this.navigatedTime = navigatedTime || 0;
    }
}
exports.GetReportVoyagePortDaily = GetReportVoyagePortDaily;
class InfoFuelStartEndForDate {
    constructor(infoFuelStart, infoFuelEnd) {
        this.infoFuelStart = infoFuelStart;
        this.infoFuelEnd = infoFuelEnd;
        this.infoFuelStart = infoFuelStart || new GetROBByUser();
        this.infoFuelEnd = infoFuelEnd || new GetROBByUser();
    }
}
exports.InfoFuelStartEndForDate = InfoFuelStartEndForDate;
class InfoReport_IFO_AND_MGO {
    constructor(ifo, mgo) {
        this.ifo = ifo;
        this.mgo = mgo;
        this.ifo = [];
        this.mgo = [];
    }
}
exports.InfoReport_IFO_AND_MGO = InfoReport_IFO_AND_MGO;
//# sourceMappingURL=daily-report.entity.js.map