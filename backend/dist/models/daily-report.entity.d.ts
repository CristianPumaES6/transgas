import { Port } from './port.entity';
export declare class DailyReport {
    id: number;
    userId: number;
    portId: number;
    port: Port;
    activityPerformed: string;
    speedStraction: string;
    date: Date;
    hour: string;
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
    steamingTime: number;
    distance: number;
    beaufour: string;
    observation: string;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
}
export declare class GetROBByUser {
    total_ifo: number;
    total_mgo: number;
    total_bunkering_ifo: number;
    total_bunkering_mgo: number;
}
export declare class GetInfoVoyageROBBunkering {
    voyageId: number;
    voyageNumber: number;
    minDate: Date;
    maxDate: Date;
    totalIFO: number;
    totalMGO: number;
    listInfoBunkering: GetInfoBunkering[];
    constructor(voyageId?: number, voyageNumber?: number, minDate?: Date, maxDate?: Date, totalIFO?: number, totalMGO?: number, listInfoBunkering?: GetInfoBunkering[]);
}
export declare class GetInfoBunkering {
    portId: number;
    portNumber: number;
    portDeparture: string;
    daily_reportId: number;
    dailyReportDate: Date;
    bunkeringIfo: number;
    bunkeringMgo: number;
    observation: string;
    constructor(portId?: number, portNumber?: number, portDeparture?: string, daily_reportId?: number, dailyReportDate?: Date, bunkeringIfo?: number, bunkeringMgo?: number, observation?: string);
}
export declare class GetReportVoyagePortDaily {
    userId?: number;
    year?: number;
    voyageId?: number;
    voyageNumber?: number;
    portId?: number;
    portNumber?: number;
    departurePort?: string;
    arrivalPort?: string;
    dailyReportId?: number;
    date?: Date;
    hour?: string;
    steamingTime?: number;
    activityPerformed?: string;
    speedStraction?: string;
    observation?: string;
    distance?: number;
    beaufour?: string;
    mplaIfo?: number;
    auxIfo?: number;
    boilerIfo?: number;
    otherIfo?: number;
    bunkeringIfo?: number;
    mplaMgo?: number;
    auxMgo?: number;
    boilerMgo?: number;
    ppMgo?: number;
    giMgo?: number;
    otherMgo?: number;
    bunkeringMgo?: number;
    constructor(userId?: number, year?: number, voyageId?: number, voyageNumber?: number, portId?: number, portNumber?: number, departurePort?: string, arrivalPort?: string, dailyReportId?: number, date?: Date, hour?: string, steamingTime?: number, activityPerformed?: string, speedStraction?: string, observation?: string, distance?: number, beaufour?: string, mplaIfo?: number, auxIfo?: number, boilerIfo?: number, otherIfo?: number, bunkeringIfo?: number, mplaMgo?: number, auxMgo?: number, boilerMgo?: number, ppMgo?: number, giMgo?: number, otherMgo?: number, bunkeringMgo?: number);
}
