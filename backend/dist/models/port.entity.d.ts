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
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
}
