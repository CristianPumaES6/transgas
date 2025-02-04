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
exports.OilPriceHistory = void 0;
const typeorm_1 = require("typeorm");
let OilPriceHistory = class OilPriceHistory {
    constructor(id, userId, entityOilId, price, typeCurrency, effectiveDate, userIdCreated, dateCreated, userIdUpdated, dateUpdated, status) {
        this.SyncStatus = '';
        this.id = id || null;
        this.userId = userId || null;
        this.entityOilId = entityOilId || null;
        this.price = price || 0;
        this.typeCurrency = typeCurrency || '';
        this.effectiveDate = effectiveDate || '';
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }
};
exports.OilPriceHistory = OilPriceHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OilPriceHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], OilPriceHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], OilPriceHistory.prototype, "entityOilId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 8,
        default: 0,
        nullable: true,
    }),
    __metadata("design:type", Number)
], OilPriceHistory.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OilPriceHistory.prototype, "typeCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], OilPriceHistory.prototype, "effectiveDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OilPriceHistory.prototype, "userIdCreated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OilPriceHistory.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], OilPriceHistory.prototype, "userIdUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OilPriceHistory.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], OilPriceHistory.prototype, "status", void 0);
exports.OilPriceHistory = OilPriceHistory = __decorate([
    (0, typeorm_1.Entity)('oilPriceHistory'),
    __metadata("design:paramtypes", [Number, Number, Number, Number, String, String, Number, String, Number, String, Boolean])
], OilPriceHistory);
//# sourceMappingURL=oilPriceHistory.entity.js.map