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
exports.VoyagesController = void 0;
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
const format_excel_last_voyage_service_1 = require("../../services/format-excel-last-voyage/format-excel-last-voyage.service");
const users_service_1 = require("../users/users.service");
const sendMailConfig_1 = require("../../models/sendMailConfig");
const nodemailer_assets_1 = require("./../../assets/nodemailer.assets");
const mappingKeys_1 = require("../../assets/mappingKeys");
let VoyagesController = class VoyagesController {
    constructor(_voyagesService, _portsService, _dailyReportsService, _formatExcelLastVoyageService, _usersService) {
        this._voyagesService = _voyagesService;
        this._portsService = _portsService;
        this._dailyReportsService = _dailyReportsService;
        this._formatExcelLastVoyageService = _formatExcelLastVoyageService;
        this._usersService = _usersService;
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
                voyage.dateCreated = moment_assets_1.GetDate();
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
                voyage.dateUpdated = moment_assets_1.GetDate();
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
            result.dateUpdated = moment_assets_1.GetDate();
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
        try {
            let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
            if (!(headerToken.role === 'SUPPORT')) {
                return 'AMIGUITO QUE HACES? Escribeme WSP, trabaja con notros. => +51976873362';
            }
            let MappingVoyage = [];
            let MappingPort = [];
            let ultimaFecha;
            try {
                for (var ImportVoyages_1 = __asyncValues(ImportVoyages), ImportVoyages_1_1; ImportVoyages_1_1 = await ImportVoyages_1.next(), !ImportVoyages_1_1.done;) {
                    const importVoyage = ImportVoyages_1_1.value;
                    let existeViaje = mappingKeys_1.searchKey(MappingVoyage, importVoyage.voyageNumber);
                    let userId = importVoyage.userId;
                    if (!existeViaje) {
                        let voyageExistente;
                        if (!importVoyage.voyageId) {
                            voyageExistente = await this._voyagesService.ThisVoyageNumberExistsInTheYear(importVoyage.voyageNumber, importVoyage.year, userId);
                        }
                        else {
                            voyageExistente = await this._voyagesService.Get(importVoyage.voyageId);
                        }
                        if (!voyageExistente) {
                            let newVoyage = new voyage_entity_1.Voyage();
                            delete newVoyage.id;
                            newVoyage.userId = importVoyage.userId;
                            newVoyage.voyageNumber = importVoyage.voyageNumber;
                            newVoyage.year = importVoyage.year;
                            newVoyage.userIdCreated = headerToken.id;
                            newVoyage.dateCreated = moment_assets_1.GetDate();
                            delete newVoyage.userIdUpdated;
                            delete newVoyage.dateUpdated;
                            newVoyage.status = true;
                            let voyageRegister = await this._voyagesService.Create(newVoyage);
                            console.log('Se CREO EL VIAJE NUMERO ' + newVoyage.voyageNumber + '   con id :' + newVoyage.id);
                            MappingVoyage.push(new mappingKeys_1.Mapping(importVoyage.voyageNumber, voyageRegister.id));
                            MappingPort = [];
                        }
                        else {
                            if (voyageExistente.userId != importVoyage.userId)
                                throw 'ALGO ANDA MAL EL ID DEL USUARIO NO PErteece al viaje asignado.';
                            if (voyageExistente.voyageNumber != importVoyage.voyageNumber
                                || voyageExistente.year != importVoyage.year) {
                                delete voyageExistente.ports;
                                voyageExistente.voyageNumber = importVoyage.voyageNumber;
                                voyageExistente.year = importVoyage.year;
                                voyageExistente.userIdUpdated = headerToken.id;
                                voyageExistente.dateUpdated = moment_assets_1.GetDate();
                                voyageExistente.status = true;
                                voyageExistente = await this._voyagesService.Update(voyageExistente);
                            }
                            MappingVoyage.push(new mappingKeys_1.Mapping(importVoyage.voyageNumber, voyageExistente.id));
                            MappingPort = [];
                        }
                    }
                    existeViaje = mappingKeys_1.searchKey(MappingVoyage, importVoyage.voyageNumber);
                    let existePort = mappingKeys_1.searchKey(MappingPort, importVoyage.portNumber);
                    if (!existePort) {
                        let portExiste;
                        if (!importVoyage.portId) {
                            portExiste = await this._portsService.ThereIsThisPortInTheVoyage(importVoyage.portNumber, existeViaje.value, userId);
                        }
                        else {
                            portExiste = await this._portsService.Get(importVoyage.portId);
                        }
                        console.log('portExistet' + portExiste);
                        if (!portExiste) {
                            let newPort = new port_entity_1.Port();
                            delete newPort.id;
                            newPort.userId = importVoyage.userId;
                            newPort.voyageId = existeViaje.value;
                            newPort.departurePort = importVoyage.departurePort;
                            newPort.arrivalPort = importVoyage.arrivalPort;
                            newPort.portNumber = importVoyage.portNumber;
                            if (ultimaFecha) {
                                newPort.startDate = ultimaFecha;
                            }
                            else {
                                newPort.startDate = null;
                            }
                            newPort.startIFO = importVoyage.ROB[0] + importVoyage.TOTAL[0] - importVoyage.bunkeringIfo;
                            newPort.startMGO = importVoyage.ROB[1] + importVoyage.TOTAL[1] - importVoyage.bunkeringMgo;
                            newPort.userIdCreated = headerToken.id;
                            newPort.dateCreated = moment_assets_1.GetDate();
                            delete newPort.userIdUpdated;
                            delete newPort.dateUpdated;
                            newPort.status = true;
                            let portRegister = await this._portsService.Create(newPort);
                            console.log('Se CREO EL PUERTO NUMERO ' + portRegister.portNumber + '   con id :' + portRegister.id);
                            MappingPort.push(new mappingKeys_1.Mapping(importVoyage.portNumber, portRegister.id));
                        }
                        else {
                            console.log('Entro al else de port');
                            if (portExiste.userId != importVoyage.userId)
                                throw 'ALGO ANDA MAL EL ID DEL USUARIO no pertenece al puerto que se le quiere asignar';
                            if ((portExiste.portNumber != importVoyage.portNumber
                                || portExiste.departurePort != importVoyage.departurePort
                                || portExiste.arrivalPort != importVoyage.arrivalPort
                                || portExiste.startIFO != importVoyage.ROB[0]
                                || portExiste.startMGO != importVoyage.ROB[1])
                                && importVoyage.updatePort) {
                                portExiste.voyageId = existeViaje.value;
                                portExiste.portNumber = importVoyage.portNumber;
                                portExiste.departurePort = importVoyage.departurePort;
                                portExiste.arrivalPort = importVoyage.arrivalPort;
                                if (ultimaFecha) {
                                    portExiste.startDate = ultimaFecha;
                                }
                                else {
                                    delete portExiste.startDate;
                                }
                                portExiste.startIFO = importVoyage.ROB[0] + importVoyage.TOTAL[0] - importVoyage.bunkeringIfo;
                                portExiste.startMGO = importVoyage.ROB[1] + importVoyage.TOTAL[1] - importVoyage.bunkeringMgo;
                                delete portExiste.dailyReports;
                                portExiste.dateUpdated = moment_assets_1.GetDate();
                                portExiste.status = true;
                                console.log('Se actualizo el PUERTO NUMERO ' + portExiste.portNumber + '   con id :' + portExiste.id);
                                portExiste = await this._portsService.Update(portExiste);
                            }
                            MappingPort.push(new mappingKeys_1.Mapping(importVoyage.portNumber, portExiste.id));
                        }
                    }
                    existePort = mappingKeys_1.searchKey(MappingPort, importVoyage.portNumber);
                    let newReport = new daily_report_entity_1.DailyReport();
                    if (importVoyage.dailyReportId) {
                        newReport.id = Number(importVoyage.dailyReportId);
                    }
                    else {
                        delete newReport.id;
                    }
                    newReport.userId = importVoyage.userId;
                    newReport.portId = existePort.value;
                    let fechaMAs0 = '';
                    if (importVoyage.date.length == 14 || importVoyage.date.length == 13 || importVoyage.date.length == 12 || importVoyage.date.length == 11 || importVoyage.date.length == 15 || importVoyage.date.length == 18) {
                        ultimaFecha = moment_assets_1.ConvertDDMMYYHHMM5HorasLOCAL(importVoyage.date, 5) + '.000';
                    }
                    else if (importVoyage.date.length == 19 || importVoyage.date.length == 23) {
                        ultimaFecha = moment_assets_1.ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL(importVoyage.date) + '.000';
                    }
                    else if (importVoyage.date.length == 9) {
                        ultimaFecha = '0' + importVoyage.date + ' ' + importVoyage.hour + ':00';
                    }
                    else if (importVoyage.date.length == 10) {
                        ultimaFecha = importVoyage.date + ' ' + importVoyage.hour + ' ' + ':00';
                    }
                    else {
                        ultimaFecha = null;
                        console.log(importVoyage.date);
                        console.log('ERROR CON EL TAMAÑO DE LA FECHA REVISAR Linea 674 ');
                    }
                    newReport.date = ultimaFecha;
                    if (importVoyage.hour) {
                        if (importVoyage.hour.length === 4) {
                            newReport.hour = '0' + importVoyage.hour;
                        }
                        else if (importVoyage.hour.length == 5) {
                            newReport.hour = importVoyage.hour;
                        }
                        else {
                            newReport.hour = importVoyage.hour;
                            console.log('ERROR EN LA EL TAMAÑO DE CARACTERES DE LA HORA, Revisar el id del reporte' + importVoyage.dailyReportId);
                        }
                    }
                    else {
                        let fechatemporalporhora = moment_assets_1.ConvertDateUTC_masUnaCantidadDeHoras(newReport.date, 5);
                        newReport.hour = moment_assets_1.ObtenerlasHorasDeUnaFecaUTC(fechatemporalporhora);
                    }
                    newReport.date = moment_assets_1.ConvertDateUTC_masUnaCantidadDeHoras(newReport.date, -5);
                    newReport.mplaIfo = importVoyage.mplaIfo || 0;
                    newReport.auxIfo = importVoyage.auxIfo || 0;
                    newReport.boilerIfo = importVoyage.boilerIfo || 0;
                    newReport.otherIfo = importVoyage.otherIfo || 0;
                    newReport.mplaMgo = importVoyage.mplaMgo || 0;
                    newReport.auxMgo = importVoyage.auxMgo || 0;
                    newReport.boilerMgo = importVoyage.boilerMgo || 0;
                    newReport.ppMgo = importVoyage.ppMgo || 0;
                    newReport.giMgo = importVoyage.giMgo || 0;
                    newReport.otherMgo = importVoyage.otherMgo || 0;
                    newReport.steamingTime = importVoyage.steamingTime || 0;
                    if (typeof importVoyage.distance === 'number') {
                        newReport.distance = importVoyage.distance;
                    }
                    else {
                        newReport.distance = 0;
                    }
                    if (!importVoyage.beaufour) {
                        newReport.beaufour = '';
                    }
                    else if (importVoyage.beaufour === 's1' || importVoyage.beaufour === 'S1' || importVoyage.beaufour === 's 1' || importVoyage.beaufour == 'S 1' || importVoyage.beaufour === '1s' || importVoyage.beaufour === '1S' || importVoyage.beaufour === '1 s' || importVoyage.beaufour == '1 S' || importVoyage.beaufour == '1.00' || importVoyage.beaufour == '1') {
                        newReport.beaufour = 'S1';
                    }
                    else if (importVoyage.beaufour === 's2' || importVoyage.beaufour === 'S2' || importVoyage.beaufour === 's 2' || importVoyage.beaufour == 'S 2' || importVoyage.beaufour === '2s' || importVoyage.beaufour === '2S' || importVoyage.beaufour === '2 s' || importVoyage.beaufour == '2 S' || importVoyage.beaufour == '2.00' || importVoyage.beaufour == '2') {
                        newReport.beaufour = 'S2';
                    }
                    else if (importVoyage.beaufour === 's3' || importVoyage.beaufour === 'S3' || importVoyage.beaufour === 's 3' || importVoyage.beaufour == 'S 3' || importVoyage.beaufour === '3s' || importVoyage.beaufour === '3S' || importVoyage.beaufour === '3 s' || importVoyage.beaufour == '3 S' || importVoyage.beaufour == '3.00' || importVoyage.beaufour == '3') {
                        newReport.beaufour = 'S3';
                    }
                    else if (importVoyage.beaufour === 's4' || importVoyage.beaufour === 'S4' || importVoyage.beaufour === 's 4' || importVoyage.beaufour == 'S 4' || importVoyage.beaufour === '4s' || importVoyage.beaufour === '4S' || importVoyage.beaufour === '4 s' || importVoyage.beaufour == '4 S' || importVoyage.beaufour == '4.00' || importVoyage.beaufour == '4') {
                        newReport.beaufour = 'S4';
                    }
                    else if (importVoyage.beaufour === 's5' || importVoyage.beaufour === 'S5' || importVoyage.beaufour === 's 5' || importVoyage.beaufour == 'S 5' || importVoyage.beaufour === '5s' || importVoyage.beaufour === '5S' || importVoyage.beaufour === '5 s' || importVoyage.beaufour == '5 S' || importVoyage.beaufour == '5.00' || importVoyage.beaufour == '5') {
                        newReport.beaufour = 'S5';
                    }
                    else if (importVoyage.beaufour === 's6' || importVoyage.beaufour === 'S6' || importVoyage.beaufour === 's 6' || importVoyage.beaufour == 'S 6' || importVoyage.beaufour === '6s' || importVoyage.beaufour === '6S' || importVoyage.beaufour === '6 s' || importVoyage.beaufour == '6 S' || importVoyage.beaufour == '6.00' || importVoyage.beaufour == '6') {
                        newReport.beaufour = 'S6';
                    }
                    else {
                        newReport.beaufour = importVoyage.beaufour;
                    }
                    newReport.bunkeringIfo = importVoyage.bunkeringIfo || 0;
                    newReport.bunkeringMgo = importVoyage.bunkeringMgo || 0;
                    newReport.observation = importVoyage.observation;
                    newReport.activityPerformed = importVoyage.activityPerformed;
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
                    newReport.typeActivityPerformed = importVoyage.typeActivityPerformed;
                    newReport.speedStraction = importVoyage.speedStraction;
                    newReport.observation = importVoyage.observation;
                    newReport.north_degree = importVoyage.north_degree || 0;
                    newReport.north_minutes = importVoyage.north_minutes || 0;
                    newReport.north_north_south = importVoyage.north_north_south || '';
                    newReport.east_degree = importVoyage.east_degree || 0;
                    newReport.east_minutes = importVoyage.east_minutes || 0;
                    newReport.east_east_west = importVoyage.east_east_west || '';
                    if (importVoyage.delete_report) {
                        newReport.status = false;
                    }
                    else {
                        newReport.status = true;
                    }
                    if (!importVoyage.dailyReportId) {
                        newReport.userIdCreated = headerToken.id;
                        newReport.dateCreated = moment_assets_1.GetDate();
                        delete newReport.userIdUpdated;
                        delete newReport.dateUpdated;
                        await this._dailyReportsService.Create(newReport);
                        console.log('Create' + newReport.date);
                    }
                    else {
                        newReport.userIdUpdated = headerToken.id;
                        newReport.dateUpdated = moment_assets_1.GetDate();
                        delete newReport.userIdCreated;
                        delete newReport.dateCreated;
                        await this._dailyReportsService.Update(newReport);
                        console.log('Update' + newReport.id);
                    }
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
        catch (error) {
            return 'ERRRORRRRRRRRRRRRRRRRRRRRRRRRRR! ';
        }
    }
    async ImportVoyagesDeFormatDNV(headers, ImportVoyages) {
        var e_2, _a;
        try {
            let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
            if (!(headerToken.role === 'SUPPORT')) {
                return 'AMIGUITO QUE HACES? Escribeme WSP, trabaja con notros. => +51976873362';
            }
            let MappingVoyage = [];
            let MappingPort = [];
            let ultimaFecha;
            let secrearaunNuevoReporte = false;
            try {
                for (var ImportVoyages_2 = __asyncValues(ImportVoyages), ImportVoyages_2_1; ImportVoyages_2_1 = await ImportVoyages_2.next(), !ImportVoyages_2_1.done;) {
                    const importVoyage = ImportVoyages_2_1.value;
                    let existeViaje = mappingKeys_1.searchKey(MappingVoyage, importVoyage.voyageNumber);
                    let userId = importVoyage.userId;
                    if (!existeViaje) {
                        let voyageExistente;
                        if (!importVoyage.voyageId) {
                            voyageExistente = await this._voyagesService.ThisVoyageNumberExistsInTheYear(importVoyage.voyageNumber, importVoyage.year, userId);
                        }
                        else {
                            voyageExistente = await this._voyagesService.Get(importVoyage.voyageId);
                        }
                        if (!voyageExistente) {
                            let newVoyage = new voyage_entity_1.Voyage();
                            delete newVoyage.id;
                            newVoyage.userId = importVoyage.userId;
                            newVoyage.voyageNumber = importVoyage.voyageNumber;
                            newVoyage.year = importVoyage.year;
                            newVoyage.userIdCreated = headerToken.id;
                            newVoyage.dateCreated = moment_assets_1.GetDate();
                            delete newVoyage.userIdUpdated;
                            delete newVoyage.dateUpdated;
                            newVoyage.status = true;
                            let voyageRegister = await this._voyagesService.Create(newVoyage);
                            console.log('Se CREO EL VIAJE NUMERO ' + newVoyage.voyageNumber + '   con id :' + newVoyage.id);
                            MappingVoyage.push(new mappingKeys_1.Mapping(importVoyage.voyageNumber, voyageRegister.id));
                            MappingPort = [];
                        }
                        else {
                            if (voyageExistente.userId != importVoyage.userId)
                                throw 'ALGO ANDA MAL EL ID DEL USUARIO NO PErteece al viaje asignado.';
                            if (voyageExistente.voyageNumber != importVoyage.voyageNumber
                                || voyageExistente.year != importVoyage.year) {
                                delete voyageExistente.ports;
                                voyageExistente.voyageNumber = importVoyage.voyageNumber;
                                voyageExistente.year = importVoyage.year;
                                voyageExistente.userIdUpdated = headerToken.id;
                                voyageExistente.dateUpdated = moment_assets_1.GetDate();
                                voyageExistente.status = true;
                                voyageExistente = await this._voyagesService.Update(voyageExistente);
                            }
                            MappingVoyage.push(new mappingKeys_1.Mapping(importVoyage.voyageNumber, voyageExistente.id));
                            MappingPort = [];
                        }
                    }
                    existeViaje = mappingKeys_1.searchKey(MappingVoyage, importVoyage.voyageNumber);
                    let existePort = mappingKeys_1.searchKey(MappingPort, importVoyage.portNumber);
                    if (!existePort) {
                        let portExiste;
                        if (!importVoyage.portId) {
                            portExiste = await this._portsService.ThereIsThisPortInTheVoyage(importVoyage.portNumber, existeViaje.value, userId);
                        }
                        else {
                            portExiste = await this._portsService.Get(importVoyage.portId);
                        }
                        console.log('portExistet' + portExiste);
                        if (!portExiste) {
                            let newPort = new port_entity_1.Port();
                            delete newPort.id;
                            newPort.userId = importVoyage.userId;
                            newPort.voyageId = existeViaje.value;
                            newPort.departurePort = importVoyage.departurePort;
                            newPort.arrivalPort = importVoyage.arrivalPort;
                            newPort.portNumber = importVoyage.portNumber;
                            if (ultimaFecha) {
                                newPort.startDate = ultimaFecha;
                            }
                            else {
                                newPort.startDate = null;
                            }
                            newPort.startIFO = importVoyage.ROB[0] + importVoyage.TOTAL[0] - importVoyage.bunkeringIfo;
                            newPort.startMGO = importVoyage.ROB[1] + importVoyage.TOTAL[1] - importVoyage.bunkeringMgo;
                            newPort.userIdCreated = headerToken.id;
                            newPort.dateCreated = moment_assets_1.GetDate();
                            delete newPort.userIdUpdated;
                            delete newPort.dateUpdated;
                            newPort.status = true;
                            let portRegister = await this._portsService.Create(newPort);
                            console.log('Se CREO EL PUERTO NUMERO ' + portRegister.portNumber + '   con id :' + portRegister.id);
                            MappingPort.push(new mappingKeys_1.Mapping(importVoyage.portNumber, portRegister.id));
                        }
                        else {
                            console.log('Entro al else de port');
                            if (portExiste.userId != importVoyage.userId)
                                throw 'ALGO ANDA MAL EL ID DEL USUARIO no pertenece al puerto que se le quiere asignar';
                            if ((portExiste.portNumber != importVoyage.portNumber
                                || portExiste.departurePort != importVoyage.departurePort
                                || portExiste.arrivalPort != importVoyage.arrivalPort
                                || portExiste.startIFO != importVoyage.ROB[0]
                                || portExiste.startMGO != importVoyage.ROB[1])
                                && importVoyage.updatePort) {
                                portExiste.voyageId = existeViaje.value;
                                portExiste.portNumber = importVoyage.portNumber;
                                portExiste.departurePort = importVoyage.departurePort;
                                portExiste.arrivalPort = importVoyage.arrivalPort;
                                if (ultimaFecha) {
                                    portExiste.startDate = ultimaFecha;
                                }
                                else {
                                    delete portExiste.startDate;
                                }
                                portExiste.startIFO = importVoyage.ROB[0] + importVoyage.TOTAL[0] - importVoyage.bunkeringIfo;
                                portExiste.startMGO = importVoyage.ROB[1] + importVoyage.TOTAL[1] - importVoyage.bunkeringMgo;
                                delete portExiste.dailyReports;
                                portExiste.dateUpdated = moment_assets_1.GetDate();
                                portExiste.status = true;
                                console.log('Se actualizo el PUERTO NUMERO ' + portExiste.portNumber + '   con id :' + portExiste.id);
                                portExiste = await this._portsService.Update(portExiste);
                            }
                            MappingPort.push(new mappingKeys_1.Mapping(importVoyage.portNumber, portExiste.id));
                        }
                    }
                    existePort = mappingKeys_1.searchKey(MappingPort, importVoyage.portNumber);
                    let newReport = new daily_report_entity_1.DailyReport();
                    if (importVoyage.dailyReportId) {
                        newReport.id = Number(importVoyage.dailyReportId);
                    }
                    else {
                        delete newReport.id;
                    }
                    newReport.userId = importVoyage.userId;
                    newReport.portId = existePort.value;
                    secrearaunNuevoReporte = false;
                    if (ultimaFecha && importVoyage.steamingTime2 > 0) {
                        secrearaunNuevoReporte = true;
                        console.log(importVoyage.steamingTime2);
                        console.log("fechaAntiguaMasElTiempoDeNavegacion");
                        console.log(ultimaFecha);
                        let fechaAntiguaMasElTiempoDeNavegacion = moment_assets_1.ConvertDateUTC_masUnaCantidadDeHoras(ultimaFecha, importVoyage.steamingTime2);
                        console.log("mas horas " + importVoyage.steamingTime2);
                        console.log(fechaAntiguaMasElTiempoDeNavegacion);
                        ultimaFecha = fechaAntiguaMasElTiempoDeNavegacion + '.000';
                        console.log("ultimaFecha");
                        console.log(ultimaFecha);
                        if (ultimaFecha.length == 19) {
                            newReport.date = ultimaFecha;
                        }
                        else {
                            console.log('ERROR CON EL TAMAÑO DE LA FECHA REVISAR linea 1111 ');
                        }
                        newReport.hour = moment_assets_1.ObtenerlasHorasDeUnaFecaUTC(ultimaFecha);
                        console.log(newReport.hour);
                        ultimaFecha = moment_assets_1.ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL(ultimaFecha) + '.000';
                        newReport.date = ultimaFecha;
                        newReport.mplaIfo = importVoyage.mplaIfo || 0;
                        newReport.auxIfo = importVoyage.auxIfo || 0;
                        newReport.boilerIfo = importVoyage.boilerIfo || 0;
                        newReport.otherIfo = importVoyage.otherIfo || 0;
                        newReport.mplaMgo = importVoyage.mplaMgo || 0;
                        newReport.auxMgo = importVoyage.auxMgo || 0;
                        newReport.boilerMgo = importVoyage.boilerMgo || 0;
                        newReport.ppMgo = importVoyage.ppMgo || 0;
                        newReport.giMgo = importVoyage.giMgo || 0;
                        newReport.otherMgo = importVoyage.otherMgo || 0;
                        newReport.steamingTime = importVoyage.steamingTime || 0;
                        newReport.distance = importVoyage.distance || 0;
                        if (!importVoyage.beaufour) {
                            newReport.beaufour = '';
                        }
                        else if (importVoyage.beaufour === 's1' || importVoyage.beaufour === 'S1' || importVoyage.beaufour === 's 1' || importVoyage.beaufour == 'S 1' || importVoyage.beaufour === '1s' || importVoyage.beaufour === '1S' || importVoyage.beaufour === '1 s' || importVoyage.beaufour == '1 S' || importVoyage.beaufour == '1.00' || importVoyage.beaufour == '1') {
                            newReport.beaufour = 'S1';
                        }
                        else if (importVoyage.beaufour === 's2' || importVoyage.beaufour === 'S2' || importVoyage.beaufour === 's 2' || importVoyage.beaufour == 'S 2' || importVoyage.beaufour === '2s' || importVoyage.beaufour === '2S' || importVoyage.beaufour === '2 s' || importVoyage.beaufour == '2 S' || importVoyage.beaufour == '2.00' || importVoyage.beaufour == '2') {
                            newReport.beaufour = 'S2';
                        }
                        else if (importVoyage.beaufour === 's3' || importVoyage.beaufour === 'S3' || importVoyage.beaufour === 's 3' || importVoyage.beaufour == 'S 3' || importVoyage.beaufour === '3s' || importVoyage.beaufour === '3S' || importVoyage.beaufour === '3 s' || importVoyage.beaufour == '3 S' || importVoyage.beaufour == '3.00' || importVoyage.beaufour == '3') {
                            newReport.beaufour = 'S3';
                        }
                        else if (importVoyage.beaufour === 's4' || importVoyage.beaufour === 'S4' || importVoyage.beaufour === 's 4' || importVoyage.beaufour == 'S 4' || importVoyage.beaufour === '4s' || importVoyage.beaufour === '4S' || importVoyage.beaufour === '4 s' || importVoyage.beaufour == '4 S' || importVoyage.beaufour == '4.00' || importVoyage.beaufour == '4') {
                            newReport.beaufour = 'S4';
                        }
                        else if (importVoyage.beaufour === 's5' || importVoyage.beaufour === 'S5' || importVoyage.beaufour === 's 5' || importVoyage.beaufour == 'S 5' || importVoyage.beaufour === '5s' || importVoyage.beaufour === '5S' || importVoyage.beaufour === '5 s' || importVoyage.beaufour == '5 S' || importVoyage.beaufour == '5.00' || importVoyage.beaufour == '5') {
                            newReport.beaufour = 'S5';
                        }
                        else if (importVoyage.beaufour === 's6' || importVoyage.beaufour === 'S6' || importVoyage.beaufour === 's 6' || importVoyage.beaufour == 'S 6' || importVoyage.beaufour === '6s' || importVoyage.beaufour === '6S' || importVoyage.beaufour === '6 s' || importVoyage.beaufour == '6 S' || importVoyage.beaufour == '6.00' || importVoyage.beaufour == '6') {
                            newReport.beaufour = 'S6';
                        }
                        else {
                            newReport.beaufour = importVoyage.beaufour;
                        }
                        newReport.bunkeringIfo = importVoyage.bunkeringIfo || 0;
                        newReport.bunkeringMgo = importVoyage.bunkeringMgo || 0;
                        newReport.observation = importVoyage.observation;
                        newReport.activityPerformed = importVoyage.activityPerformed;
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
                        newReport.typeActivityPerformed = importVoyage.typeActivityPerformed;
                        newReport.speedStraction = importVoyage.speedStraction;
                        newReport.observation = importVoyage.observation;
                        newReport.north_degree = importVoyage.north_degree || 0;
                        newReport.north_minutes = importVoyage.north_minutes || 0;
                        newReport.north_north_south = importVoyage.north_north_south || '';
                        newReport.east_degree = importVoyage.east_degree || 0;
                        newReport.east_minutes = importVoyage.east_minutes || 0;
                        newReport.east_east_west = importVoyage.east_east_west || '';
                        if (importVoyage.delete_report) {
                            newReport.status = false;
                        }
                        else {
                            newReport.status = true;
                        }
                        delete newReport.id;
                        newReport.userIdCreated = headerToken.id;
                        newReport.dateCreated = moment_assets_1.GetDate();
                        delete newReport.userIdUpdated;
                        delete newReport.dateUpdated;
                        await this._dailyReportsService.Create(newReport);
                        console.log('Create' + newReport.date);
                    }
                    newReport.id = importVoyage.dailyReportId;
                    if (importVoyage.dailyReportId) {
                        newReport.id = Number(importVoyage.dailyReportId);
                    }
                    else {
                        delete newReport.id;
                    }
                    ultimaFecha = moment_assets_1.DateDayMonthYear(importVoyage.date) + ' ' + importVoyage.hour + ':00.000';
                    console.log(ultimaFecha);
                    ultimaFecha = moment_assets_1.ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL(ultimaFecha) + '.000';
                    console.log(ultimaFecha);
                    if (ultimaFecha.length == 23) {
                        newReport.date = ultimaFecha;
                    }
                    else {
                        console.log('ERROR CON EL TAMAÑO DE LA FECHA REVISAR ');
                    }
                    if (importVoyage.hour) {
                        if (importVoyage.hour.length === 4) {
                            newReport.hour = '0' + importVoyage.hour;
                        }
                        else if (importVoyage.hour.length == 5) {
                            newReport.hour = importVoyage.hour;
                        }
                        else {
                            console.log('ERROR EN LA EL TAMAÑO DE CARACTERES DE LA HORA, Revisar el id del reporte' + importVoyage.dailyReportId);
                        }
                    }
                    if (secrearaunNuevoReporte) {
                        newReport.mplaIfo = 0;
                        newReport.auxIfo = 0;
                        newReport.boilerIfo = 0;
                        newReport.otherIfo = 0;
                        newReport.mplaMgo = 0;
                        newReport.auxMgo = 0;
                        newReport.boilerMgo = 0;
                        newReport.ppMgo = 0;
                        newReport.giMgo = 0;
                        newReport.otherMgo = 0;
                        newReport.steamingTime = 0;
                        newReport.distance = 0;
                        newReport.beaufour = '';
                        newReport.bunkeringIfo = 0;
                        newReport.bunkeringMgo = 0;
                        newReport.observation = '';
                        newReport.activityPerformed = importVoyage.activityPerformed;
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
                        newReport.typeActivityPerformed = importVoyage.typeActivityPerformed;
                        newReport.speedStraction = '';
                        newReport.observation = '';
                        newReport.north_degree = importVoyage.north_degree || 0;
                        newReport.north_minutes = importVoyage.north_minutes || 0;
                        newReport.north_north_south = importVoyage.north_north_south || '';
                        newReport.east_degree = importVoyage.east_degree || 0;
                        newReport.east_minutes = importVoyage.east_minutes || 0;
                        newReport.east_east_west = importVoyage.east_east_west || '';
                    }
                    else {
                        newReport.mplaIfo = importVoyage.mplaIfo || 0;
                        newReport.auxIfo = importVoyage.auxIfo || 0;
                        newReport.boilerIfo = importVoyage.boilerIfo || 0;
                        newReport.otherIfo = importVoyage.otherIfo || 0;
                        newReport.mplaMgo = importVoyage.mplaMgo || 0;
                        newReport.auxMgo = importVoyage.auxMgo || 0;
                        newReport.boilerMgo = importVoyage.boilerMgo || 0;
                        newReport.ppMgo = importVoyage.ppMgo || 0;
                        newReport.giMgo = importVoyage.giMgo || 0;
                        newReport.otherMgo = importVoyage.otherMgo || 0;
                        newReport.steamingTime = importVoyage.steamingTime || 0;
                        newReport.distance = importVoyage.distance || 0;
                        if (!importVoyage.beaufour) {
                            newReport.beaufour = '';
                        }
                        else if (importVoyage.beaufour === 's1' || importVoyage.beaufour === 'S1' || importVoyage.beaufour === 's 1' || importVoyage.beaufour == 'S 1' || importVoyage.beaufour === '1s' || importVoyage.beaufour === '1S' || importVoyage.beaufour === '1 s' || importVoyage.beaufour == '1 S' || importVoyage.beaufour == '1.00' || importVoyage.beaufour == '1') {
                            newReport.beaufour = 'S1';
                        }
                        else if (importVoyage.beaufour === 's2' || importVoyage.beaufour === 'S2' || importVoyage.beaufour === 's 2' || importVoyage.beaufour == 'S 2' || importVoyage.beaufour === '2s' || importVoyage.beaufour === '2S' || importVoyage.beaufour === '2 s' || importVoyage.beaufour == '2 S' || importVoyage.beaufour == '2.00' || importVoyage.beaufour == '2') {
                            newReport.beaufour = 'S2';
                        }
                        else if (importVoyage.beaufour === 's3' || importVoyage.beaufour === 'S3' || importVoyage.beaufour === 's 3' || importVoyage.beaufour == 'S 3' || importVoyage.beaufour === '3s' || importVoyage.beaufour === '3S' || importVoyage.beaufour === '3 s' || importVoyage.beaufour == '3 S' || importVoyage.beaufour == '3.00' || importVoyage.beaufour == '3') {
                            newReport.beaufour = 'S3';
                        }
                        else if (importVoyage.beaufour === 's4' || importVoyage.beaufour === 'S4' || importVoyage.beaufour === 's 4' || importVoyage.beaufour == 'S 4' || importVoyage.beaufour === '4s' || importVoyage.beaufour === '4S' || importVoyage.beaufour === '4 s' || importVoyage.beaufour == '4 S' || importVoyage.beaufour == '4.00' || importVoyage.beaufour == '4') {
                            newReport.beaufour = 'S4';
                        }
                        else if (importVoyage.beaufour === 's5' || importVoyage.beaufour === 'S5' || importVoyage.beaufour === 's 5' || importVoyage.beaufour == 'S 5' || importVoyage.beaufour === '5s' || importVoyage.beaufour === '5S' || importVoyage.beaufour === '5 s' || importVoyage.beaufour == '5 S' || importVoyage.beaufour == '5.00' || importVoyage.beaufour == '5') {
                            newReport.beaufour = 'S5';
                        }
                        else if (importVoyage.beaufour === 's6' || importVoyage.beaufour === 'S6' || importVoyage.beaufour === 's 6' || importVoyage.beaufour == 'S 6' || importVoyage.beaufour === '6s' || importVoyage.beaufour === '6S' || importVoyage.beaufour === '6 s' || importVoyage.beaufour == '6 S' || importVoyage.beaufour == '6.00' || importVoyage.beaufour == '6') {
                            newReport.beaufour = 'S6';
                        }
                        else {
                            newReport.beaufour = importVoyage.beaufour;
                        }
                        newReport.bunkeringIfo = importVoyage.bunkeringIfo || 0;
                        newReport.bunkeringMgo = importVoyage.bunkeringMgo || 0;
                        newReport.observation = importVoyage.observation;
                        newReport.activityPerformed = importVoyage.activityPerformed;
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
                        newReport.typeActivityPerformed = importVoyage.typeActivityPerformed;
                        newReport.speedStraction = importVoyage.speedStraction;
                        newReport.observation = importVoyage.observation;
                        newReport.north_degree = importVoyage.north_degree || 0;
                        newReport.north_minutes = importVoyage.north_minutes || 0;
                        newReport.north_north_south = importVoyage.north_north_south || '';
                        newReport.east_degree = importVoyage.east_degree || 0;
                        newReport.east_minutes = importVoyage.east_minutes || 0;
                        newReport.east_east_west = importVoyage.east_east_west || '';
                    }
                    if (importVoyage.delete_report) {
                        newReport.status = false;
                    }
                    else {
                        newReport.status = true;
                    }
                    if (!importVoyage.dailyReportId) {
                        newReport.userIdCreated = headerToken.id;
                        newReport.dateCreated = moment_assets_1.GetDate();
                        delete newReport.userIdUpdated;
                        delete newReport.dateUpdated;
                        await this._dailyReportsService.Create(newReport);
                        console.log('Create' + newReport.date);
                    }
                    else {
                        newReport.userIdUpdated = headerToken.id;
                        newReport.dateUpdated = moment_assets_1.GetDate();
                        delete newReport.userIdCreated;
                        delete newReport.dateCreated;
                        await this._dailyReportsService.Update(newReport);
                        console.log('Update' + newReport.id);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (ImportVoyages_2_1 && !ImportVoyages_2_1.done && (_a = ImportVoyages_2.return)) await _a.call(ImportVoyages_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return 'Se registraron los datos correctamente.';
        }
        catch (error) {
            return 'ERRRORRRRRRRRRRRRRRRRRRRRRRRRRR! ';
        }
    }
    async ImportListDailyReportAgregarOeliminar(headers, ImportDailyReport) {
        var e_3, _a;
        try {
            let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
            if (!(headerToken.role === 'SUPPORT')) {
                return 'AMIGUITO QUE HACES? Escribeme WSP, trabaja con notros. => +51976873362';
            }
            let MappingVoyage = [];
            let MappingPort = [];
            let ultimaFecha;
            try {
                for (var ImportDailyReport_1 = __asyncValues(ImportDailyReport), ImportDailyReport_1_1; ImportDailyReport_1_1 = await ImportDailyReport_1.next(), !ImportDailyReport_1_1.done;) {
                    const importDailyReport = ImportDailyReport_1_1.value;
                    let updateReport = {};
                    updateReport.id = importDailyReport.id;
                    if (!!importDailyReport.north_degree) {
                        updateReport.north_degree = importDailyReport.north_degree;
                    }
                    if (!!importDailyReport.north_minutes) {
                        updateReport.north_minutes = importDailyReport.north_minutes;
                    }
                    if (!!importDailyReport.north_north_south) {
                        updateReport.north_north_south = importDailyReport.north_north_south;
                    }
                    if (!!importDailyReport.east_degree) {
                        updateReport.east_degree = importDailyReport.east_degree;
                    }
                    if (!!importDailyReport.east_minutes) {
                        updateReport.east_minutes = importDailyReport.east_minutes;
                    }
                    if (!!importDailyReport.east_east_west) {
                        updateReport.east_east_west = importDailyReport.east_east_west;
                    }
                    updateReport.distance = importDailyReport.distance;
                    if (!updateReport.id) {
                    }
                    else {
                        await this._dailyReportsService.Update(updateReport);
                        console.log('Update' + updateReport.id);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ImportDailyReport_1_1 && !ImportDailyReport_1_1.done && (_a = ImportDailyReport_1.return)) await _a.call(ImportDailyReport_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return 'Se registraron los datos correctamente.';
        }
        catch (error) {
            return 'ERRRORRRRRRRRRRRRRRRRRRRRRRRRRR! ';
        }
    }
    async SendEmailLastVoyage(sendMailConfig) {
        let userId = sendMailConfig.userId;
        let email = sendMailConfig.emails;
        let userEntity = null;
        let voyageId = null;
        let listGetReportVoyagePortDaily = [];
        let getInfoFuelStartEndByFilterDate;
        let numeroViaje = 0;
        let numeroAnio = 0;
        let textIFOorVLSFOorLSFO = '';
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            return this._usersService.Get(userId);
        }).then((resultUser) => {
            userEntity = resultUser;
            return this._voyagesService.GetLastVoyage(userId);
        }).then(result => {
            if (result.length != 2)
                throw 'ERROR debe de haber mas de 2 viajes.';
            numeroViaje = result[1].voyageNumber;
            numeroAnio = result[1].year;
            voyageId = result[1].id;
            return this._dailyReportsService.GetReportVoyagePortDaily(userId, null, null, voyageId);
        }).then(resultGetReportVoyagePortDaily => {
            if (resultGetReportVoyagePortDaily.length == 0)
                throw 'ERROR debe de arrojar mas de un registro';
            listGetReportVoyagePortDaily = resultGetReportVoyagePortDaily;
            let minDate = resultGetReportVoyagePortDaily[0].date;
            let maxDate = resultGetReportVoyagePortDaily[resultGetReportVoyagePortDaily.length - 1].date;
            return this._dailyReportsService.GetStartEndROByFilterDate(minDate, maxDate, userId);
        }).then(resultGetStartEndROByFilterDate => {
            if (!resultGetStartEndROByFilterDate)
                throw 'ERROR GetStartEndROByFilterDate';
            let startDataROB = new daily_report_entity_1.GetROBByUser();
            let endDataROB = new daily_report_entity_1.GetROBByUser();
            startDataROB.total_ifo = resultGetStartEndROByFilterDate[0].total_bunkering_ifo - resultGetStartEndROByFilterDate[0].total_ifo;
            startDataROB.total_mgo = resultGetStartEndROByFilterDate[0].total_bunkering_mgo - resultGetStartEndROByFilterDate[0].total_mgo;
            startDataROB.total_bunkering_ifo = resultGetStartEndROByFilterDate[0].total_bunkering_ifo, 2;
            startDataROB.total_bunkering_mgo = resultGetStartEndROByFilterDate[0].total_bunkering_mgo, 2;
            endDataROB.total_ifo = startDataROB.total_ifo + (resultGetStartEndROByFilterDate[1].total_bunkering_ifo - resultGetStartEndROByFilterDate[1].total_ifo);
            endDataROB.total_mgo = startDataROB.total_mgo + (resultGetStartEndROByFilterDate[1].total_bunkering_mgo - resultGetStartEndROByFilterDate[1].total_mgo);
            endDataROB.total_bunkering_ifo = resultGetStartEndROByFilterDate[1].total_bunkering_ifo, 2;
            endDataROB.total_bunkering_mgo = resultGetStartEndROByFilterDate[1].total_bunkering_mgo, 2;
            getInfoFuelStartEndByFilterDate = new daily_report_entity_1.InfoFuelStartEndForDate(startDataROB, endDataROB);
            return this._formatExcelLastVoyageService.GenerateFormatObjForExcelEmail(listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate, userEntity);
        }).then(resultGenerateFormatObjForExcelEmail => {
            let mailLastVoyage = resultGenerateFormatObjForExcelEmail;
            mailLastVoyage.objMailLastVoyage.IFO_VLSFO_LSFO = userEntity.isConsumptionIFO ? 'IFO' : userEntity.isConsumptionLSFO ? 'LSFO' : userEntity.isConsumptionVLSFO ? 'VLSFO' : '';
            if (mailLastVoyage.objMailLastVoyage.IFO_VLSFO_LSFO) {
                mailLastVoyage.objMailLastVoyage.isVIew_IFO_VLSFO_LSFO = true;
            }
            mailLastVoyage.objMailLastVoyage.MGO = userEntity.isConsumptionMGO ? 'MGO' : '';
            if (mailLastVoyage.objMailLastVoyage.MGO) {
                mailLastVoyage.objMailLastVoyage.isVIew_MGO = true;
            }
            return nodemailer_assets_1.SendMailArchiveInfoLastVoyage(sendMailConfig.emails, userEntity.name, userEntity.name + " Voyage Nº" + numeroViaje + " - " + numeroAnio, mailLastVoyage.buffer, mailLastVoyage.objMailLastVoyage);
        }).then(result => {
            if (!result) {
                throw 'ERROR SUPPORT';
            }
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: result
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
    UpdateData(headers, voyages) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        voyages.forEach(async (voyage) => {
            if (voyage.SyncStatus === 'added') {
                if (voyage && Number(voyage.userId) && Number(voyage.voyageNumber) && Number(voyage.year) && headerToken && headerToken.id) {
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    }
                    else if (voyage.userId !== headerToken.id)
                        throw new Error('ERROR_USERID_FAIL');
                    delete voyage.id;
                    voyage.userIdCreated = headerToken.id;
                    voyage.dateCreated = moment_assets_1.GetDate();
                    delete voyage.userIdUpdated;
                    delete voyage.dateUpdated;
                    voyage.status = Boolean(voyage.status);
                    await this._voyagesService.Create(voyage);
                }
                else
                    throw 'MISSING_FIELS';
            }
            else if (voyage.SyncStatus === 'update') {
                if (voyage && voyage.userId && voyage.voyageNumber && voyage.year && headerToken && headerToken.id) {
                    voyage.id = Number(voyage.id);
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    }
                    else if (Number(headerToken.id) !== Number(voyage.userId))
                        throw new Error('ERROR_USERID_FAIL');
                    delete voyage.userIdCreated;
                    delete voyage.dateCreated;
                    voyage.userIdUpdated = headerToken.id;
                    voyage.dateUpdated = moment_assets_1.GetDate();
                    voyage.status = Boolean(voyage.status);
                    await this._voyagesService.Update(voyage);
                }
                else {
                    throw 'MISSING_FIELS';
                }
            }
        });
        return { mensaje: 'Datos recibidos correctamente' };
    }
    async SaveDataVoyage(headers, saveDataModuleCombustible) {
        let headerToken = jwtDecode_assets_1.JwtDecode(headers.authorization);
        let mappingVoyages = [];
        let mappingPorts = [];
        let mappingDailyReports = [];
        console.log('--------------------------');
        console.log('-----------[   saveModuleVoyage   ]---------------');
        console.log('--------------------------');
        console.log('--------------------------');
        console.log(saveDataModuleCombustible);
        console.log('--------------------------');
        console.log('--------------------------');
        console.log('--------------------------');
        console.log('--------------------------');
        return promises_assets_1.DummyPromise().then((resultDummy) => {
            if (saveDataModuleCombustible) {
                if (saveDataModuleCombustible.listVoyages) {
                    return this._voyagesService.SaveList(saveDataModuleCombustible.listVoyages);
                }
                else {
                    return [];
                }
            }
            else
                throw 'MISSING_FIELS';
        }).then((resultMappingVoyages) => {
            mappingVoyages = resultMappingVoyages;
            if (saveDataModuleCombustible.listPorts) {
                return this._portsService.SaveList(mappingVoyages, saveDataModuleCombustible.listPorts);
            }
            else {
                return [];
            }
        }).then((resultMappingPorts) => {
            mappingPorts = resultMappingPorts;
            if (saveDataModuleCombustible.listDailyReports) {
                return this._dailyReportsService.SaveList(mappingPorts, saveDataModuleCombustible.listDailyReports);
            }
            else {
                return [];
            }
        }).then((resultMappingDailyReports) => {
            mappingDailyReports = resultMappingDailyReports;
            return {
                status: common_1.HttpStatus.OK,
                message: 'OK',
                data: {
                    mappingVoyages: mappingVoyages,
                    mappingPorts: mappingPorts,
                    mappingDailyReports: mappingDailyReports
                }
            };
        });
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
__decorate([
    common_1.Post('importVoyagesDeFormatDNV'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "ImportVoyagesDeFormatDNV", null);
__decorate([
    common_1.Post('ImportListDailyReportAgregarOeliminar'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "ImportListDailyReportAgregarOeliminar", null);
__decorate([
    common_1.Post('sendEmailLastVoyage'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sendMailConfig_1.SendMailConfig]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "SendEmailLastVoyage", null);
__decorate([
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Object)
], VoyagesController.prototype, "UpdateData", null);
__decorate([
    common_1.Post('saveModuleVoyage'),
    __param(0, common_1.Headers()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, voyage_entity_1.DataModuleCombustible]),
    __metadata("design:returntype", Promise)
], VoyagesController.prototype, "SaveDataVoyage", null);
VoyagesController = __decorate([
    common_1.Controller('voyages'),
    __metadata("design:paramtypes", [voyages_service_1.VoyagesService,
        ports_service_1.PortsService,
        daily_reports_service_1.DailyReportsService,
        format_excel_last_voyage_service_1.FormatExcelLastVoyageService,
        users_service_1.UsersService])
], VoyagesController);
exports.VoyagesController = VoyagesController;
//# sourceMappingURL=voyages.controller.js.map