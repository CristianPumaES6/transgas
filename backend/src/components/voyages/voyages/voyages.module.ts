import { Module } from '@nestjs/common';
import { VoyagesService } from './voyages.service';

@Module({
  providers: [VoyagesService]
})
export class VoyagesModule {}
