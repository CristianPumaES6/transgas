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
exports.DataModuleCombustible = exports.ImportVoyage = exports.VoyageFilterByYears = exports.Voyage = void 0;
const typeorm_1 = require("typeorm");
const port_entity_1 = require("./port.entity");
let Voyage = class Voyage {
};
exports.Voyage = Voyage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Voyage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => port_entity_1.Port, port => port.voyage),
    __metadata("design:type", Array)
], Voyage.prototype, "ports", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Voyage.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Voyage.prototype, "voyageNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Voyage.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Voyage.prototype, "userIdCreated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Voyage.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Voyage.prototype, "userIdUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Voyage.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], Voyage.prototype, "status", void 0);
exports.Voyage = Voyage = __decorate([
    (0, typeorm_1.Entity)()
], Voyage);
class VoyageFilterByYears {
}
exports.VoyageFilterByYears = VoyageFilterByYears;
class ImportVoyage {
}
exports.ImportVoyage = ImportVoyage;
class DataModuleCombustible {
    constructor(userId, listVoyages, listPorts, listDailyReports, listDailyReportSummaries) {
        this.userId = userId || null;
        this.listVoyages = listVoyages || [];
        this.listPorts = listPorts || [];
        this.listDailyReports = listDailyReports || [];
        this.listDailyReportSummaries = listDailyReportSummaries || [];
    }
}
exports.DataModuleCombustible = DataModuleCombustible;
//# sourceMappingURL=voyage.entity.js.map