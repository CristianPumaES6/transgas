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
exports.DailyReport = void 0;
const typeorm_1 = require("typeorm");
const port_entity_1 = require("./port.entity");
let DailyReport = class DailyReport {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DailyReport.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DailyReport.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DailyReport.prototype, "portId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => port_entity_1.Port, port => port.id),
    __metadata("design:type", port_entity_1.Port)
], DailyReport.prototype, "port", void 0);
__decorate([
    typeorm_1.Column({ default: "Otros" }),
    __metadata("design:type", String)
], DailyReport.prototype, "activityPerformed", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], DailyReport.prototype, "date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DailyReport.prototype, "hour", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "bunkeringIfo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "bunkeringMgo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "mplaIfo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "auxIfo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "boilerIfo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "otherIfo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "mplaMgo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "auxMgo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "boilerMgo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "ppMgo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "giMgo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "otherMgo", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "steamingTime", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], DailyReport.prototype, "distance", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DailyReport.prototype, "beaufour", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DailyReport.prototype, "observation", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DailyReport.prototype, "userIdCreated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DailyReport.prototype, "dateCreated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], DailyReport.prototype, "userIdUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], DailyReport.prototype, "dateUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Boolean)
], DailyReport.prototype, "status", void 0);
DailyReport = __decorate([
    typeorm_1.Entity()
], DailyReport);
exports.DailyReport = DailyReport;
//# sourceMappingURL=daily-report.entity.js.map