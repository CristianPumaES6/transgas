import { Mapping } from '../../../assets/mappingKeys';
import { Repository } from 'typeorm';
import { DailyReportSummary } from '../../../models/dailyReportSummary.entity';
export declare class DailyReportSummaryService {
    private _dailyReportSummary;
    constructor(_dailyReportSummary: Repository<DailyReportSummary>);
    Create(dailyReportSummary: DailyReportSummary): Promise<DailyReportSummary>;
    SaveList(MappingVoyages: Mapping[], MappingPorts: Mapping[], importDailyReportSummary: DailyReportSummary[]): Promise<Mapping[]>;
}
