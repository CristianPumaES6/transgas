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
exports.SendMessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const server_config_1 = require("../../config/server.config");
const promises_assets_1 = require("../../assets/promises.assets");
const send_message_entity_1 = require("../../models/send-message.entity");
let SendMessageService = class SendMessageService {
    constructor(_sendMessageRepository) {
        this._sendMessageRepository = _sendMessageRepository;
    }
    async test() {
        return await false;
    }
    async Create(sendMessageEntity) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                return this._sendMessageRepository.query("SP_ @userId='" +
                    sendMessageEntity.userId +
                    "', @year='" +
                    sendMessageEntity.emails +
                    "'");
            }
            else {
                if (sendMessageEntity.id) {
                    return this._sendMessageRepository.find({
                        where: [
                            {
                                userId: sendMessageEntity.userId,
                                emails: sendMessageEntity.emails,
                                status: true,
                            },
                        ],
                        take: 1,
                        order: {
                            id: 'DESC',
                        },
                    });
                }
                else {
                    return true;
                }
            }
        })
            .then((result) => {
            if (result) {
                if (server_config_1.URL_Server.bd === 'MSSQL') {
                    return this._sendMessageRepository.query(`
                            SP_ @userId =  ${sendMessageEntity.userId}  ,
                            @userIdCreated =   ${sendMessageEntity.userIdCreated} ,
                            @dateCreated = '${sendMessageEntity.dateCreated}',
                            @userIdUpdated =  ${sendMessageEntity.userIdUpdated
                        ? sendMessageEntity.userIdUpdated
                        : 0} ,
                            @dateUpdated = '${sendMessageEntity.dateUpdated ||
                        ''}' ,
                            @status = ${sendMessageEntity.status} 
                            `);
                }
                else {
                    if (result.length > 0) {
                        sendMessageEntity.id = result[0].id;
                    }
                    sendMessageEntity.status = Boolean(sendMessageEntity.status);
                    return this._sendMessageRepository.save(sendMessageEntity);
                }
            }
        })
            .then((resultSave) => {
            if (!resultSave)
                throw new Error('No se pudo guardar la configuracion del mail.');
            if (server_config_1.URL_Server.bd === 'MSSQL') {
                if (resultSave.length == 0)
                    throw new Error('No se puedo registrar la configuracion en la BD.');
                return resultSave[0];
            }
            else {
                return resultSave;
            }
        });
    }
    async BuscamosLaConfiracionDelBuque(sendMessageEntity) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            if (server_config_1.URL_Server.bd === 'MSSQL') {
            }
            else {
                return this._sendMessageRepository.find({
                    where: [
                        {
                            userId: Number(sendMessageEntity.userId),
                            status: (0, typeorm_2.Not)(false),
                        },
                    ],
                    order: {
                        id: 'ASC',
                    },
                });
            }
        })
            .then((resultFind) => {
            if (!resultFind)
                throw new Error('does_not_exist');
            if (resultFind && resultFind.length > 0) {
                let resultSendMessage = resultFind[0];
                return resultSendMessage;
            }
            else {
                return new send_message_entity_1.SendMessageEntity();
            }
        });
    }
};
exports.SendMessageService = SendMessageService;
exports.SendMessageService = SendMessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(send_message_entity_1.SendMessageEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SendMessageService);
//# sourceMappingURL=send-message.service.js.map