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
let PortsService = class PortsService {
    constructor(portRepository) {
        this.portRepository = portRepository;
    }
    async Create(port) {
        return await this.portRepository.find({
            where: [
                {
                    userId: port.userId,
                    voyageId: port.voyageId
                }
            ],
            take: 1,
            order: {
                portNumber: 'DESC',
            }
        }).then((result) => {
            if (result && (result.length > 0)) {
                port.portNumber = Number(result[0].portNumber) + 1;
            }
            else {
                port.portNumber = 1;
            }
            ;
            return this.portRepository.save(port);
        }).then((resultSave) => {
            if (!resultSave)
                throw new Error('No se puedo registrar el viaje en la BD.');
            return resultSave;
        });
    }
    async Get(id) {
        return await this.portRepository.findOne({
            where: {
                id: id,
                status: typeorm_2.Not(false)
            }
        }).then((resultFind) => {
            if (!resultFind)
                throw 'port_does_not_exist';
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
        return await this.portRepository.findOne({
            where: [
                { id: port.id }
            ]
        }).then(resultFind => {
            if (!resultFind)
                throw 'port_does_not_exist';
            return this.portRepository.update(port.id, port);
        }).then(resultUpdate => {
            if (!resultUpdate)
                throw new Error('TYPEORM_UPDATE_VOYAGE');
            return port;
        });
    }
    async Delete(port) {
        port.status = false;
        return await this.portRepository.update(port.id, port).then(resultSave => {
            if (!resultSave)
                throw new Error('error_update_delete_port');
            return port;
        });
    }
    async ThereIsThisPortInTheVoyage(numeroPuerto, voyageId) {
        return await this.portRepository.findOne({
            where: [
                {
                    voyageId: voyageId,
                    portNumber: numeroPuerto,
                }
            ]
        }).then(resultFind => {
            return resultFind;
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