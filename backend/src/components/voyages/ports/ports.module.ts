import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';

@Module({
  providers: [PortsService]
})
export class PortsModule {
    
}
