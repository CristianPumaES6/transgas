import { DailyReport, GetInfoVoyageROBBunkering, GetReportVoyagePortDaily, GetROBByUser } from '../../../models/daily-report.entity';
import { Repository } from 'typeorm';
export declare class DailyReportsService {
    private _dailyReportRepository;
    constructor(_dailyReportRepository: Repository<DailyReport>);
    Create(dailyReport: DailyReport): Promise<DailyReport>;
    Get(id: Number): Promise<DailyReport>;
    Gets(dailyReport: DailyReport): Promise<DailyReport[]>;
    Update(dailyReport: DailyReport): Promise<DailyReport>;
    Delete(dailyReport: DailyReport): Promise<DailyReport>;
    GetROBByUser(userId: number): Promise<GetROBByUser>;
    GetStartEndROByFilterDate(startDate: Date, endDate: Date, userId: number): Promise<GetROBByUser[]>;
    GetBunkeringByUserIFO(userId: number): Promise<GetROBByUser>;
    GetBunkeringByUserMGO(userId: number): Promise<GetROBByUser>;
    GetReportVoyagePortDaily(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]>;
    GetInfoVoyageROBAndBunkeringByBuqueAndDate(startDate: Date, endDate: Date, userId: number): Promise<GetInfoVoyageROBBunkering[]>;
}
