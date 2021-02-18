
export class DailyReport {

    constructor(
        // Id Detalle
        public id?: number,
        // UserId que registra el dato
        public userId?: number,
        // Viaje ID
        public portId?: number,
        // Actividades realizadas
        public activityPerformed?: string,
        // Fecha de registro
        public date?: Date,
        // Hora
        public hour?: string,
        // Recarga de IFO
        public bunkeringIfo?: number,
        // Recarga de MGO
        public bunkeringMgo?: number,
        // Consumo mplaIfo
        public mplaIfo?: number,
        // Consumo auxIfo
        public auxIfo?: number,
        // consumo calderaIfo
        public calderaIfo?: number,
        // Otros consumos Ifo
        public otherIfo?: number,
        // Consumo mplaMgo
        public mplaMgo?: number,
        // Consumo auxMgo
        public auxMgo?: number,
        // Consumo calderaMgo
        public calderaMgo?: number,
        // Consumo ppMgo
        public ppMgo?: number,
        // Consumo giMgo
        public giMgo?: number,
        // Consumo otherMgo
        public otherMgo?: number,
        // Tempo navegando
        public steamingTime?: number,
        // Distancia
        public distance?: number,
        // beaufour
        public beaufour?: string,
        // Observaciones
        public observation?: string,


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
        this.portId = portId || null;
        this.activityPerformed = activityPerformed || '';
        this.date = date || null;
        this.hour = hour || '';
        this.bunkeringIfo = bunkeringIfo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;
        // Consumo IFO
        this.mplaIfo = mplaIfo || 0;
        this.auxIfo = auxIfo || 0;
        this.calderaIfo = calderaIfo || 0;
        this.otherIfo = otherIfo || 0;
        // Consumo MGO
        this.mplaMgo = otherIfo || 0;
        this.auxMgo = otherIfo || 0;
        this.calderaMgo = otherIfo || 0;
        this.ppMgo = otherIfo || 0;
        this.giMgo = otherIfo || 0;
        this.otherMgo = otherIfo || 0;

        this.steamingTime = steamingTime || 0;
        this.distance = distance || 0;
        this.beaufour = beaufour || '';
        this.observation = observation || '';
        this.status = status || true;

        // Audiotoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
        this.syncStatus = '';
    }

    public robIfo = 0;
    public robMgo = 0;
}