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
exports.SendMessageEntity = void 0;
const typeorm_1 = require("typeorm");
let SendMessageEntity = class SendMessageEntity {
    constructor(id, userId, emails, typeSend, html, sendAutomatic, userIdCreated, dateCreated, userIdUpdated, dateUpdated, status) {
        this.id = id || null;
        this.userId = userId || null;
        this.emails = emails || '';
        this.typeSend = typeSend || '';
        this.html = html || '';
        this.sendAutomatic = sendAutomatic || false;
        this.userIdCreated = userIdCreated || null;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || null;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
    }
};
exports.SendMessageEntity = SendMessageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SendMessageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SendMessageEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SendMessageEntity.prototype, "emails", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SendMessageEntity.prototype, "typeSend", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 2000 }),
    __metadata("design:type", String)
], SendMessageEntity.prototype, "html", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SendMessageEntity.prototype, "sendAutomatic", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SendMessageEntity.prototype, "userIdCreated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SendMessageEntity.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SendMessageEntity.prototype, "userIdUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SendMessageEntity.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], SendMessageEntity.prototype, "status", void 0);
exports.SendMessageEntity = SendMessageEntity = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Boolean, Number, String, Number, String, Boolean])
], SendMessageEntity);
//# sourceMappingURL=send-message.entity.js.map