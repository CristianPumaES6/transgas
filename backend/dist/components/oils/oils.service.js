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
exports.OilsService = void 0;
const common_1 = require("@nestjs/common");
const oil_entity_1 = require("../../models/oil.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
const server_config_1 = require("../../config/server.config");
const promises_assets_1 = require("../../assets/promises.assets");
const moment_assets_1 = require("../../assets/moment.assets");
let OilsService = class OilsService {
    constructor(_oilRepository) {
        this._oilRepository = _oilRepository;
    }
    async Get(id) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._oilRepository.query(`
                     EXEC SP_BuscarReportePorId 
                    @dailyReportId = ${id} 
                    `);
            }
            else {
                return this._oilRepository.find({
                    where: [{
                            id: id,
                        }]
                });
            }
        }).then((resultFind) => {
            if (!resultFind)
                throw new Error('does_not_exist');
            if (resultFind && resultFind.length == 0)
                throw new Error('does_not_exist');
            let returnDailyReport = resultFind[0];
            return returnDailyReport;
        });
    }
    async Gets(oilEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._oilRepository.find({
                    where: [
                        {
                            userId: (oilEntity.userId || typeorm_3.Like('%' + '%')),
                            name: typeorm_3.Like('%' + (oilEntity.name || '') + '%'),
                            status: typeorm_4.Not(false)
                        }
                    ]
                });
            }
        }).then((result) => {
            if (!result)
                throw 'ERROR AL CONSULTAR LOS ACEITES.';
            return result;
        });
    }
    async Create(oilEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return;
            }
            else {
                return this._oilRepository.save(oilEntity);
            }
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el aceite en la BD.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar el aceite en la BD.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async Update(oilEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            return this.Get(oilEntity.id);
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('does_not_exist');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._oilRepository.update(oilEntity.id, oilEntity);
            }
        }).then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('ERROR_TYPEORM_UPDATE_PORT');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
            }
            return oilEntity;
        });
    }
    async Delete(oilEntity, usuarioDelete) {
        let returnOilEntity;
        return promises_assets_1.DummyPromise().then(result => {
            return this.Get(oilEntity.id);
        }).then(resultFind => {
            if (!resultFind)
                throw new Error('does_not_exist');
            resultFind.userIdUpdated = usuarioDelete;
            resultFind.dateUpdated = moment_assets_1.GetDate();
            resultFind.status = false;
            returnOilEntity = resultFind;
            return this.Update(resultFind);
        }).then(resultSave => {
            if (!resultSave)
                throw new Error('ERROR_TYPEORM_UPDATE_PORT');
            return returnOilEntity;
        });
    }
};
OilsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(oil_entity_1.OilEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OilsService);
exports.OilsService = OilsService;
//# sourceMappingURL=oils.service.js.map