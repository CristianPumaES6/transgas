import { DailyReportSummary } from 'src/models/dailyReportSummary.entity';
export declare class DailyReportSummaryController {
    private readonly _DailyReportSummary;
    constructor(_DailyReportSummary: DailyReportSummary);
    Gets(headers: any, dailyReportSummary: DailyReportSummary): Promise<any>;
}
