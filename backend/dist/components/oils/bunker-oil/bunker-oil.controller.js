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
exports.BunkerOilController = void 0;
const common_1 = require("@nestjs/common");
const jwtDecode_assets_1 = require("../../../assets/jwtDecode.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const bunker_oil_service_1 = require("./bunker-oil.service");
const buker_oil_entity_1 = require("../../../models/buker-oil.entity");
let BunkerOilController = class BunkerOilController {
    constructor(_BunkerOilService) {
        this._BunkerOilService = _BunkerOilService;
    }
    Gets(headers, bunkerOilEntity) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            if (bunkerOilEntity) {
                bunkerOilEntity.userId = Number(bunkerOilEntity.userId);
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (bunkerOilEntity.userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
            return this._BunkerOilService.Gets(bunkerOilEntity);
        }).then((results) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: results
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_1.HttpException({
                status: common_1.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_1.HttpStatus.ACCEPTED);
        });
    }
};
exports.BunkerOilController = BunkerOilController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, buker_oil_entity_1.BunkerOil]),
    __metadata("design:returntype", Promise)
], BunkerOilController.prototype, "Gets", null);
exports.BunkerOilController = BunkerOilController = __decorate([
    (0, common_1.Controller)('bunker-oil'),
    __metadata("design:paramtypes", [bunker_oil_service_1.BunkerOilService])
], BunkerOilController);
//# sourceMappingURL=bunker-oil.controller.js.map