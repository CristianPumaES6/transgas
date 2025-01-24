import { DailyReport } from './daily-report.entity';
import { Voyage } from './voyage.entity';
export declare class Port {
    id: number;
    userId: number;
    voyageId: number;
    voyage: Voyage;
    dailyReports: DailyReport[];
    portNumber: number;
    departurePort: string;
    arrivalPort: string;
    startDate: string;
    startIFO: number;
    startMGO: number;
    dateETA: string;
    historyDateETA: string;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    SyncStatus: string;
}
export declare class GetLastPortAndTotalConsump {
    portId: number;
    userId: number;
    departurePort: string;
    arrivalPort: string;
    startDate: string;
    startIFO: number;
    startMGO: number;
    lastDate: string;
    bunkeringIfo: number;
    bunkeringMgo: number;
    mplaIfo: number;
    auxIfo: number;
    boilerIfo: number;
    otherIfo: number;
    mplaMgo: number;
    auxMgo: number;
    boilerMgo: number;
    ppMgo: number;
    giMgo: number;
    otherMgo: number;
    distance: number;
    constructor(portId?: number, userId?: number, departurePort?: string, arrivalPort?: string, startDate?: string, startIFO?: number, startMGO?: number, lastDate?: string, bunkeringIfo?: number, bunkeringMgo?: number, mplaIfo?: number, auxIfo?: number, boilerIfo?: number, otherIfo?: number, mplaMgo?: number, auxMgo?: number, boilerMgo?: number, ppMgo?: number, giMgo?: number, otherMgo?: number, distance?: number);
}
