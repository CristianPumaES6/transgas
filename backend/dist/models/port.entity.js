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
exports.Port = void 0;
const typeorm_1 = require("typeorm");
const daily_report_entity_1 = require("./daily-report.entity");
const voyage_entity_1 = require("./voyage.entity");
let Port = class Port {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Port.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Port.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Port.prototype, "voyageId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => voyage_entity_1.Voyage, voyage => voyage.id),
    __metadata("design:type", voyage_entity_1.Voyage)
], Port.prototype, "voyage", void 0);
__decorate([
    typeorm_1.OneToMany(type => daily_report_entity_1.DailyReport, dailyReport => dailyReport.port, {
        eager: true,
        cascade: true
    }),
    __metadata("design:type", Array)
], Port.prototype, "dailyReports", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Port.prototype, "portNumber", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Port.prototype, "departurePort", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Port.prototype, "arrivalPort", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Port.prototype, "userIdCreated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Port.prototype, "dateCreated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Port.prototype, "userIdUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Port.prototype, "dateUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Boolean)
], Port.prototype, "status", void 0);
Port = __decorate([
    typeorm_1.Entity()
], Port);
exports.Port = Port;
//# sourceMappingURL=port.entity.js.map