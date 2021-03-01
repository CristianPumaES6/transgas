import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';
import { PortsController } from './ports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Port } from 'src/models/port.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Port]),
  ],
  providers: [PortsService],
  controllers: [PortsController]
})
export class PortsModule {

}
