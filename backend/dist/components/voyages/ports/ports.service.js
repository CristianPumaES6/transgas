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
exports.PortsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const port_entity_1 = require("../../../models/port.entity");
const typeorm_2 = require("typeorm");
const promises_assets_1 = require("../../../assets/promises.assets");
const server_config_1 = require("../../../config/server.config");
let PortsService = class PortsService {
    constructor(portRepository) {
        this.portRepository = portRepository;
    }
    async Create(port) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`SP_CheckTheLastPortTrip @userId='${port.userId}', @voyageId='${port.voyageId}'`);
            }
            else {
                return this.portRepository.find({
                    where: [
                        {
                            userId: port.userId,
                            voyageId: port.voyageId,
                            status: true
                        }
                    ],
                    take: 1,
                    order: {
                        portNumber: 'DESC',
                    }
                });
            }
        }).then((result) => {
            if (result && (result.length > 0)) {
                port.portNumber = port.portNumber;
            }
            else {
                port.portNumber = 1;
            }
            ;
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
            return resultSave;
        });
    }
    async Get(id) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`
                  EXEC SP_BuscarPuertoPorId  @portId = ${id}
              `);
            }
            else {
                return this.portRepository.findOne({
                    where: {
                        id: id,
                        status: typeorm_2.Not(false)
                    }
                });
            }
        }).then((resultFind) => {
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
        return await this.portRepository.find({
            where: [
                {
                    userId: typeorm_2.Like('%' + (port.userId || '') + '%'),
                    voyageId: typeorm_2.Like('%' + (port.voyageId || '') + '%'),
                    portNumber: typeorm_2.Like('%' + (port.portNumber || '') + '%'),
                    departurePort: typeorm_2.Like('%' + port.departurePort + '%'),
                    arrivalPort: typeorm_2.Like('%' + port.arrivalPort + '%'),
                    status: typeorm_2.Not(false)
                }
            ]
        }).then((result) => {
            return result;
        });
    }
    async GetsDetail(port) {
        return await this.portRepository.find({
            relations: ['dailyReports'],
            where: [
                {
                    userId: typeorm_2.Like('%' + (port.userId || '') + '%'),
                    voyageId: typeorm_2.Like('%' + (port.voyageId || '') + '%'),
                    portNumber: typeorm_2.Like('%' + (port.portNumber || '') + '%'),
                    departurePort: typeorm_2.Like('%' + port.departurePort + '%'),
                    arrivalPort: typeorm_2.Like('%' + port.arrivalPort + '%'),
                    status: typeorm_2.Not(false)
                }
            ]
        }).then((result) => {
            return result;
        });
    }
    async Update(port) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this.portRepository.query(`
                  EXEC SP_BuscarPuertoPorId  @portId = ${port.id}
              `);
            }
            else {
                return this.portRepository.find({
                    where: [
                        { id: port.id }
                    ]
                });
            }
        }).then(resultFind => {
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
        }).then(resultUpdate => {
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
        return promises_assets_1.DummyPromise().then(result => {
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
        }).then(resultUpdate => {
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
        return promises_assets_1.DummyPromise().then(result => {
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
                            userId: userId
                        }
                    ],
                    take: 1,
                });
            }
        }).then(resultFind => {
            if (resultFind && resultFind.length) {
                let prueba = resultFind[0];
                return resultFind[0];
            }
            else {
                return null;
            }
        }).catch(err => {
            throw '';
        });
    }
};
PortsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(port_entity_1.Port)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PortsService);
exports.PortsService = PortsService;
//# sourceMappingURL=ports.service.js.map