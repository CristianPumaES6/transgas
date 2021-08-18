// El DailyReport es una entidad en la BD.

// Mejora => las entidades que existen en BD, deberian llevar la palabra Entity, para saber que es una entidad, esto se deberia de aplicar a todas las entidades de BD.
export class DailyReport {

    constructor(
        // Id Detalle
        public id?: number,
        // UserId que registra el dato
        public userId?: number,
        // Puerto ID
        public portId?: number,
        // Actividades realizada
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
        // consumo boilerIfo
        public boilerIfo?: number,
        // Otros consumos Ifo
        public otherIfo?: number,

        // Consumo mplaMgo
        public mplaMgo?: number,
        // Consumo auxMgo
        public auxMgo?: number,
        // Consumo boilerMgo
        public boilerMgo?: number,
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
        this.boilerIfo = boilerIfo || 0;
        this.otherIfo = otherIfo || 0;
        // Consumo MGO
        this.mplaMgo = mplaMgo || 0;
        this.auxMgo = auxMgo || 0;
        this.boilerMgo = boilerMgo || 0;
        this.ppMgo = ppMgo || 0;
        this.giMgo = giMgo || 0;
        this.otherMgo = otherMgo || 0;

        this.steamingTime = steamingTime || 0;
        this.distance = distance || 0;
        this.beaufour = beaufour || '';
        this.observation = observation || '';

        // Audiotoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
        this.syncStatus = '';
    }

    // estos campos se estan agregando para tener el total de consumo
    // ya no segmentado por maquina.
    public robIfo = 0;
    public robMgo = 0;
}


// En el daily report tambien podemos tener el modelo de velocida.
// el cual se obtiene mediante un calculo.
// distancia entre tiempo.
export class Speed {

    constructor(
        // userId : servira para hacer auditoria.
        public distance?: number,
        // Lugar de partida,
        public steamingTime?: number,
        // Lugar de partida,

        // MEJORA
        // Solo se agregara la distancia y tiempo si hay consumo IFO
        public distanceIFO?: number,
        public timeOperationIFO?: number,

        // Solo se agregara la distancia y tiempo si hay consumo MGO
        public distanceMGO?: number,
        public timeOperationMGO?: number,
    ) {
        this.distance = distance || 0;
        this.steamingTime = steamingTime || 0;


        this.distanceIFO = distanceIFO || 0;
        this.timeOperationIFO = timeOperationIFO || 0;


        this.distanceMGO = distanceMGO || 0;
        this.timeOperationMGO = timeOperationMGO || 0;
    }

    // funcion para agregar mas distancia y tiempo a la variable.
    public add(addDistance, addSteamingTime) {
        this.distance = this.distance + addDistance;
        this.steamingTime = this.steamingTime + addSteamingTime;
    }


    // funcion para agregar mas distancia y tiempo a la variable solo si hay consumo IFO
    public addInfoIFO(addDistanceIFO, addTimeOperationIFO) {
        this.distanceIFO = this.distanceIFO + addDistanceIFO;
        this.timeOperationIFO = this.timeOperationIFO + addTimeOperationIFO;
    }


    // funcion para agregar mas distancia y tiempo a la variable solo si hay consumo MGO
    public addInfoMGO(addDistanceMGO, addTimeOperationMGO) {
        this.distanceMGO = this.distanceMGO + addDistanceMGO;
        this.timeOperationMGO = this.timeOperationMGO + addTimeOperationMGO;
    }
}

// Estructura del servicio.
export class GetROBByUser{
    constructor(
        public total_ifo?: number,
        public total_mgo?: number,
        public total_bunkering_ifo?: number,
        public total_bunkering_mgo?: number
    ) {
        this.total_ifo = total_ifo || 0;
        this.total_mgo = total_mgo || 0;
        this.total_bunkering_ifo = total_bunkering_ifo || 0;
        this.total_bunkering_mgo = total_bunkering_mgo || 0;
    }
    
}



// Info de consumo de viaje y bunkering.
export class GetInfoVoyageROBBunkering {

    voyageId: number;
    voyageNumber: number;
    minDate: Date;
    maxDate: Date;
    totalIFO: number;
    totalMGO: number;
    listInfoBunkering: GetInfoBunkering[]


    constructor(

        voyageId?: number,
        voyageNumber?: number,
        minDate?: Date,
        maxDate?: Date,
        totalIFO?: number,
        totalMGO?: number,
        listInfoBunkering?: GetInfoBunkering[]

    ) {

        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;
        this.minDate = minDate || null;
        this.maxDate = maxDate || null;
        this.totalIFO = totalIFO || 0;
        this.totalMGO = totalMGO || 0;
        this.listInfoBunkering = listInfoBunkering || [];

    }

}


// datos de bunkering
export class GetInfoBunkering {

    portId: number;
    portNumber: number;
    portDeparture: string;
    daily_reportId: number;
    dailyReportDate: Date;
    bunkeringIfo: number;
    bunkeringMgo: number;
    observation: string;

    constructor(
        portId?: number,
        portNumber?: number,
        portDeparture?: string,
        daily_reportId?: number,
        dailyReportDate?: Date,
        bunkeringIfo?: number,
        bunkeringMgo?: number,
        observation?: string,
    ) {
        this.portId = portId || 0;
        this.portNumber = portNumber || 0;
        this.portDeparture = portDeparture || '';
        this.daily_reportId = daily_reportId || 0;
        this.dailyReportDate = dailyReportDate || null;
        this.bunkeringIfo = bunkeringIfo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;
        this.observation = observation || '';
    }
}