import { DailyReport } from 'src/models/daily-report.entity';
import { DailyReportsService } from './daily-reports.service';
export declare class DailyReportsController {
    private readonly _dailyReportsService;
    constructor(_dailyReportsService: DailyReportsService);
    Get(id: any): Promise<any>;
    Gets(headers: any, dailyReport: DailyReport): Promise<any>;
    Create(headers: any, dailyReport: DailyReport): Promise<any>;
    Update(headers: any, id: any, dailyReport: DailyReport): Promise<any>;
    Delete(headers: any, id: any): Promise<any>;
}
