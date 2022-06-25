import { DailyReport, Speed } from './daily-report';

export class Port {
    constructor(
        // Id unique.
        public id?: number,
        // userId : servira para hacer auditoria.
        public userId?: number,
        // Numero de viaje.
        public voyageId?: number,
        // Numero de puerto.
        public portNumber?: number,
        // Lugar de partida,
        public departurePort?: string,
        // Lugar de llegada.
        public arrivalPort?: string,
        // Atributos de inicio de fecha IFO Y MGO
        public startDate?: Date,
        public startIFO?: number,
        public startMGO?: number,

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
        this.voyageId = voyageId || null;
        this.portNumber = portNumber || null;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';

        this.startDate = startDate || null;
        this.startIFO = startIFO || 0;
        this.startMGO = startMGO || 0;

        // Audiotoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
        this.syncStatus = '';
    }

    public totalReport: number;
    public robIfo: number;
    public robMgo: number;

    dailyReports: DailyReport[];


    public speed: Speed;
    public dayStart: string;
    public dayEnd: string;

    public totalBunkeringIFO: number;
    public totalBunkeringMGO: number;

}