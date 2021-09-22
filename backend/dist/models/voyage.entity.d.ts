import { Port } from './port.entity';
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
}
export declare class VoyageFilterByYears {
    userId: number;
    years: number[];
}
export declare class ImportVoyage {
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
    speedStraction: number;
    observation: string;
    distance?: any;
    TIEMPO_DE_NAVEGACION?: any;
    VELOCIDAD: number;
    beaufour: string;
    RPM?: any;
    mplaIfo: number;
    auxIfo: number;
    boilerIfo: number;
    TOTAL: number[];
    bunkeringIfo: number;
    ROB: number[];
    mplaMgo: number;
    auxMgo: number;
    boilerMgo: number;
    ppMgo: number;
    giMgo: number;
    bunkeringMgo?: any;
}
