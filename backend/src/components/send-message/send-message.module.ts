import { Module } from '@nestjs/common';
import { SendMessageService } from './send-message.service';

@Module({
  providers: [SendMessageService]
})
export class SendMessageModule {}
