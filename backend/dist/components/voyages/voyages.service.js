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
exports.VoyagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
const promises_assets_1 = require("../../assets/promises.assets");
const voyage_entity_1 = require("../../models/voyage.entity");
const server_config_1 = require("../../config/server.config");
let VoyagesService = class VoyagesService {
    constructor(voyageRepository) {
        this.voyageRepository = voyageRepository;
    }
    async Create(voyage) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.voyageRepository.query("SP_CheckTheLastRecordedTrip @userId='" + voyage.userId + "', @year='" + voyage.year + "'");
            }
            else {
                return this.voyageRepository.find({
                    where: [
                        {
                            userId: voyage.userId,
                            year: voyage.year,
                            status: true,
                        }
                    ],
                    take: 1,
                    order: {
                        voyageNumber: 'DESC',
                    }
                });
            }
        }).then((result) => {
            if (result && (result.length > 0)) {
                voyage.voyageNumber = voyage.voyageNumber;
            }
            else {
                voyage.voyageNumber = voyage.voyageNumber;
            }
            ;
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.voyageRepository.query(`
                    SP_CreateNewVoyage @userId =  ${voyage.userId}  ,
                    @voyageNumber =  ${voyage.voyageNumber} , 
                    @year = ${voyage.year} ,
                    @userIdCreated =   ${voyage.userIdCreated} ,
                    @dateCreated = '${voyage.dateCreated}',
                    @userIdUpdated =  ${voyage.userIdUpdated ? voyage.userIdUpdated : 0} ,
                    @dateUpdated = '${voyage.dateUpdated || ''}' ,
                    @status = ${voyage.status} 
                    `);
            }
            else {
                return this.voyageRepository.save(voyage);
            }
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el viaje en la BD.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el viaje en la BD.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async Get(id) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.voyageRepository.query(`EXEC SP_ObtenerViajePorId @voyageId=${id || 0}`);
            }
            else {
                return this.voyageRepository.find({
                    where: [{
                            id: id,
                            status: typeorm_4.Not(false)
                        }]
                });
            }
        }).then((resultFind) => {
            if (!resultFind)
                throw new Error('voyage_does_not_exist');
            if (resultFind && resultFind.length == 0)
                throw new Error('voyage_does_not_exist');
            let voyageReturn = resultFind[0];
            return voyageReturn;
        });
    }
    async Gets(voyage, page = 1) {
        return await this.voyageRepository.find({
            where: [
                {
                    userId: typeorm_3.Like('%' + (voyage.userId || '') + '%'),
                    voyageNumber: typeorm_3.Like('%' + (voyage.voyageNumber || '') + '%'),
                    year: typeorm_3.Like('%' + (voyage.year || '') + '%'),
                    status: typeorm_4.Not(false)
                }
            ],
            take: 5,
            skip: 5 * (page - 5),
            order: {
                voyageNumber: 'DESC',
            }
        }).then((result) => {
            return result;
        });
    }
    async GetsDetails(voyage, page = 1) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd == 'MSSQL') {
                return this.InfoVoyage(voyage.userId);
            }
            else {
                return this.voyageRepository.find({
                    relations: ["ports"],
                    where: [
                        {
                            userId: (voyage.userId || ''),
                            voyageNumber: typeorm_3.Like('%' + (voyage.voyageNumber || '') + '%'),
                            year: voyage.year,
                            status: typeorm_4.Not(false)
                        }
                    ],
                    take: 5,
                    skip: 5 * (page - 5),
                    order: {
                        voyageNumber: 'DESC',
                    }
                });
            }
        }).then((result) => {
            return result;
        }).catch(result => {
            throw result;
        });
    }
    async InfoVoyage(userId) {
        var e_1, _a, e_2, _b;
        let voyages = [];
        if (server_config_1.URL_Server.bd === 'MSSQL') {
            voyages = await this.voyageRepository.query(`EXEC SP_ObtenerLosUltimos5Viajes @userId=${userId || 0}`);
        }
        let viajesConPuerto = [];
        try {
            for (var voyages_1 = __asyncValues(voyages), voyages_1_1; voyages_1_1 = await voyages_1.next(), !voyages_1_1.done;) {
                let voyage = voyages_1_1.value;
                let puertos = await this.voyageRepository.query(`EXEC SP_ObtenerLosPuertoDeUnViaje @userId=${userId || 0}, @voyageId=${voyage.id || 0}`);
                let puertosConReportes = [];
                try {
                    for (var puertos_1 = (e_2 = void 0, __asyncValues(puertos)), puertos_1_1; puertos_1_1 = await puertos_1.next(), !puertos_1_1.done;) {
                        let puerto = puertos_1_1.value;
                        let reportes = await this.voyageRepository.query(`EXEC SP_ObtenerLosReportesDelPuerto @portId=${puerto.id || 0}`);
                        puerto.dailyReports = reportes;
                        puertosConReportes.push(puerto);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (puertos_1_1 && !puertos_1_1.done && (_b = puertos_1.return)) await _b.call(puertos_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                voyage.ports = puertosConReportes;
                viajesConPuerto.push(voyage);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (voyages_1_1 && !voyages_1_1.done && (_a = voyages_1.return)) await _a.call(voyages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return viajesConPuerto;
    }
    async GetsByYears(voyageFilterByYears) {
        return await this.voyageRepository.find({
            relations: ["ports"],
            where: [
                {
                    userId: voyageFilterByYears.userId,
                    year: typeorm_2.In(voyageFilterByYears.years),
                    status: typeorm_4.Not(false)
                }
            ],
            order: {
                id: 'ASC',
            }
        }).then((result) => {
            return result;
        });
    }
    async Update(voyage) {
        return await this.voyageRepository.findOne({
            where: [
                { id: voyage.id }
            ]
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('voyage_does_not_exist');
            return this.voyageRepository.update(voyage.id, voyage);
        }).then(resultUpdate => {
            if (!resultUpdate)
                throw 'TYPEORM_UPDATE_VOYAGE';
            return voyage;
        });
    }
    async Delete(voyage) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd == 'MSSQL') {
                return this.voyageRepository.query(`EXEC SP_DeleteVoyageById @voyageId=${voyage.id || 0} `);
            }
            else {
                return this.voyageRepository.update(voyage.id, voyage);
            }
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('error_update_delete_voyage');
            if (server_config_1.URL_Server.bd == 'MSSQL') {
                if (resultSave && resultSave.length == 0)
                    throw new Error('error_update_delete_voyage');
            }
            else {
            }
            return voyage;
        });
    }
    async ThisVoyageNumberExistsInTheYear(voyageNumber, yearVoyage, userId) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.voyageRepository.query("SP_ThisVoyageNumberExistsInTheYear @voyageNumber='" + voyageNumber + "', @yearVoyage='" + yearVoyage + "'");
            }
            else {
                return this.voyageRepository.findOne({
                    where: [
                        {
                            voyageNumber: voyageNumber,
                            year: yearVoyage,
                            userId: userId,
                            status: true
                        }
                    ]
                });
            }
        }).then((resultFind) => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (!resultFind && resultFind.length > 0) {
                    throw 'NO_REGISTER';
                }
                return resultFind[0];
            }
            else {
                return resultFind;
            }
        });
    }
    async ThisVoyageIdExists(voyageId, userId) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.voyageRepository.query("SP_ThisVoyageNumberExistsInTheYear @id='" + voyageId + "', @userId='" + userId + "'");
            }
            else {
                return this.voyageRepository.findOne({
                    where: [
                        {
                            id: voyageId,
                            userId: userId,
                            status: 1
                        }
                    ]
                });
            }
        }).then((resultFind) => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (!resultFind && resultFind.length > 0)
                    throw 'NO_REGISTER';
                return resultFind[0];
            }
            else {
                return resultFind;
            }
        });
    }
    async GetLastVoyage(userId) {
        return await this.voyageRepository.createQueryBuilder('voyage')
            .select('voyage.id', 'id')
            .addSelect('voyage.voyageNumber', 'voyageNumber')
            .addSelect('voyage.year', 'year')
            .where('voyage.userId = :userId', { userId: userId })
            .andWhere('voyage.status = :status', { status: 1 })
            .orderBy('voyage.id', 'DESC')
            .limit(2)
            .getRawMany()
            .then((result) => {
            if (!result)
                throw 'ERROR GetLastVoyage';
            return result;
        });
    }
};
VoyagesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(voyage_entity_1.Voyage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VoyagesService);
exports.VoyagesService = VoyagesService;
//# sourceMappingURL=voyages.service.js.map