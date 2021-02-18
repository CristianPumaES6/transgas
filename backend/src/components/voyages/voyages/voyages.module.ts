import { Module } from '@nestjs/common';
import { VoyagesService } from './voyages.service';
import { VoyagesController } from './voyages.controller';

@Module({
  providers: [VoyagesService],
  controllers: [VoyagesController]
})
export class VoyagesModule {}
