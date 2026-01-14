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
exports.SendMessageController = void 0;
const common_1 = require("@nestjs/common");
const send_message_service_1 = require("./send-message.service");
const common_2 = require("@nestjs/common");
const promises_assets_1 = require("../../assets/promises.assets");
const jwtDecode_assets_1 = require("../../assets/jwtDecode.assets");
const moment_assets_1 = require("../../assets/moment.assets");
const send_message_entity_1 = require("../../models/send-message.entity");
let SendMessageController = class SendMessageController {
    constructor(_sendMessageService) {
        this._sendMessageService = _sendMessageService;
    }
    async GetConfigSendMail(headers, sendMessageEntity) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            if (sendMessageEntity) {
                if (!sendMessageEntity.userId) {
                    throw new Error('MISSING_FIELS');
                }
                else {
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' || headerToken.role == 'OWNER') {
                    }
                    else if ((Number(sendMessageEntity.userId) !== Number(headerToken.id)))
                        throw new Error('ERROR_USERID_FAIL');
                    return true;
                }
            }
            else
                throw new Error('MISSING_FIELS');
        }).then((resultValidate) => {
            return this._sendMessageService.BuscamosLaConfiracionDelBuque(sendMessageEntity);
        }).then((results) => {
            return {
                status: common_2.HttpStatus.OK,
                message: 'OK',
                data: results
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_2.HttpException({
                status: common_2.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_2.HttpStatus.ACCEPTED);
        });
    }
    async SaveConfig(headers, sendMessageEntity) {
        let headerToken = (0, jwtDecode_assets_1.JwtDecode)(headers.authorization);
        return (0, promises_assets_1.DummyPromise)().then((resultDummy) => {
            if (sendMessageEntity && sendMessageEntity.emails && sendMessageEntity.status) {
                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                }
                else if (sendMessageEntity.userId !== headerToken.id)
                    throw new Error('ERROR_USERID_FAIL');
                if (Number(sendMessageEntity.id) > 0) {
                    sendMessageEntity.id = Number(sendMessageEntity.id);
                    sendMessageEntity.dateUpdated = (0, moment_assets_1.GetDate)();
                    sendMessageEntity.userIdUpdated = headerToken.id;
                }
                else {
                    delete sendMessageEntity.id;
                    sendMessageEntity.dateCreated = (0, moment_assets_1.GetDate)();
                    sendMessageEntity.userIdCreated = headerToken.id;
                }
                sendMessageEntity.status = Boolean(sendMessageEntity.status);
                return this._sendMessageService.Create(sendMessageEntity);
            }
            else
                throw 'MISSING_FIELS';
        }).then((resultSave) => {
            return {
                status: common_2.HttpStatus.OK,
                message: 'OK',
                data: resultSave
            };
        }).catch(err => {
            const clientMsg = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
            const errorMsg = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');
            throw new common_2.HttpException({
                status: common_2.HttpStatus.ACCEPTED,
                error: clientMsg,
                message: errorMsg,
            }, common_2.HttpStatus.ACCEPTED);
        });
    }
};
exports.SendMessageController = SendMessageController;
__decorate([
    (0, common_2.Get)('configSendMail'),
    __param(0, (0, common_2.Headers)()),
    __param(1, (0, common_2.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_message_entity_1.SendMessageEntity]),
    __metadata("design:returntype", Promise)
], SendMessageController.prototype, "GetConfigSendMail", null);
__decorate([
    (0, common_2.Post)('saveConfig'),
    __param(0, (0, common_2.Headers)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_message_entity_1.SendMessageEntity]),
    __metadata("design:returntype", Promise)
], SendMessageController.prototype, "SaveConfig", null);
exports.SendMessageController = SendMessageController = __decorate([
    (0, common_1.Controller)('send-message'),
    __metadata("design:paramtypes", [send_message_service_1.SendMessageService])
], SendMessageController);
//# sourceMappingURL=send-message.controller.js.map