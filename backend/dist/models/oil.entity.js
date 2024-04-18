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
exports.SaveDateOils = exports.OilEntity = void 0;
const typeorm_1 = require("typeorm");
let OilEntity = class OilEntity {
    constructor(id, userId, name, userIdCreated, dateCreated, userIdUpdated, dateUpdated, status) {
        this.SyncStatus = "";
        this.id = id || null;
        this.userId = userId || null;
        this.name = name || '';
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
], OilEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], OilEntity.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], OilEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OilEntity.prototype, "userIdCreated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OilEntity.prototype, "dateCreated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], OilEntity.prototype, "userIdUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OilEntity.prototype, "dateUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Boolean)
], OilEntity.prototype, "status", void 0);
OilEntity = __decorate([
    typeorm_1.Entity('oil'),
    __metadata("design:paramtypes", [Number, Number, String, Number, String, Number, String, Boolean])
], OilEntity);
exports.OilEntity = OilEntity;
class SaveDateOils {
    constructor(userId, listGroups, listTypeOfOilEquipment, listConsumptionEquipment, listBunkerOil, listOil) {
        this.userId = userId || null;
        this.listGroups = listGroups || [];
        this.listTypeOfOilEquipment = listTypeOfOilEquipment || [];
        this.listConsumptionEquipment = listConsumptionEquipment || [];
        this.listBunkerOil = listBunkerOil || [];
        this.listOils = listOil || [];
    }
}
exports.SaveDateOils = SaveDateOils;
//# sourceMappingURL=oil.entity.js.map