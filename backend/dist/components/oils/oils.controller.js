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
exports.OilsController = void 0;
const common_1 = require("@nestjs/common");
const oils_service_1 = require("./oils.service");
const promises_assets_1 = require("../../assets/promises.assets");
const oil_entity_1 = require("../../models/oil.entity");
const jwtDecode_assets_1 = require("../../assets/jwtDecode.assets");
const moment_assets_1 = require("../../assets/moment.assets");
let OilsController = class OilsController {
    constructor(_OilsService) {
        this._OilsService = _OilsService;
    }
    async Get(id) {
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(id)) {
                let userId = Number(id);
                return this._OilsService.Get(userId);
            }
            else {
                throw 'MISSING_FIELS';
            }
        }).then((resultGet) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultGet
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
    Gets(headers, oilEntity) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (oilEntity) {
                oilEntity.userId = Number(oilEntity.userId);
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (oilEntity.userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
            return this._OilsService.Gets(oilEntity);
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
    Create(headers, oilEntity) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (oilEntity && oilEntity.userId && oilEntity.name) {
                delete oilEntity.id;
                oilEntity.userIdCreated = headerToken.id;
                oilEntity.dateCreated = moment_assets_1.GetDate();
                delete oilEntity.userIdUpdated;
                delete oilEntity.dateUpdated;
                oilEntity.status = Boolean(oilEntity.status);
                return this._OilsService.Create(oilEntity);
            }
            else
                throw 'MISSING_FIELS';
        }).then((resultCreate) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultCreate
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
        ;
    }
    async Update(headers, id, oilEntity) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (oilEntity && oilEntity.name && headerToken && headerToken.id) {
                oilEntity.id = Number(id);
                if (headerToken.role === 'SUPPORT' || headerToken.role === 'ADMIN') {
                }
                else if (Number(headerToken.id) !== Number(oilEntity.userId))
                    throw new Error('ERROR_USERID_FAIL');
                oilEntity.name = oilEntity.name || '';
                delete oilEntity.userIdCreated;
                delete oilEntity.dateCreated;
                oilEntity.userIdUpdated = headerToken.id;
                oilEntity.dateUpdated = moment_assets_1.GetDate();
                oilEntity.status = Boolean(oilEntity.status);
                return this._OilsService.Update(oilEntity);
            }
            else {
                throw 'MISSING_FIELS';
            }
        }).then((resultUpdate) => {
            if (!resultUpdate)
                throw new Error('TYPEORM_UPDATE_OIL_DETAIL');
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultUpdate
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
    async Delete(headers, id) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(id)) {
                return this._OilsService.Get(id);
            }
            else {
                throw new Error('MISSING_FIELS');
            }
        }).then((result) => {
            result.status = false;
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (Number(headerToken.id) !== Number(result.userId))
                throw new Error('ERROR_USERID_FAIL');
            return this._OilsService.Delete(result, headerToken.id);
        }).then((resultDelete) => {
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: resultDelete
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
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Get", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Headers()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, oil_entity_1.OilEntity]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Gets", null);
__decorate([
    common_1.Post('create'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, oil_entity_1.OilEntity]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Create", null);
__decorate([
    common_1.Put(':id/update'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, oil_entity_1.OilEntity]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Update", null);
__decorate([
    common_1.Delete(':id/delete'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OilsController.prototype, "Delete", null);
OilsController = __decorate([
    common_1.Controller('oils'),
    __metadata("design:paramtypes", [oils_service_1.OilsService])
], OilsController);
exports.OilsController = OilsController;
//# sourceMappingURL=oils.controller.js.map