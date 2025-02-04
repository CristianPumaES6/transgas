import { Repository } from 'typeorm';
import { DailyReportSummary } from '../../../models/dailyReportSummary.entity';
export declare class DailyReportSummaryService {
    private _dailyReportSummary;
    constructor(_dailyReportSummary: Repository<DailyReportSummary>);
}
