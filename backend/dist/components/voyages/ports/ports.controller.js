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
exports.PortsController = void 0;
const common_1 = require("@nestjs/common");
const jwtDecode_assets_1 = require("../../../assets/jwtDecode.assets");
const moment_assets_1 = require("../../../assets/moment.assets");
const promises_assets_1 = require("../../../assets/promises.assets");
const port_entity_1 = require("../../../models/port.entity");
const ports_service_1 = require("./ports.service");
let PortsController = class PortsController {
    constructor(_portsService) {
        this._portsService = _portsService;
    }
    GetLastPortAndTotalConsump(userId) {
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            return this._portsService.GetLastPortTotalConsumpByUserId(userId);
        }).then((results) => {
            let getLastPortAndTotalConsump = new port_entity_1.GetLastPortAndTotalConsump();
            results.forEach(element => {
                getLastPortAndTotalConsump.portId = element.portId || 0;
                getLastPortAndTotalConsump.userId = element.userId || 0;
                getLastPortAndTotalConsump.departurePort = element.departurePort || '';
                getLastPortAndTotalConsump.arrivalPort = element.arrivalPort || '';
                getLastPortAndTotalConsump.startDate = element.startDate || '';
                getLastPortAndTotalConsump.startIFO = element.startIFO || 0;
                getLastPortAndTotalConsump.startMGO = element.startMGO || 0;
                getLastPortAndTotalConsump.lastDate = element.maxDate || '';
                getLastPortAndTotalConsump.bunkeringIfo = element.bunkeringIfo || 0;
                getLastPortAndTotalConsump.bunkeringMgo = element.bunkeringMgo || 0;
                getLastPortAndTotalConsump.mplaIfo = element.mplaIfo || 0;
                getLastPortAndTotalConsump.auxIfo = element.auxIfo || 0;
                getLastPortAndTotalConsump.boilerIfo = element.boilerIfo || 0;
                getLastPortAndTotalConsump.otherIfo = element.otherIfo || 0;
                getLastPortAndTotalConsump.mplaMgo = element.mplaMgo || 0;
                getLastPortAndTotalConsump.auxMgo = element.auxMgo || 0;
                getLastPortAndTotalConsump.boilerMgo = element.boilerMgo || 0;
                getLastPortAndTotalConsump.ppMgo = element.ppMgo || 0;
                getLastPortAndTotalConsump.giMgo = element.giMgo || 0;
                getLastPortAndTotalConsump.otherMgo = element.otherMgo || 0;
                getLastPortAndTotalConsump.distance = element.distance || 0;
            });
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: getLastPortAndTotalConsump
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
    async GetsDetail(headers, port) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (port && port.userId) {
                port.userId = Number(port.userId);
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            if (headerToken.role === 'ADMIN' || headerToken.role === 'SUPPORT') {
            }
            else if (port.userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
            return this._portsService.GetsDetail(port);
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
    async Get(headers, id) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(id)) {
                let portId = Number(id);
                return this._portsService.Get(portId);
            }
            else {
                throw 'MISSING_FIELS';
            }
        }).then((resultGet) => {
            if (headerToken.role === 'ADMIN' || headerToken.role === 'SUPPORT') {
            }
            else if (Number(resultGet.userId) !== Number(headerToken.id)) {
                throw new Error('ERROR_USERID_FAIL');
            }
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
    async Gets(headers, port) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (port && port.userId) {
                port.userId = Number(port.userId);
                return true;
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            if (headerToken.role === 'ADMIN' || headerToken.role === 'SUPPORT') {
            }
            else if (port.userId !== headerToken.id)
                throw new Error('ERROR_USERID_FAIL');
            return this._portsService.Gets(port);
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
    async CreatePort(headers, port) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (port && port.userId && Number(port.portNumber) && port.departurePort && headerToken && headerToken.id) {
                if (headerToken.role !== 'ADMIN' && headerToken.role !== 'SUPPORT') {
                    if (Number(headerToken.id) !== Number(port.userId))
                        throw new Error('ERROR_USERID_FAIL');
                }
                delete port.id;
                port.userIdCreated = headerToken.id;
                port.dateCreated = moment_assets_1.GetDate();
                delete port.userIdUpdated;
                delete port.dateUpdated;
                port.status = Boolean(port.status);
                return this._portsService.Create(port);
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
    async Update(headers, id, port) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (port && port.userId && port.portNumber && port.departurePort && headerToken && headerToken.id) {
                if (headerToken.role === 'BUQUE') {
                    if (Number(headerToken.id) !== Number(port.userId))
                        throw new Error('ERROR_USERID_FAIL');
                }
                delete port.userIdCreated;
                delete port.dateCreated;
                port.userIdUpdated = headerToken.id;
                port.dateUpdated = moment_assets_1.GetDate();
                port.status = Boolean(port.status);
                return this._portsService.Update(port);
            }
            else {
                throw 'MISSING_FIELS';
            }
        }).then((resultUpdate) => {
            if (!resultUpdate)
                throw new Error('TYPEORM_UPDATE_VOYAGE');
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
                return this._portsService.Get(id);
            }
            else {
                throw new Error('MISSING_FIELS');
            }
        }).then((result) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (Number(headerToken.id) !== Number(result.userId))
                throw new Error('ERROR_USERID_FAIL');
            delete result.dailyReports;
            result.status = false;
            delete result.userIdCreated;
            delete result.dateCreated;
            result.userIdUpdated = headerToken.id;
            result.dateUpdated = moment_assets_1.GetDate();
            return this._portsService.Delete(result);
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
    common_1.Get('getLastPortAndTotalConsump/:userId'),
    __param(0, common_1.Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "GetLastPortAndTotalConsump", null);
__decorate([
    common_1.Get('detail'),
    __param(0, common_1.Headers()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, port_entity_1.Port]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "GetsDetail", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "Get", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Headers()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, port_entity_1.Port]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "Gets", null);
__decorate([
    common_1.Post('create'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, port_entity_1.Port]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "CreatePort", null);
__decorate([
    common_1.Put(':id/update'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, port_entity_1.Port]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "Update", null);
__decorate([
    common_1.Delete(':id/delete'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "Delete", null);
PortsController = __decorate([
    common_1.Controller('ports'),
    __metadata("design:paramtypes", [ports_service_1.PortsService])
], PortsController);
exports.PortsController = PortsController;
//# sourceMappingURL=ports.controller.js.map