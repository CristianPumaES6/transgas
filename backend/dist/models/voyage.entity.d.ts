import { Port } from './port.entity';
import { DailyReport } from './daily-report.entity';
import { DailyReportSummary } from './dailyReportSummary.entity';
export declare class Voyage {
    id: number;
    ports: Port[];
    userId: number;
    voyageNumber: number;
    year: number;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    SyncStatus: string;
}
export declare class VoyageFilterByYears {
    userId: number;
    years: number[];
}
export declare class ImportVoyage {
    voyageId: number;
    portId: number;
    dailyReportId: number;
    year: number;
    voyageNumber: number;
    portNumber: number;
    departurePort: string;
    arrivalPort: string;
    date: string;
    dateETA: string;
    hour: string;
    steamingTime: number;
    activityPerformed: string;
    nextActivityPerformed: string;
    speedStraction: string;
    observation: string;
    distance?: any;
    steamingTime2?: any;
    SPEED?: any;
    beaufour: string;
    mplaIfo: number;
    auxIfo: number;
    boilerIfo: number;
    otherIfo: number;
    TOTAL_IFO: number;
    DAILY_CONSUMPTION_IFO: number;
    bunkeringIfo: number;
    ROB_IFO: number;
    mplaMgo: number;
    auxMgo: number;
    boilerMgo: number;
    ppMgo: number;
    giMgo: number;
    otherMgo: number;
    TOTAL_MGO: number;
    DAILY_CONSUMPTION_MGO: number;
    bunkeringMgo: number;
    ROB_MGO: number;
    north_degree: number;
    north_minutes: number;
    north_north_south: string;
    east_degree: number;
    east_minutes: number;
    east_east_west: string;
    typeActivityPerformed: string;
    userId: number;
    updatePort: boolean;
    delete_report: boolean;
    RPM?: any;
    TOTAL: number[];
}
export declare class DataModuleCombustible {
    userId: number;
    listVoyages: Voyage[];
    listPorts: Port[];
    listDailyReports: DailyReport[];
    listDailyReportSummaries: DailyReportSummary[];
    constructor(userId?: number, listVoyages?: Voyage[], listPorts?: Port[], listDailyReports?: DailyReport[], listDailyReportSummaries?: DailyReportSummary[]);
}
