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
exports.TypeOfOilEquipmentEntity = void 0;
const typeorm_1 = require("typeorm");
let TypeOfOilEquipmentEntity = class TypeOfOilEquipmentEntity {
    constructor(id, userId, equipment, entityGroupId, userIdCreated, dateCreated, userIdUpdated, dateUpdated, status) {
        this.SyncStatus = "";
        this.id = id || null;
        this.userId = userId || null;
        this.equipment = equipment || '';
        this.entityGroupId = entityGroupId || 0;
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
], TypeOfOilEquipmentEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], TypeOfOilEquipmentEntity.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], TypeOfOilEquipmentEntity.prototype, "equipment", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], TypeOfOilEquipmentEntity.prototype, "entityGroupId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TypeOfOilEquipmentEntity.prototype, "userIdCreated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeOfOilEquipmentEntity.prototype, "dateCreated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], TypeOfOilEquipmentEntity.prototype, "userIdUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], TypeOfOilEquipmentEntity.prototype, "dateUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Boolean)
], TypeOfOilEquipmentEntity.prototype, "status", void 0);
TypeOfOilEquipmentEntity = __decorate([
    typeorm_1.Entity('typeOfOilEquipment'),
    __metadata("design:paramtypes", [Number, Number, String, Number, Number, String, Number, String, Boolean])
], TypeOfOilEquipmentEntity);
exports.TypeOfOilEquipmentEntity = TypeOfOilEquipmentEntity;
//# sourceMappingURL=type-of-oils-equipment.entity.js.map