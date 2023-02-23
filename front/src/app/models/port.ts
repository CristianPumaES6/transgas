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



export class GetLastPortAndTotalConsump {
    public portId: number;
    public userId: number;
    public departurePort: string;
    public arrivalPort: string;

    public startDate: string;
    public startIFO: number;
    public startMGO: number;
    public lastDate: string;

    public bunkeringIfo: number;
    public bunkeringMgo: number;

    public mplaIfo: number;
    public auxIfo: number;
    public boilerIfo: number;
    public otherIfo: number;

    public mplaMgo: number;
    public auxMgo: number;
    public boilerMgo: number;
    public ppMgo: number;
    public giMgo: number;
    public otherMgo: number;

    public distance: number;

    constructor(

        portId?: number,
        userId?: number,
        departurePort?: string,
        arrivalPort?: string,

        startDate?: string,
        startIFO?: number,
        startMGO?: number,
        lastDate?: string,

        bunkeringIfo?: number,
        bunkeringMgo?: number,

        mplaIfo?: number,
        auxIfo?: number,
        boilerIfo?: number,
        otherIfo?: number,

        mplaMgo?: number,
        auxMgo?: number,
        boilerMgo?: number,
        ppMgo?: number,
        giMgo?: number,
        otherMgo?: number,

        distance?: number,
    ) {

        this.portId = portId || 0;
        this.userId = userId || 0;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';

        this.startDate = startDate || '';
        this.startIFO = startIFO || 0;
        this.startMGO = startMGO || 0;
        this.lastDate = lastDate || '';

        this.bunkeringIfo = bunkeringIfo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;

        this.mplaIfo = mplaIfo || 0;
        this.auxIfo = auxIfo || 0;
        this.boilerIfo = boilerIfo || 0;
        this.otherIfo = otherIfo || 0;

        this.mplaMgo = mplaMgo || 0;
        this.auxMgo = auxMgo || 0;
        this.boilerMgo = boilerMgo || 0;
        this.ppMgo = ppMgo || 0;
        this.giMgo = giMgo || 0;
        this.otherMgo = otherMgo || 0;

        this.distance = distance || 0;
    }
}