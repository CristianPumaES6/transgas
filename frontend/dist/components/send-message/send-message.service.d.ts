import { Repository } from 'typeorm';
import { SendMessageEntity } from '../../models/send-message.entity';
export declare class SendMessageService {
    private _sendMessageRepository;
    constructor(_sendMessageRepository: Repository<SendMessageEntity>);
    test(): Promise<boolean>;
    Create(sendMessageEntity: SendMessageEntity): Promise<SendMessageEntity>;
    BuscamosLaConfiracionDelBuque(sendMessageEntity: SendMessageEntity): Promise<SendMessageEntity>;
}
