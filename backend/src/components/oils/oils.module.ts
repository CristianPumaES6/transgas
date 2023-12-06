import { Module } from '@nestjs/common';
import { OilsController } from './oils.controller';
import { OilsService } from './oils.service';

@Module({
  controllers: [OilsController],
  providers: [OilsService]
})
export class OilsModule {}
