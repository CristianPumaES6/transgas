import { Module } from '@nestjs/common';
import { DailyReportsService } from './daily-reports.service';
import { DailyReportsController } from './daily-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyReport } from '../../../models/daily-report.entity';

@Module({  //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
  imports: [
    TypeOrmModule.forFeature([DailyReport]),
  ],
  providers: [DailyReportsService],
  controllers: [DailyReportsController]
})
export class DailyReportsModule { }
