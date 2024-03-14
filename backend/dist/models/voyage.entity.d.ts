import { Port } from './port.entity';
import { DailyReport } from './daily-report.entity';
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
    userId: number;
    year: number;
    voyageNumber: number;
    portNumber: number;
    departurePort: string;
    arrivalPort: string;
    VIAJE: string;
    date: string;
    hour: string;
    steamingTime: number;
    activityPerformed: string;
    typeActivityPerformed: string;
    speedStraction: string;
    observation: string;
    distance?: any;
    steamingTime2?: any;
    VELOCIDAD: number;
    beaufour: string;
    RPM?: any;
    mplaIfo: number;
    auxIfo: number;
    boilerIfo: number;
    otherIfo: number;
    TOTAL: number[];
    bunkeringIfo: number;
    ROB: number[];
    mplaMgo: number;
    auxMgo: number;
    boilerMgo: number;
    ppMgo: number;
    giMgo: number;
    otherMgo: number;
    bunkeringMgo?: any;
    north_degree: number;
    north_minutes: number;
    north_north_south: string;
    east_degree: number;
    east_minutes: number;
    east_east_west: string;
    updatePort: number;
    delete_report: boolean;
}
export declare class DataModuleCombustible {
    userId: number;
    listVoyages: Voyage[];
    listPorts: Port[];
    listDailyReports: DailyReport[];
    constructor(userId?: number, listVoyages?: Voyage[], listPorts?: Port[], listDailyReports?: DailyReport[]);
}
