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
exports.DailyReportSummary = void 0;
const typeorm_1 = require("typeorm");
let DailyReportSummary = class DailyReportSummary {
};
exports.DailyReportSummary = DailyReportSummary;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "date_ETA", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "latitud_degree", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "latitud_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "latitud_north_south", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "longitude_degree", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "longitude_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "longitude_east_west", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "typeOfEvent", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "voyageId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "voyage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "portId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "port_Departure", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "port_Arrive", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "loadingCondition", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "voyComment", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "timeElapsed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "timeElapsedSailing", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "distanceSailed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "nauticalMile", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "navigationObservations", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "bunkeringIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "bunkeringMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "mplaIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "auxIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "boilerIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "otherIfo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "mplaMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "auxMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "boilerMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "ppMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "giMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "otherMgo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "rob_Mgo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "rob_Ifo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "load_Power", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: '',
        nullable: true,
    }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "engine_Distance", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "userIdCreated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], DailyReportSummary.prototype, "userIdUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DailyReportSummary.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], DailyReportSummary.prototype, "status", void 0);
exports.DailyReportSummary = DailyReportSummary = __decorate([
    (0, typeorm_1.Entity)()
], DailyReportSummary);
//# sourceMappingURL=dailyReportSummary.entity.js.map