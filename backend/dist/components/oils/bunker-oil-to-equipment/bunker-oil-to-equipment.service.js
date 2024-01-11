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
exports.BunkerOilToEquipmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const promises_assets_1 = require("../../../assets/promises.assets");
const server_config_1 = require("../../../config/server.config");
const buker_oil_to_equipment_entity_1 = require("../../../models/buker-oil-to-equipment.entity");
const typeorm_2 = require("typeorm");
let BunkerOilToEquipmentService = class BunkerOilToEquipmentService {
    constructor(_BunkerOilToEquipment) {
        this._BunkerOilToEquipment = _BunkerOilToEquipment;
    }
    async Gets(groupOilEntity) {
        return promises_assets_1.DummyPromise().then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return null;
            }
            else {
                return this._BunkerOilToEquipment.find({
                    where: [
                        {
                            id: (groupOilEntity.id || typeorm_2.Like('%' + '%')),
                            userId: (groupOilEntity.userId || typeorm_2.Like('%' + '%')),
                            status: typeorm_2.Not(false)
                        }
                    ]
                });
            }
        }).then((result) => {
            if (!result)
                throw 'ERROR AL CONSULTAR LOS CONSUMO DE EQUIPOS.';
            return result;
        });
    }
};
BunkerOilToEquipmentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(buker_oil_to_equipment_entity_1.BunkerOilToEquipmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BunkerOilToEquipmentService);
exports.BunkerOilToEquipmentService = BunkerOilToEquipmentService;
//# sourceMappingURL=bunker-oil-to-equipment.service.js.map