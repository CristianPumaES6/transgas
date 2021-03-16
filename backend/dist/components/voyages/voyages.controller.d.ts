import { VoyagesService } from './voyages.service';
import { ImportVoyage, Voyage, VoyageFilterByYears } from '../../models/voyage.entity';
import { PortsService } from './ports/ports.service';
import { DailyReportsService } from './daily-reports/daily-reports.service';
export declare class VoyagesController {
    private readonly _voyagesService;
    private readonly _portsService;
    private readonly _dailyReportsService;
    constructor(_voyagesService: VoyagesService, _portsService: PortsService, _dailyReportsService: DailyReportsService);
    GetsByYear(headers: any, voyageFilterByYears: VoyageFilterByYears): Promise<any>;
    GetsDetail(headers: any, voyage: Voyage, page: number): Promise<any>;
    Get(id: any): Promise<any>;
    Gets(headers: any, voyage: Voyage, page: number): Promise<any>;
    CreateVoyage(headers: any, voyage: Voyage): Promise<any>;
    Update(headers: any, id: any, voyage: Voyage): Promise<any>;
    DeletePort(headers: any, id: any): Promise<any>;
    ImportJSONVoyages(headers: any, ImportVoyages: ImportVoyage[]): Promise<any>;
}
export declare class Mapping {
    key?: number;
    value?: number;
    constructor(key?: number, value?: number);
}
export declare function searchKey(mappings: Mapping[], key: number): Mapping;
