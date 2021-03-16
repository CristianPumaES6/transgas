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
    USERID: number;
    year: number;
    NV: number;
    NP: number;
    Departure: string;
    Arrival: string;
    VIAJE: string;
    FECHA: string;
    HORA: string;
    TIEMPO: number;
    ACTIVIDAD_REALIZADA: string;
    REFERENCIA: string;
    DISTANCIA_POR_CARTA?: number;
    TIEMPO_DE_NAVEGACION?: number;
    BEAUFORT: string;
    MPAL_IFO: number;
    AUX_IFO: number;
    CALDERA_IFO: number;
    MPAL2_MGO: number;
    AUX_MGO: number;
    CALDERA_MGO: number;
    PP_MGO: number;
    GI_MGO: number;
}
