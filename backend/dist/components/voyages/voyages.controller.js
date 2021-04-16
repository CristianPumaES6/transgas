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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKey = exports.Mapping = exports.VoyagesController = void 0;
const common_1 = require("@nestjs/common");
const promises_assets_1 = require("../../assets/promises.assets");
const jwtDecode_assets_1 = require("../../assets/jwtDecode.assets");
const voyages_service_1 = require("./voyages.service");
const voyage_entity_1 = require("../../models/voyage.entity");
const moment_assets_1 = require("../../assets/moment.assets");
const port_entity_1 = require("../../models/port.entity");
const ports_service_1 = require("./ports/ports.service");
const daily_report_entity_1 = require("../../models/daily-report.entity");
const daily_reports_service_1 = require("./daily-reports/daily-reports.service");
let VoyagesController = class VoyagesController {
    constructor(_voyagesService, _portsService, _dailyReportsService) {
        this._voyagesService = _voyagesService;
        this._portsService = _portsService;
        this._dailyReportsService = _dailyReportsService;
    }
    async GetsByYear(headers, voyageFilterByYears) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (voyageFilterByYears) {
                if (!voyageFilterByYears.userId) {
                    throw new Error('MISSING_FIELS');
                }
                else {
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' || headerToken.role == 'OWNER') {
                    }
                    else if ((Number(voyageFilterByYears.userId) !== Number(headerToken.id)))
                        throw new Error('ERROR_USERID_FAIL');
                    return true;
                }
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            voyageFilterByYears.years = JSON.parse('' + voyageFilterByYears.years);
            return this._voyagesService.GetsByYears(voyageFilterByYears);
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
    async GetsDetail(headers, voyage, page) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (voyage) {
                if (!voyage.userId) {
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        return true;
                    }
                    else
                        throw new Error('MISSING_FIELS');
                }
                else {
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    }
                    else if ((Number(voyage.userId) !== Number(headerToken.id)))
                        throw new Error('ERROR_USERID_FAIL');
                    return true;
                }
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            return this._voyagesService.GetsDetails(voyage, page);
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
    async Get(id) {
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(id)) {
                let voyageId = Number(id);
                return this._voyagesService.Get(voyageId);
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
    async Gets(headers, voyage, page) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (voyage) {
                if (!voyage.userId) {
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        return true;
                    }
                    else
                        throw new Error('MISSING_FIELS');
                }
                else {
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    }
                    else if (Number(voyage.userId) !== Number(headerToken.id))
                        throw new Error('ERROR_USERID_FAIL');
                    return true;
                }
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            return this._voyagesService.Gets(voyage, page);
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
    async CreateVoyage(headers, voyage) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (voyage && Number(voyage.userId) && Number(voyage.voyageNumber) && Number(voyage.year) && headerToken && headerToken.id) {
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                }
                else if (voyage.userId !== headerToken.id)
                    throw new Error('ERROR_USERID_FAIL');
                delete voyage.id;
                voyage.userIdCreated = headerToken.id;
                voyage.dateCreated = moment_assets_1.getDate();
                delete voyage.userIdUpdated;
                delete voyage.dateUpdated;
                voyage.status = Boolean(voyage.status);
                return this._voyagesService.Create(voyage);
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
    }
    async Update(headers, id, voyage) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (voyage && voyage.userId && voyage.voyageNumber && voyage.year && headerToken && headerToken.id) {
                voyage.id = Number(id);
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                }
                else if (Number(headerToken.id) !== Number(voyage.userId))
                    throw new Error('ERROR_USERID_FAIL');
                delete voyage.userIdCreated;
                delete voyage.dateCreated;
                voyage.userIdUpdated = headerToken.id;
                voyage.dateUpdated = moment_assets_1.getDate();
                voyage.status = Boolean(voyage.status);
                return this._voyagesService.Update(voyage);
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
    async DeletePort(headers, id) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (Number(id)) {
                return this._voyagesService.Get(id);
            }
            else {
                throw new Error('MISSING_FIELS');
            }
        }).then((result) => {
            if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
            }
            else if (Number(headerToken.id) !== Number(result.userId))
                throw new Error('ERROR_USERID_FAIL');
            result.status = false;
            delete result.userIdCreated;
            delete result.dateCreated;
            result.userIdUpdated = headerToken.id;
            result.dateUpdated = moment_assets_1.getDate();
            return this._voyagesService.Delete(result);
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
    async ImportJSONVoyages(headers, ImportVoyages) {
        var e_1, _a;
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        if (!(headerToken.role === 'SUPPORT')) {
            return 'HOLA QUE HACES? Escribeme WSP => +51976873362';
        }
        let MappingVoyage = [];
        let MappingPort = [];
        try {
            for (var ImportVoyages_1 = __asyncValues(ImportVoyages), ImportVoyages_1_1; ImportVoyages_1_1 = await ImportVoyages_1.next(), !ImportVoyages_1_1.done;) {
                const importVoyage = ImportVoyages_1_1.value;
                let existeViaje = searchKey(MappingVoyage, importVoyage.NV);
                if (!existeViaje) {
                    let voyageExistente = await this._voyagesService.ThisVoyageNumberExists(importVoyage.NV, importVoyage.year);
                    if (!voyageExistente) {
                        let newVoyage = new voyage_entity_1.Voyage();
                        delete newVoyage.id;
                        newVoyage.userId = importVoyage.USERID;
                        newVoyage.year = importVoyage.year;
                        newVoyage.userIdCreated = headerToken.id;
                        newVoyage.dateCreated = moment_assets_1.getDate();
                        delete newVoyage.userIdUpdated;
                        delete newVoyage.dateUpdated;
                        newVoyage.status = true;
                        let voyageRegister = await this._voyagesService.Create(newVoyage);
                        MappingVoyage.push(new Mapping(importVoyage.NV, voyageRegister.id));
                        MappingPort = [];
                    }
                    else {
                        MappingVoyage.push(new Mapping(importVoyage.NV, voyageExistente.id));
                    }
                }
                existeViaje = searchKey(MappingVoyage, importVoyage.NV);
                let existePort = searchKey(MappingPort, importVoyage.NP);
                if (!existePort) {
                    let portExiste = await this._portsService.ThereIsThisPortInTheVoyage(importVoyage.NP, existeViaje.value);
                    if (!portExiste) {
                        let newPort = new port_entity_1.Port();
                        delete newPort.id;
                        newPort.userId = importVoyage.USERID;
                        newPort.voyageId = existeViaje.value;
                        newPort.departurePort = importVoyage.Departure;
                        newPort.arrivalPort = importVoyage.Arrival;
                        newPort.userIdCreated = headerToken.id;
                        newPort.dateCreated = moment_assets_1.getDate();
                        delete newPort.userIdUpdated;
                        delete newPort.dateUpdated;
                        newPort.status = true;
                        let portRegister = await this._portsService.Create(newPort);
                        MappingPort.push(new Mapping(importVoyage.NP, portRegister.id));
                    }
                    else {
                        MappingPort.push(new Mapping(importVoyage.NP, portExiste.id));
                    }
                }
                existePort = searchKey(MappingPort, importVoyage.NP);
                let newReport = new daily_report_entity_1.DailyReport();
                delete newReport.id;
                newReport.userId = importVoyage.USERID;
                newReport.portId = existePort.value;
                newReport.date = moment_assets_1.ConvertDDMMYYYToYYYYMMDD(importVoyage.FECHA);
                newReport.hour = importVoyage.HORA;
                newReport.bunkeringIfo = 0;
                newReport.bunkeringMgo = 0;
                newReport.mplaIfo = importVoyage.MPAL_IFO || 0;
                newReport.auxIfo = importVoyage.AUX_IFO || 0;
                newReport.boilerIfo = importVoyage.CALDERA_IFO || 0;
                newReport.otherIfo = 0;
                newReport.mplaMgo = importVoyage.MPAL2_MGO || 0;
                newReport.auxMgo = importVoyage.AUX_MGO || 0;
                newReport.boilerMgo = importVoyage.CALDERA_MGO || 0;
                newReport.ppMgo = importVoyage.PP_MGO || 0;
                newReport.giMgo = importVoyage.GI_MGO || 0;
                newReport.otherMgo = 0;
                newReport.steamingTime = importVoyage.TIEMPO || 0;
                newReport.distance = importVoyage.DISTANCIA_POR_CARTA || 0;
                if (!importVoyage.BEAUFORT) {
                    newReport.beaufour = '';
                }
                else if (importVoyage.BEAUFORT === 's1' || importVoyage.BEAUFORT === 'S1' || importVoyage.BEAUFORT === 's 1' || importVoyage.BEAUFORT == 'S 1' || importVoyage.BEAUFORT === '1s' || importVoyage.BEAUFORT === '1S' || importVoyage.BEAUFORT === '1 s' || importVoyage.BEAUFORT == '1 S' || importVoyage.BEAUFORT == '1.00' || importVoyage.BEAUFORT == '1') {
                    newReport.beaufour = 'S1';
                }
                else if (importVoyage.BEAUFORT === 's2' || importVoyage.BEAUFORT === 'S2' || importVoyage.BEAUFORT === 's 2' || importVoyage.BEAUFORT == 'S 2' || importVoyage.BEAUFORT === '2s' || importVoyage.BEAUFORT === '2S' || importVoyage.BEAUFORT === '2 s' || importVoyage.BEAUFORT == '2 S' || importVoyage.BEAUFORT == '2.00' || importVoyage.BEAUFORT == '2') {
                    newReport.beaufour = 'S2';
                }
                else if (importVoyage.BEAUFORT === 's3' || importVoyage.BEAUFORT === 'S3' || importVoyage.BEAUFORT === 's 3' || importVoyage.BEAUFORT == 'S 3' || importVoyage.BEAUFORT === '3s' || importVoyage.BEAUFORT === '3S' || importVoyage.BEAUFORT === '3 s' || importVoyage.BEAUFORT == '3 S' || importVoyage.BEAUFORT == '3.00' || importVoyage.BEAUFORT == '3') {
                    newReport.beaufour = 'S3';
                }
                else if (importVoyage.BEAUFORT === 's4' || importVoyage.BEAUFORT === 'S4' || importVoyage.BEAUFORT === 's 4' || importVoyage.BEAUFORT == 'S 4' || importVoyage.BEAUFORT === '4s' || importVoyage.BEAUFORT === '4S' || importVoyage.BEAUFORT === '4 s' || importVoyage.BEAUFORT == '4 S' || importVoyage.BEAUFORT == '4.00' || importVoyage.BEAUFORT == '4') {
                    newReport.beaufour = 'S4';
                }
                else if (importVoyage.BEAUFORT === 's5' || importVoyage.BEAUFORT === 'S5' || importVoyage.BEAUFORT === 's 5' || importVoyage.BEAUFORT == 'S 5' || importVoyage.BEAUFORT === '5s' || importVoyage.BEAUFORT === '5S' || importVoyage.BEAUFORT === '5 s' || importVoyage.BEAUFORT == '5 S' || importVoyage.BEAUFORT == '5.00' || importVoyage.BEAUFORT == '5') {
                    newReport.beaufour = 'S5';
                }
                else if (importVoyage.BEAUFORT === 's6' || importVoyage.BEAUFORT === 'S6' || importVoyage.BEAUFORT === 's 6' || importVoyage.BEAUFORT == 'S 6' || importVoyage.BEAUFORT === '6s' || importVoyage.BEAUFORT === '6S' || importVoyage.BEAUFORT === '6 s' || importVoyage.BEAUFORT == '6 S' || importVoyage.BEAUFORT == '6.00' || importVoyage.BEAUFORT == '6') {
                    newReport.beaufour = 'S6';
                }
                else {
                    newReport.beaufour = '';
                }
                newReport.bunkeringIfo = importVoyage.FAENA_IFO || 0;
                newReport.bunkeringMgo = importVoyage.FAENA_MGO || 0;
                newReport.observation = importVoyage.REFERENCIA;
                newReport.activityPerformed = importVoyage.ACTIVIDAD_REALIZADA;
                if (newReport.activityPerformed == 'CARGANDO') {
                    newReport.activityPerformed = 'LOADING';
                }
                else if (newReport.activityPerformed == 'DESCARGANDO') {
                    newReport.activityPerformed = 'DOWNLOADING';
                }
                else if (newReport.activityPerformed == 'NAVEGANDO EN LASTRE') {
                    newReport.activityPerformed = 'SAILING_IN_BALLAST';
                }
                else if (newReport.activityPerformed == 'NAVEGANDO CON CARGA') {
                    newReport.activityPerformed = 'SAILING_WITH_LADEN';
                }
                else if (newReport.activityPerformed == 'NAVEGACION ECONOMICA') {
                    newReport.activityPerformed = 'ECONOMICAL_NAVIGATION';
                }
                else if (newReport.activityPerformed == 'FONDEADO') {
                    newReport.activityPerformed = 'ANCHORED';
                }
                else if (newReport.activityPerformed == 'MANIOBRA') {
                    newReport.activityPerformed = 'MANEUVER';
                }
                else if (newReport.activityPerformed == 'OTRAS ACT.') {
                    newReport.activityPerformed = 'OTHER_ACT';
                }
                newReport.userIdCreated = headerToken.id;
                newReport.dateCreated = moment_assets_1.getDate();
                delete newReport.userIdUpdated;
                delete newReport.dateUpdated;
                newReport.status = true;
                await this._dailyReportsService.Create(newReport);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (ImportVoyages_1_1 && !ImportVoyages_1_1.done && (_a = ImportVoyages_1.return)) await _a.call(ImportVoyages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return 'Se registraron los datos correctamente.';
    }
};
__decorate([
    common_1.Get('byYears'),
    __param(0, common_1.Headers()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, voyage_entity_1.VoyageFilterByYears]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "GetsByYear", null);
__decorate([
    common_1.Get('detail'),
    __param(0, common_1.Headers()), __param(1, common_1.Query()), __param(2, common_1.Query('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, voyage_entity_1.Voyage, Number]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "GetsDetail", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "Get", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Headers()), __param(1, common_1.Query()), __param(2, common_1.Query('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, voyage_entity_1.Voyage, Number]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "Gets", null);
__decorate([
    common_1.Post('create'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, voyage_entity_1.Voyage]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "CreateVoyage", null);
__decorate([
    common_1.Put(':id/update'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, voyage_entity_1.Voyage]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "Update", null);
__decorate([
    common_1.Delete(':id/delete'),
    __param(0, common_1.Headers()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "DeletePort", null);
__decorate([
    common_1.Post('importVoyages'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "ImportJSONVoyages", null);
VoyagesController = __decorate([
    common_1.Controller('voyages'),
    __metadata("design:paramtypes", [voyages_service_1.VoyagesService,
        ports_service_1.PortsService,
        daily_reports_service_1.DailyReportsService])
], VoyagesController);
exports.VoyagesController = VoyagesController;
class Mapping {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.key = key || 0;
        this.value = value || 0;
    }
}
exports.Mapping = Mapping;
function searchKey(mappings, key) {
    return mappings.find(mapping => Number(mapping.key) == Number(key));
}
exports.searchKey = searchKey;
//# sourceMappingURL=voyages.controller.js.map