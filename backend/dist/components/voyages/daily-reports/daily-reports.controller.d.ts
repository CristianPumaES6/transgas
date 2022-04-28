import { DailyReport } from '../../../models/daily-report.entity';
import { DailyReportsService } from './daily-reports.service';
export declare class DailyReportsController {
    private readonly _dailyReportsService;
    constructor(_dailyReportsService: DailyReportsService);
    Get(id: any): Promise<any>;
    Gets(headers: any, dailyReport: DailyReport): Promise<any>;
    Create(headers: any, dailyReport: DailyReport): Promise<any>;
    Update(headers: any, id: any, dailyReport: DailyReport): Promise<any>;
    Delete(headers: any, id: any): Promise<any>;
    GetROBByBuque(headers: any, userId: number): Promise<any>;
    GetStartEndROByFilterDate(headers: any, userId: number, startDate: Date, endDate: Date): Promise<any>;
    GetBunkeringByBuque(headers: any, userId: number): Promise<any>;
    GetInfoVoyageROBAndBunkeringByBuqueAndDate(headers: any, userId: number, startDate: Date, endDate: Date): Promise<any>;
    GetReportVoyagePortDaily(headers: any, userId: number, startDate: Date, endDate: Date): Promise<any>;
    GetReportByUser(headers: any, userId: number): Promise<any>;
    GetTotalByActivityFilterByUserIdAndDateAndType(headers: any, userId: number, startDate: string, endDate: string, filter: string): Promise<any>;
    GetTotalConsumerByActivityFilterByUserIdAndDateAndType(headers: any, userId: number, startDate: string, endDate: string, typeSummary: string): Promise<any>;
}
