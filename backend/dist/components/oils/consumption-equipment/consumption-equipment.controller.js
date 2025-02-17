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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumptionEquipmentController = void 0;
const common_1 = require("@nestjs/common");
const promises_assets_1 = require("../../../assets/promises.assets");
const jwtDecode_assets_1 = require("../../../assets/jwtDecode.assets");
const consumption_equipment_service_1 = require("./consumption-equipment.service");
const consumptionEquipment_entity_1 = require("../../../models/consumptionEquipment.entity");
let ConsumptionEquipmentController = class ConsumptionEquipmentController {
    constructor(_ConsumptionEquipmentService) {
        this._ConsumptionEquipmentService = _ConsumptionEquipmentService;
    }
    Gets(headers, consumptionEquipment) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)()
            .then((resultDummy) => {
            if (consumptionEquipment) {
                consumptionEquipment.userId = Number(consumptionEquipment.userId);
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        })
            .then((resultValidate) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (consumptionEquipment.userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
            return this._ConsumptionEquipmentService.Gets(consumptionEquipment);
        })
            .then((results) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: results,
            };
        })
            .catch(err => {
            const clientMsg = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
            const errorMsg = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
};
exports.ConsumptionEquipmentController = ConsumptionEquipmentController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, consumptionEquipment_entity_1.ConsumptionEquipmentEntity]),
    __metadata("design:returntype", Promise)
], ConsumptionEquipmentController.prototype, "Gets", null);
exports.ConsumptionEquipmentController = ConsumptionEquipmentController = __decorate([
    (0, common_1.Controller)('consumption-equipment'),
    __metadata("design:paramtypes", [consumption_equipment_service_1.ConsumptionEquipmentService])
], ConsumptionEquipmentController);
//# sourceMappingURL=consumption-equipment.controller.js.map