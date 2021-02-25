import { Module } from '@nestjs/common';
import { DailyReportsService } from './daily-reports.service';

@Module({
  providers: [DailyReportsService]
})
export class DailyReportsModule {}
