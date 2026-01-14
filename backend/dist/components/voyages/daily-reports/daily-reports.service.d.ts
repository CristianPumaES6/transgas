import { DailyReport, GetInfoVoyageROBBunkering, GetReportVoyagePortDaily, GetROBByUser, InfoReport_IFO_AND_MGO } from '../../../models/daily-report.entity';
import { Repository } from 'typeorm';
import { Mapping } from '../../../assets/mappingKeys';
export declare class DailyReportsService {
    private _dailyReportRepository;
    constructor(_dailyReportRepository: Repository<DailyReport>);
    Create(dailyReport: DailyReport): Promise<DailyReport>;
    Get(id: Number): Promise<DailyReport>;
    Gets(dailyReport: DailyReport): Promise<DailyReport[]>;
    Update(dailyReport: DailyReport): Promise<DailyReport>;
    Delete(dailyReport: DailyReport, usuarioDelete: number): Promise<DailyReport>;
    GetROBByUser(userId: number): Promise<GetROBByUser>;
    GetStartEndROByFilterDate(startDate: Date, endDate: Date, userId: number): Promise<GetROBByUser[]>;
    GetBunkeringByUserIFO(userId: number): Promise<GetROBByUser>;
    GetBunkeringByUserMGO(userId: number): Promise<GetROBByUser>;
    GetReportVoyagePortDaily(userId: number, startDate: Date, endDate: Date, filterByVoyage: number): Promise<GetReportVoyagePortDaily[]>;
    GetReportByUser(userId: number): Promise<GetReportVoyagePortDaily[]>;
    GetInfoVoyageROBAndBunkeringByBuqueAndDate(startDate: Date, endDate: Date, userId: number): Promise<GetInfoVoyageROBBunkering[]>;
    GetTotalByActivityFilterByUserIdAndDateAndType(userId: number, startDate: string, endDate: string, filterBy: string): Promise<GetReportVoyagePortDaily[]>;
    GetTotalConsumptionByActivityFilterByUserIdAndDateAndType(userId: number, startDate: string, endDate: string, typeSummary: string): Promise<InfoReport_IFO_AND_MGO>;
    GetReportDNVByUser(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]>;
    GetReportDNVByUserNOON(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]>;
    GetReportBuroBerita(userId: number, startDate: Date, endDate: Date): Promise<GetReportVoyagePortDaily[]>;
    SaveList(MappingPorts: Mapping[], importDailyReport: DailyReport[]): Promise<SaveListDailyReport>;
}
export interface SaveListDailyReport {
    mappingReport: Mapping[];
    registeredReportsList: DailyReport[];
}
