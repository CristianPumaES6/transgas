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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity {
    constructor(id, nick, name, filename, password, language, role, years, minSpeed, maxSpeed, isConsumptionIFO, isConsumptionLSFO, isConsumptionMGO, maxIFOConsumption, maxMGOConsumption, minIFOConsumption, minMGOConsumption, isMEMGO, isAEMGO, isBoilerMGO, isIGMGO, isPowerPMGO, isOtherMGO, isMEIFO, isAEIFO, isBoilerIFO, isOtherIFO, contractSpeedSailingBallastMGO, contractSpeedSailingLadenMGO, contractSpeedSailingEconomicalMGO, loadingConsumptionMGO, dischargeConsumptionMGO, sailingBallastConsumptionMGO, sailingLoadConsumptionMGO, sailingEconomicConsumptionMGO, anchoredConsumptionMGO, maneuverConsumptionMGO, otherConsumptionMGO, contractSpeedSailingBallastIFO, contractSpeedSailingLadenIFO, contractSpeedSailingEconomicalIFO, loadingConsumptionIFO, dischargeConsumptionIFO, sailingBallastConsumptionIFO, sailingLoadConsumptionIFO, sailingEconomicConsumptionIFO, anchoredConsumptionIFO, maneuverConsumptionIFO, otherConsumptionIFO, isDisplayLSFOConsumption, isDisplayMGOConsumption, isDisplayAverageSpeed, isDisplayDataMGO, isDisplayDataLSFO, isDisplayVesselPerformanceLSFO, isDisplayVesselPerformanceMGO, consumptionEquipmentME_MGO, consumptionEquipmentAE_MGO, consumptionEquipmentBOILER_MGO, consumptionEquipmentIG_MGO, consumptionEquipmentPP_MGO, consumptionEquipmentOther_MGO, consumptionEquipmentME_IFO, consumptionEquipmentAE_IFO, consumptionEquipmentBOILER_IFO, consumptionEquipmentOther_IFO, userIdCreated, dateCreated, userIdUpdated, dateUpdated, status) {
        this.id = id || null;
        this.nick = nick || '';
        this.name = name || '';
        this.filename = filename || '';
        this.password = password || '';
        this.language = language || '';
        this.role = role || '';
        this.years = years || '';
        this.minSpeed = minSpeed || 0;
        this.maxSpeed = maxSpeed || 0;
        this.isConsumptionIFO = isConsumptionIFO || false;
        this.isConsumptionLSFO = isConsumptionLSFO || false;
        this.isConsumptionMGO = isConsumptionMGO || false;
        this.maxIFOConsumption = maxIFOConsumption || 0;
        this.maxMGOConsumption = maxMGOConsumption || 0;
        this.minIFOConsumption = minIFOConsumption || 0;
        this.minMGOConsumption = minMGOConsumption || 0;
        this.isMEMGO = isMEMGO || false;
        this.isAEMGO = isAEMGO || false;
        this.isBoilerMGO = isBoilerMGO || false;
        this.isIGMGO = isIGMGO || false;
        this.isPowerPMGO = isPowerPMGO || false;
        this.isOtherMGO = isOtherMGO || false;
        this.isMEIFO = isMEIFO || false;
        this.isAEIFO = isAEIFO || false;
        this.isBoilerIFO = isBoilerIFO || false;
        this.isOtherIFO = isOtherIFO || false;
        this.contractSpeedSailingBallastMGO = contractSpeedSailingBallastMGO || 0;
        this.contractSpeedSailingLadenMGO = contractSpeedSailingLadenMGO || 0;
        this.contractSpeedSailingEconomicalMGO = contractSpeedSailingEconomicalMGO || 0;
        this.loadingConsumptionMGO = loadingConsumptionMGO || 0;
        this.dischargeConsumptionMGO = dischargeConsumptionMGO || 0;
        this.sailingBallastConsumptionMGO = sailingBallastConsumptionMGO || 0;
        this.sailingLoadConsumptionMGO = sailingLoadConsumptionMGO || 0;
        this.sailingEconomicConsumptionMGO = sailingEconomicConsumptionMGO || 0;
        this.anchoredConsumptionMGO = anchoredConsumptionMGO || 0;
        this.maneuverConsumptionMGO = maneuverConsumptionMGO || 0;
        this.otherConsumptionMGO = otherConsumptionMGO || 0;
        this.contractSpeedSailingBallastIFO = contractSpeedSailingBallastIFO || 0;
        this.contractSpeedSailingLadenIFO = contractSpeedSailingLadenIFO || 0;
        this.contractSpeedSailingEconomicalIFO = contractSpeedSailingEconomicalIFO || 0;
        this.loadingConsumptionIFO = loadingConsumptionIFO || 0;
        this.dischargeConsumptionIFO = dischargeConsumptionIFO || 0;
        this.sailingBallastConsumptionIFO = sailingBallastConsumptionIFO || 0;
        this.sailingLoadConsumptionIFO = sailingLoadConsumptionIFO || 0;
        this.sailingEconomicConsumptionIFO = sailingEconomicConsumptionIFO || 0;
        this.anchoredConsumptionIFO = anchoredConsumptionIFO || 0;
        this.maneuverConsumptionIFO = maneuverConsumptionIFO || 0;
        this.otherConsumptionIFO = otherConsumptionIFO || 0;
        this.isDisplayLSFOConsumption = isDisplayLSFOConsumption || false;
        this.isDisplayMGOConsumption = isDisplayMGOConsumption || false;
        this.isDisplayAverageSpeed = isDisplayAverageSpeed || false;
        this.isDisplayDataMGO = isDisplayDataMGO || false;
        this.isDisplayDataLSFO = isDisplayDataLSFO || false;
        this.isDisplayVesselPerformanceLSFO = isDisplayVesselPerformanceLSFO || false;
        this.isDisplayVesselPerformanceMGO = isDisplayVesselPerformanceMGO || false;
        this.consumptionEquipmentME_MGO = consumptionEquipmentME_MGO || 0;
        this.consumptionEquipmentAE_MGO = consumptionEquipmentAE_MGO || 0;
        this.consumptionEquipmentBOILER_MGO = consumptionEquipmentBOILER_MGO || 0;
        this.consumptionEquipmentIG_MGO = consumptionEquipmentIG_MGO || 0;
        this.consumptionEquipmentPP_MGO = consumptionEquipmentPP_MGO || 0;
        this.consumptionEquipmentOther_MGO = consumptionEquipmentOther_MGO || 0;
        this.consumptionEquipmentME_IFO = consumptionEquipmentME_IFO || 0;
        this.consumptionEquipmentAE_IFO = consumptionEquipmentAE_IFO || 0;
        this.consumptionEquipmentBOILER_IFO = consumptionEquipmentBOILER_IFO || 0;
        this.consumptionEquipmentOther_IFO = consumptionEquipmentOther_IFO || 0;
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
], UserEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "nick", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "filename", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "language", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], UserEntity.prototype, "years", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "minSpeed", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "maxSpeed", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isConsumptionLSFO", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isConsumptionVLSFO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "maxIFOConsumption", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "maxMGOConsumption", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "minIFOConsumption", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "minMGOConsumption", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isMEMGO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isAEMGO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isBoilerMGO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isIGMGO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isPowerPMGO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isOtherMGO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isMEIFO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isAEIFO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isBoilerIFO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isOtherIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "contractSpeedSailingBallastMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "contractSpeedSailingLadenMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "contractSpeedSailingEconomicalMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "loadingConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "dischargeConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "sailingBallastConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "sailingLoadConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "sailingEconomicConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "anchoredConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "maneuverConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "otherConsumptionMGO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "contractSpeedSailingBallastIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "contractSpeedSailingLadenIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "contractSpeedSailingEconomicalIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "loadingConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "dischargeConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "sailingBallastConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "sailingLoadConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "sailingEconomicConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "anchoredConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "maneuverConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "otherConsumptionIFO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isDisplayLSFOConsumption", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isDisplayMGOConsumption", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isDisplayAverageSpeed", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isDisplayDataMGO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isDisplayDataLSFO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isDisplayVesselPerformanceLSFO", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isDisplayVesselPerformanceMGO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentME_MGO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentAE_MGO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentBOILER_MGO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentIG_MGO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentPP_MGO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentOther_MGO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentME_IFO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentAE_IFO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentBOILER_IFO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "consumptionEquipmentOther_IFO", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserEntity.prototype, "userIdCreated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserEntity.prototype, "dateCreated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], UserEntity.prototype, "userIdUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "dateUpdated", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "status", void 0);
UserEntity = __decorate([
    typeorm_1.Entity('User'),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, String, String, Number, Number, Boolean, Boolean, Boolean, Number, Number, Number, Number, Boolean, Boolean, Boolean, Boolean, Boolean, Boolean, Boolean, Boolean, Boolean, Boolean, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Boolean, Boolean, Boolean, Boolean, Boolean, Boolean, Boolean, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, Number, String, Number, String, Boolean])
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map