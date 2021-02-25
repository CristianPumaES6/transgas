import { Module } from '@nestjs/common';
import { DailyReportsService } from './daily-reports.service';
import { DailyReportsController } from './daily-reports.controller';

@Module({
  providers: [DailyReportsService],
  controllers: [DailyReportsController]
})
export class DailyReportsModule {}
