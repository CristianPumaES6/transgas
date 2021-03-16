import { DailyReport } from 'src/models/daily-report.entity';
import { Repository } from 'typeorm';
export declare class DailyReportsService {
    private _dailyReportRepository;
    constructor(_dailyReportRepository: Repository<DailyReport>);
    Create(dailyReport: DailyReport): Promise<DailyReport>;
    Get(id: Number): Promise<DailyReport>;
    Gets(dailyReport: DailyReport): Promise<DailyReport[]>;
    Update(dailyReport: DailyReport): Promise<DailyReport>;
    Delete(dailyReport: DailyReport): Promise<DailyReport>;
}
