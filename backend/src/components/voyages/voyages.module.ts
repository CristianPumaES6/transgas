import { Module } from '@nestjs/common';
import { VoyagesService } from './voyages.service';
import { VoyagesController } from './voyages.controller';

// modelos de ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voyage } from '../../models/voyage.entity';
import { PortsModule } from './ports/ports.module';
import { DailyReportsModule } from './daily-reports/daily-reports.module';
import { PortsService } from './ports/ports.service';
import { DailyReportsService } from './daily-reports/daily-reports.service';
import { FormatExcelLastVoyageService } from '../../services/format-excel-last-voyage/format-excel-last-voyage.service';
import { UsersModule } from '../users/users.module';



@Module({  
  //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
  imports: [
    TypeOrmModule.forFeature([Voyage]),
    PortsModule,
    DailyReportsModule,
    UsersModule
  ],
  providers: [VoyagesService, FormatExcelLastVoyageService],
  controllers: [VoyagesController]
})
export class VoyagesModule {}
