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
exports.PortsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const port_entity_1 = require("../../../models/port.entity");
const typeorm_2 = require("typeorm");
const promises_assets_1 = require("../../../assets/promises.assets");
const server_config_1 = require("../../../config/server.config");
const daily_report_entity_1 = require("../../../models/daily-report.entity");
const moment_assets_1 = require("../../../assets/moment.assets");
const mappingKeys_1 = require("../../../assets/mappingKeys");
let PortsService = class PortsService {
    constructor(portRepository) {
        this.portRepository = portRepository;
    }
    async Create(port) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`SP_CheckTheLastPortTrip @userId='${port.userId}', @voyageId='${port.voyageId}'`);
            }
            else {
                return this.portRepository.find({
                    where: [
                        {
                            userId: port.userId,
                            voyageId: port.voyageId,
                            status: true,
                        },
                    ],
                    take: 1,
                    order: {
                        portNumber: 'DESC',
                    },
                });
            }
        })
            .then((result) => {
            if (result && result.length > 0) {
                port.portNumber = port.portNumber;
            }
            else {
                port.portNumber = 1;
            }
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`
                        EXEC SP_CreateNewPort
                        @userId = ${port.userId},
                        @voyageId = ${port.voyageId},
                        @portNumber = ${port.portNumber},
                        @departurePort = '${port.departurePort}',
                        @arrivalPort = '${port.arrivalPort}',
                        @userIdCreated = ${port.userId},
                        @dateCreated = '${port.dateCreated}',
                        @userIdUpdated = ${port.userIdUpdated || 0},
                        @dateUpdated ='${port.dateUpdated || null}',
                        @status =${port.status ? 1 : 0}
                    `);
            }
            else {
                return this.portRepository.save(port);
            }
        })
            .then(resultSave => {
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
            return resultSave;
        });
    }
    async Get(id) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`
                  EXEC SP_BuscarPuertoPorId  @portId = ${id}
              `);
            }
            else {
                return this.portRepository.findOne({
                    where: [
                        {
                            id: id,
                            status: (0, typeorm_2.Not)(false),
                        },
                    ],
                });
            }
        })
            .then(resultFind => {
            if (!resultFind)
                throw 'port_does_not_exist';
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultFind && resultFind.length == 0) {
                    throw 'port_does_not_exist';
                }
                resultFind = resultFind[0];
            }
            return resultFind;
        });
    }
    async Gets(port) {
        return await this.portRepository
            .find({
            where: [
                {
                    userId: (0, typeorm_2.Like)('%' + (port.userId || '') + '%'),
                    voyageId: (0, typeorm_2.Like)('%' + (port.voyageId || '') + '%'),
                    portNumber: (0, typeorm_2.Like)('%' + (port.portNumber || '') + '%'),
                    departurePort: (0, typeorm_2.Like)('%' + port.departurePort + '%'),
                    arrivalPort: (0, typeorm_2.Like)('%' + port.arrivalPort + '%'),
                    status: (0, typeorm_2.Not)(false),
                },
            ],
        })
            .then((result) => {
            return result;
        });
    }
    async GetsDetail(port) {
        return await this.portRepository
            .find({
            relations: ['dailyReports'],
            where: [
                {
                    userId: (0, typeorm_2.Like)('%' + (port.userId || '') + '%'),
                    voyageId: (0, typeorm_2.Like)('%' + (port.voyageId || '') + '%'),
                    portNumber: (0, typeorm_2.Like)('%' + (port.portNumber || '') + '%'),
                    departurePort: (0, typeorm_2.Like)('%' + port.departurePort + '%'),
                    arrivalPort: (0, typeorm_2.Like)('%' + port.arrivalPort + '%'),
                    status: (0, typeorm_2.Not)(false),
                },
            ],
        })
            .then((result) => {
            return result;
        });
    }
    async Update(port) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`
                  EXEC SP_BuscarPuertoPorId  @portId = ${port.id}
              `);
            }
            else {
                return this.portRepository.find({
                    where: [
                        { id: port.id },
                    ],
                });
            }
        })
            .then(resultFind => {
            if (!resultFind)
                throw 'port_does_not_exist';
            if (resultFind && resultFind.length == 0)
                throw 'port_does_not_exist';
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`
              EXEC SP_UpdatePort
              @portId = ${port.id},
              @userId = ${port.userId},
              @voyageId = ${port.voyageId},
              @portNumber = ${port.portNumber},
              @departurePort = '${port.departurePort}',
              @arrivalPort = '${port.arrivalPort}',
              @userIdCreated = ${port.userId},
              @dateCreated = '${port.dateCreated}',
              @userIdUpdated = ${port.userIdUpdated || 0},
              @dateUpdated ='${port.dateUpdated || null}',
              @status =${port.status ? 1 : 0}
          `);
            }
            else {
                return this.portRepository.update(port.id, port);
            }
        })
            .then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('TYPEORM_UPDATE_VOYAGE');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultUpdate && resultUpdate.length == 0) {
                    throw new Error('ERROR SQLSERVER PROCEDURE NO SE EJECUTO');
                }
            }
            return port;
        });
    }
    async Delete(port) {
        port.status = false;
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`
                      EXEC SP_UpdatePort
                      @portId = ${port.id},
                      @userId = ${port.userId},
                      @voyageId = ${port.voyageId},
                      @portNumber = ${port.portNumber},
                      @departurePort = '${port.departurePort}',
                      @arrivalPort = '${port.arrivalPort}',
                      @userIdCreated = ${port.userId},
                      @dateCreated = '${port.dateCreated}',
                      @userIdUpdated = ${port.userIdUpdated || 0},
                      @dateUpdated ='${port.dateUpdated || null}',
                      @status =${port.status ? 1 : 0}
                  `);
            }
            else {
                return this.portRepository.update(port.id, port).then(resultSave => {
                    if (!resultSave)
                        throw new Error('error_update_delete_port');
                    return port;
                });
            }
        })
            .then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('TYPEORM_UPDATE_VOYAGE');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultUpdate && resultUpdate.length == 0) {
                    throw new Error('ERROR SQLSERVER PROCEDURE NO SE EJECUTO');
                }
                resultUpdate = resultUpdate[0];
            }
            return port;
        });
    }
    async ThereIsThisPortInTheVoyage(portNumber, voyageId, userId) {
        let portSearch;
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`
                        SP_ThereIsThisPortInTheVoyage 
                            @voyageId='${voyageId}',
                            @portNumber='${portNumber}'
                    `);
            }
            else {
                return this.portRepository.find({
                    where: [
                        {
                            voyageId: voyageId,
                            portNumber: portNumber,
                            userId: userId,
                            status: true,
                        },
                    ],
                    take: 1,
                });
            }
        })
            .then(resultFind => {
            if (resultFind && resultFind.length) {
                portSearch = resultFind[0];
                return resultFind[0];
            }
            else {
                return null;
            }
        })
            .catch(err => {
            throw '';
        });
    }
    async GetLastPortTotalConsumpByUserId(userId) {
        return await (0, promises_assets_1.DummyPromise)()
            .then(result => {
            return (this.portRepository
                .createQueryBuilder('port')
                .select('port.id', 'portId')
                .addSelect('port.userId', 'userId')
                .addSelect('port.departurePort', 'departurePort')
                .addSelect('port.arrivalPort', 'arrivalPort')
                .addSelect('port.startDate', 'startDate')
                .addSelect('port.startIFO', 'startIFO')
                .addSelect('port.startMGO', 'startMGO')
                .addSelect('max(daily_report.date)', 'maxDate')
                .addSelect('SUM(daily_report.bunkeringIfo)', 'bunkeringIfo')
                .addSelect('SUM(daily_report.bunkeringMgo)', 'bunkeringMgo')
                .addSelect('SUM(daily_report.mplaIfo)', 'mplaIfo')
                .addSelect('SUM(daily_report.auxIfo)', 'auxIfo')
                .addSelect('SUM(daily_report.boilerIfo)', 'boilerIfo')
                .addSelect('SUM(daily_report.otherIfo)', 'otherIfo')
                .addSelect('SUM(daily_report.mplaMgo)', 'mplaMgo')
                .addSelect('SUM(daily_report.auxMgo)', 'auxMgo')
                .addSelect('SUM(daily_report.boilerMgo)', 'boilerMgo')
                .addSelect('SUM(daily_report.ppMgo)', 'ppMgo')
                .addSelect('SUM(daily_report.giMgo)', 'giMgo')
                .addSelect('SUM(daily_report.otherMgo)', 'otherMgo')
                .addSelect('SUM(daily_report.distance)', 'distance')
                .leftJoinAndSelect(daily_report_entity_1.DailyReport, 'daily_report', 'port.id = daily_report.portId AND daily_report.status= 1')
                .where('port.userId = :userId', { userId: userId })
                .groupBy('port.id, port.userId, port.departurePort, port.arrivalPort,port.startDate, port.startIFO, port.startMGO')
                .orderBy('port.id', 'DESC')
                .limit(1)
                .getRawMany());
        })
            .then((result) => {
            if (!result)
                throw 'ERROR GetLastPortTotalConsumpByUserId';
            return result;
        });
    }
    async SaveList(MappingVoyages, importPorts) {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        let MappingPorts = [];
        const addPorts = importPorts.filter((port) => port.SyncStatus == 'added');
        const updatePorts = importPorts.filter((port) => port.SyncStatus == 'updated');
        const deletePorts = importPorts.filter((port) => port.SyncStatus == 'deleted');
        try {
            for (var _k = true, addPorts_1 = __asyncValues(addPorts), addPorts_1_1; addPorts_1_1 = await addPorts_1.next(), _a = addPorts_1_1.done, !_a; _k = true) {
                _c = addPorts_1_1.value;
                _k = false;
                const addPort = _c;
                let searchMappingVoyage = (0, mappingKeys_1.searchKey)(MappingVoyages, addPort.voyageId);
                let newPortEntity = new port_entity_1.Port();
                delete newPortEntity.id;
                newPortEntity.userId = addPort.userId;
                newPortEntity.voyageId = addPort.voyageId;
                if (searchMappingVoyage) {
                    newPortEntity.voyageId = searchMappingVoyage.value;
                }
                newPortEntity.portNumber = addPort.portNumber;
                newPortEntity.departurePort = addPort.departurePort;
                newPortEntity.arrivalPort = addPort.arrivalPort;
                newPortEntity.startDate = addPort.startDate;
                newPortEntity.startIFO = addPort.startIFO;
                newPortEntity.startMGO = addPort.startMGO;
                newPortEntity.dateETA = addPort.dateETA;
                newPortEntity.historyDateETA = addPort.historyDateETA;
                newPortEntity.userIdCreated = addPort.userIdCreated;
                newPortEntity.dateCreated = (0, moment_assets_1.GetDate)();
                delete newPortEntity.userIdUpdated;
                delete newPortEntity.dateUpdated;
                newPortEntity.status = Boolean(addPort.status);
                let registers = await this.Create(newPortEntity);
                MappingPorts.push(new mappingKeys_1.Mapping(addPort.id, registers.id));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = addPorts_1.return)) await _b.call(addPorts_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _l = true, updatePorts_1 = __asyncValues(updatePorts), updatePorts_1_1; updatePorts_1_1 = await updatePorts_1.next(), _d = updatePorts_1_1.done, !_d; _l = true) {
                _f = updatePorts_1_1.value;
                _l = false;
                const updatePort = _f;
                let updatePortEntity = new port_entity_1.Port();
                let searchMappingVoyage = (0, mappingKeys_1.searchKey)(MappingVoyages, updatePort.voyageId);
                updatePortEntity.id = updatePort.id;
                updatePortEntity.userId = updatePort.userId;
                updatePortEntity.voyageId = updatePort.voyageId;
                if (searchMappingVoyage) {
                    updatePortEntity.voyageId = searchMappingVoyage.value;
                }
                updatePortEntity.portNumber = updatePort.portNumber;
                updatePortEntity.departurePort = updatePort.departurePort;
                updatePortEntity.arrivalPort = updatePort.arrivalPort;
                updatePortEntity.startDate = updatePort.startDate;
                updatePortEntity.startIFO = updatePort.startIFO;
                updatePortEntity.startMGO = updatePort.startMGO;
                updatePortEntity.dateETA = updatePort.dateETA;
                updatePortEntity.historyDateETA = updatePort.historyDateETA;
                updatePortEntity.userIdCreated = updatePort.userIdCreated;
                updatePortEntity.dateCreated = updatePort.dateCreated;
                updatePortEntity.userIdUpdated = updatePort.userIdUpdated;
                updatePortEntity.dateUpdated = updatePort.dateUpdated;
                updatePortEntity.status = Boolean(updatePort.status);
                await this.portRepository.save(updatePort);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_l && !_d && (_e = updatePorts_1.return)) await _e.call(updatePorts_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _m = true, deletePorts_1 = __asyncValues(deletePorts), deletePorts_1_1; deletePorts_1_1 = await deletePorts_1.next(), _g = deletePorts_1_1.done, !_g; _m = true) {
                _j = deletePorts_1_1.value;
                _m = false;
                let deletePort = _j;
                let deletePortEntity = new port_entity_1.Port();
                let searchMappingVoyage = (0, mappingKeys_1.searchKey)(MappingVoyages, deletePort.voyageId);
                deletePortEntity.id = deletePort.id;
                deletePortEntity.userId = deletePort.userId;
                deletePortEntity.voyageId = deletePort.voyageId;
                if (searchMappingVoyage) {
                    deletePort.voyageId = searchMappingVoyage.value;
                }
                deletePortEntity.portNumber = deletePort.portNumber;
                deletePortEntity.departurePort = deletePort.departurePort;
                deletePortEntity.arrivalPort = deletePort.arrivalPort;
                deletePortEntity.startDate = deletePort.startDate;
                deletePortEntity.startIFO = deletePort.startIFO;
                deletePortEntity.startMGO = deletePort.startMGO;
                deletePortEntity.dateETA = deletePort.dateETA;
                deletePortEntity.historyDateETA = deletePort.historyDateETA;
                deletePortEntity.userIdCreated = deletePort.userIdCreated;
                deletePortEntity.dateCreated = deletePort.dateCreated;
                deletePortEntity.userIdUpdated = deletePort.userIdUpdated;
                deletePortEntity.dateUpdated = deletePort.dateUpdated;
                deletePortEntity.status = Boolean(deletePort.status);
                await this.portRepository.save(deletePort);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_g && (_h = deletePorts_1.return)) await _h.call(deletePorts_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return MappingPorts;
    }
};
exports.PortsService = PortsService;
exports.PortsService = PortsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(port_entity_1.Port)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PortsService);
//# sourceMappingURL=ports.service.js.map