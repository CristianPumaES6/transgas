import { Speed } from './daily-report';
import { Port } from './port';

export class Voyage {
    constructor(
        // Id unique.
        public id?: number,
        // userId : servira para hacer auditoria.
        public userId?: number,
        // Lugar de partida,
        public voyageNumber?: number,
        // Lugar de llegada.
        public year?: number,

        // Auditoria
        public userIdCreated?: number,
        public dateCreated?: Date,
        public userIdUpdated?: number,
        public dateUpdated?: Date,
        public status?: boolean,
        public syncStatus?: string,// none added, updated, deleted
    ) {

        this.id = id || null;
        this.userId = userId || null;
        this.voyageNumber = voyageNumber || null;
        this.year = year || null;

        // Audiotoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
        this.syncStatus = '';
    }

    ports: Port[] = [];
    //Numero total de reportes
    totalReport: number = 0;

    totalMGO: number;
    totalIFO: number;
    totalSpeed: Speed;
    totalBunkeringIFO: number;
    totalBunkeringMGO: number;
    // Numero total de puertos
    totalPort: number = 0;
    dayStart: string;
    dayEnd: string;
}

// Modelo para la consulta de viajes por años.
// Es un modeo generico.
export class VoyageFilterByYears {

    constructor(
        // userId : servira para hacer auditoria.
        public userId?: number,
        // Lugar de partida,
        public years?: number[],
    ) {
        this.userId = userId || null;
        this.years = years || [];
    }

}