import { VoyagesService } from './voyages.service';
import { ImportVoyage, Voyage, VoyageFilterByYears } from '../../models/voyage.entity';
import { PortsService } from './ports/ports.service';
import { DailyReport } from '../../models/daily-report.entity';
import { DailyReportsService } from './daily-reports/daily-reports.service';
import { FormatExcelLastVoyageService } from 'src/services/format-excel-last-voyage/format-excel-last-voyage.service';
import { UsersService } from '../users/users.service';
import { SendMailConfig } from '../../models/sendMailConfig';
export declare class VoyagesController {
    private readonly _voyagesService;
    private readonly _portsService;
    private readonly _dailyReportsService;
    private readonly _formatExcelLastVoyageService;
    private readonly _usersService;
    constructor(_voyagesService: VoyagesService, _portsService: PortsService, _dailyReportsService: DailyReportsService, _formatExcelLastVoyageService: FormatExcelLastVoyageService, _usersService: UsersService);
    GetsByYear(headers: any, voyageFilterByYears: VoyageFilterByYears): Promise<any>;
    GetsDetail(headers: any, voyage: Voyage, page: number): Promise<any>;
    Get(id: any): Promise<any>;
    Gets(headers: any, voyage: Voyage, page: number): Promise<any>;
    CreateVoyage(headers: any, voyage: Voyage): Promise<any>;
    Update(headers: any, id: any, voyage: Voyage): Promise<any>;
    DeletePort(headers: any, id: any): Promise<any>;
    ImportJSONVoyages(headers: any, ImportVoyages: ImportVoyage[]): Promise<any>;
    ImportVoyagesDeFormatDNV(headers: any, ImportVoyages: ImportVoyage[]): Promise<any>;
    ImportListDailyReportAgregarOeliminar(headers: any, ImportDailyReport: DailyReport[]): Promise<any>;
    SendEmailLastVoyage(sendMailConfig: SendMailConfig): Promise<any>;
}
export declare class Mapping {
    key?: number;
    value?: number;
    constructor(key?: number, value?: number);
}
export declare function searchKey(mappings: Mapping[], key: number): Mapping;
