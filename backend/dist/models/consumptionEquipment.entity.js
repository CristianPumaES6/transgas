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
exports.ConsumptionEquipmentEntity = void 0;
const typeorm_1 = require("typeorm");
let ConsumptionEquipmentEntity = class ConsumptionEquipmentEntity {
    constructor(id, userId, date, amount, hourConsumption, observation, entityEquipmentOilCompatibilityId, consumptionTypeId, entityOilAnalysisId, userIdCreated, dateCreated, userIdUpdated, dateUpdated, status) {
        this.SyncStatus = "";
        this.id = id || null;
        this.userId = userId || null;
        this.date = date || '';
        this.amount = amount || 0;
        this.hourConsumption = hourConsumption || 0;
        this.observation = observation || '';
        this.entityEquipmentOilCompatibilityId = entityEquipmentOilCompatibilityId || 0;
        this.consumptionTypeId = consumptionTypeId || 0;
        this.entityOilAnalysisId = entityOilAnalysisId || 0;
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }
};
exports.ConsumptionEquipmentEntity = ConsumptionEquipmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], ConsumptionEquipmentEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "hourConsumption", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ConsumptionEquipmentEntity.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: 0 }),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "entityEquipmentOilCompatibilityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: 0 }),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "consumptionTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: 0 }),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "entityOilAnalysisId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "userIdCreated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ConsumptionEquipmentEntity.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ConsumptionEquipmentEntity.prototype, "userIdUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ConsumptionEquipmentEntity.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], ConsumptionEquipmentEntity.prototype, "status", void 0);
exports.ConsumptionEquipmentEntity = ConsumptionEquipmentEntity = __decorate([
    (0, typeorm_1.Entity)('consumptionEquipment'),
    __metadata("design:paramtypes", [Number, Number, String, Number, Number, String, Number, Number, Number, Number, String, Number, String, Boolean])
], ConsumptionEquipmentEntity);
//# sourceMappingURL=consumptionEquipment.entity.js.map