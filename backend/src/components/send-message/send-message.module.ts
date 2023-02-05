import { Module } from '@nestjs/common';
import { SendMessageService } from './send-message.service';
import { SendMessageController } from './send-message.controller';

@Module({
  providers: [SendMessageService],
  controllers: [SendMessageController]
})
export class SendMessageModule {}
