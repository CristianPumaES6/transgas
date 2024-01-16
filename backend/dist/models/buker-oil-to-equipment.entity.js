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
exports.BunkerOilToEquipmentEntity = void 0;
const typeorm_1 = require("typeorm");
let BunkerOilToEquipmentEntity = class BunkerOilToEquipmentEntity {
    constructor(id, userId, entityEquipmentId, entityOilId, bunker, comment, datetime, userIdCreated, dateCreated, userIdUpdated, dateUpdated, status) {
        this.SyncStatus = "";
        this.id = id || null;
        this.userId = userId || null;
        this.entityEquipmentId = entityEquipmentId || 0;
        this.entityOilId = entityOilId || 0;
        this.bunker = bunker || 0;
        this.comment = comment || '';
        this.datetime = datetime || '';
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BunkerOilToEquipmentEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], BunkerOilToEquipmentEntity.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], BunkerOilToEquipmentEntity.prototype, "entityEquipmentId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], BunkerOilToEquipmentEntity.prototype, "entityOilId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BunkerOilToEquipmentEntity.prototype, "bunker", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BunkerOilToEquipmentEntity.prototype, "comment", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], BunkerOilToEquipmentEntity.prototype, "datetime", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BunkerOilToEquipmentEntity.prototype, "userIdCreated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BunkerOilToEquipmentEntity.prototype, "dateCreated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], BunkerOilToEquipmentEntity.prototype, "userIdUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], BunkerOilToEquipmentEntity.prototype, "dateUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Boolean)
], BunkerOilToEquipmentEntity.prototype, "status", void 0);
BunkerOilToEquipmentEntity = __decorate([
    typeorm_1.Entity('bunkerOilToEquipment'),
    __metadata("design:paramtypes", [Number, Number, Number, Number, Number, String, String, Number, String, Number, String, Boolean])
], BunkerOilToEquipmentEntity);
exports.BunkerOilToEquipmentEntity = BunkerOilToEquipmentEntity;
//# sourceMappingURL=buker-oil-to-equipment.entity.js.map