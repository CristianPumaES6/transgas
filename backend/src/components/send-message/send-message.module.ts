import { Module } from '@nestjs/common';
import { SendMessageService } from './send-message.service';
import { SendMessageController } from './send-message.controller';

// modelos de ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendMessageEntity } from '../../models/send-message.entity';
import { FormatExcelLastVoyageService } from '../../services/format-excel-last-voyage/format-excel-last-voyage.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SendMessageEntity])],
  providers: [SendMessageService],
  controllers: [SendMessageController],
})
export class SendMessageModule {}
