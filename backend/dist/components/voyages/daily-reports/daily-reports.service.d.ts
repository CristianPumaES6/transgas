import { DailyReport, GetROBByUser } from 'src/models/daily-report.entity';
import { Repository } from 'typeorm';
export declare class DailyReportsService {
    private _dailyReportRepository;
    constructor(_dailyReportRepository: Repository<DailyReport>);
    Create(dailyReport: DailyReport): Promise<DailyReport>;
    Get(id: Number): Promise<DailyReport>;
    Gets(dailyReport: DailyReport): Promise<DailyReport[]>;
    GetROBByUser(userId: number): Promise<GetROBByUser>;
    GetBunkeringByUserIFO(userId: number): Promise<GetROBByUser>;
    GetBunkeringByUserMGO(userId: number): Promise<GetROBByUser>;
    Update(dailyReport: DailyReport): Promise<DailyReport>;
    Delete(dailyReport: DailyReport): Promise<DailyReport>;
}
