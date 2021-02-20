import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';
import { PortsController } from './ports.controller';

@Module({
  providers: [PortsService],
  controllers: [PortsController]
})
export class PortsModule {
    
}
