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
exports.GetLastPortAndTotalConsump = exports.Port = void 0;
const typeorm_1 = require("typeorm");
const daily_report_entity_1 = require("./daily-report.entity");
const voyage_entity_1 = require("./voyage.entity");
let Port = class Port {
};
exports.Port = Port;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Port.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Port.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Port.prototype, "voyageId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => voyage_entity_1.Voyage, voyage => voyage.id),
    __metadata("design:type", voyage_entity_1.Voyage)
], Port.prototype, "voyage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => daily_report_entity_1.DailyReport, dailyReport => dailyReport.port, {
        eager: true,
        cascade: true
    }),
    __metadata("design:type", Array)
], Port.prototype, "dailyReports", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Port.prototype, "portNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Port.prototype, "departurePort", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Port.prototype, "arrivalPort", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Port.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0, nullable: true }),
    __metadata("design:type", Number)
], Port.prototype, "startIFO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0, nullable: true }),
    __metadata("design:type", Number)
], Port.prototype, "startMGO", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Port.prototype, "userIdCreated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Port.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Port.prototype, "userIdUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Port.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], Port.prototype, "status", void 0);
exports.Port = Port = __decorate([
    (0, typeorm_1.Entity)()
], Port);
class GetLastPortAndTotalConsump {
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
exports.GetLastPortAndTotalConsump = GetLastPortAndTotalConsump;
//# sourceMappingURL=port.entity.js.map