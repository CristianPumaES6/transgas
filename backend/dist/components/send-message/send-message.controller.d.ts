import { SendMessageService } from './send-message.service';
import { SendMessageEntity } from '../../models/send-message.entity';
export declare class SendMessageController {
    private readonly _sendMessageService;
    constructor(_sendMessageService: SendMessageService);
    GetConfigSendMail(headers: any, sendMessageEntity: SendMessageEntity): Promise<any>;
    SaveConfig(headers: any, sendMessageEntity: SendMessageEntity): Promise<any>;
}
