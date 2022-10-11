import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Port } from './port.entity';

@Entity()
export class DailyReport {

    // Id Detalle
    @PrimaryGeneratedColumn()
    id: number;

    // UserId que registra el dato
    @Column()
    userId: number;

    // Viaje ID
    @Column()
    portId: number;
    // El daily report tambien puede retornar un puerto.
    @ManyToOne(type => Port, port => port.id)
    port: Port;


    @Column({ default: '', nullable: true })
    north_degree: number;
    @Column({ default: '', nullable: true })
    north_minutes: number;
    @Column({ default: '', nullable: true })
    north_north_south: string;

    @Column({ default: '', nullable: true })
    east_degree: number;
    @Column({ default: '', nullable: true })
    east_minutes: number;
    @Column({ default: '', nullable: true })
    east_east_west: string;



    // actividad Registrada
    @Column({ default: "Otros" })
    activityPerformed: string;

    @Column({ default: '', nullable: true })
    typeActivityPerformed: string;

    @Column({ default: '', nullable: false })
    speedStraction: string;

    // Fecha de registro
    @Column()
    date: Date;

    // Hora
    @Column()
    hour: string;

    // Recarga de IFO
    @Column({ default: 0 })
    bunkeringIfo: number;

    // Recarga de MGO
    @Column({ default: 0 })
    bunkeringMgo: number;

    // robIfo
    // @Column()
    // robIfo: string;
    @Column({ default: 0 })
    mplaIfo: number;

    @Column({ default: 0 })
    auxIfo: number;

    @Column({ default: 0 })
    boilerIfo: number;

    @Column({ default: 0 })
    otherIfo: number;
    // -- Fin Ifo --

    // robMgo
    // @Column()
    // robMgo: string;
    @Column({ default: 0 })
    mplaMgo: number;

    @Column({ default: 0 })
    auxMgo: number;

    @Column({ default: 0 })
    boilerMgo: number;

    @Column({ default: 0 })
    ppMgo: number;

    @Column({ default: 0 })
    giMgo: number;

    @Column({ default: 0 })
    otherMgo: number;
    // Fin MGO

    // Tempo navegando
    @Column({ default: 0 })
    steamingTime: number;
    // Distancia
    @Column({ default: 0 })
    distance: number;
    // beaufour
    @Column()
    beaufour: string;
    // Observaciones
    @Column()
    observation: string;



    // Auditoria
    @Column()
    userIdCreated: number;
    @Column()
    dateCreated: string;

    @Column({ nullable: true })
    userIdUpdated: number;
    @Column({ nullable: true })
    dateUpdated: string;

    @Column({ nullable: false })
    status: boolean;

}


export class GetROBByUser {

    total_ifo: number;
    total_mgo: number;
    total_bunkering_ifo: number;
    total_bunkering_mgo: number;

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


export class GetReportVoyagePortDaily {


    constructor(
        public userId?: number,
        public year?: number,
        public voyageId?: number,
        public voyageNumber?: number,
        public portId?: number,
        public portNumber?: number,
        public departurePort?: string,
        public arrivalPort?: string,

        public dailyReportId?: number,
        // Fecha de registro
        public date?: Date,
        // Hora
        public hour?: string,
        // Tempo transcurrido
        public steamingTime?: number,

        // Actividades realizada
        public activityPerformed?: string,
        //  SpeedStraction ECO_SPEED | FULL_SPEED
        public speedStraction?: string,
        // Observaciones
        public observation?: string,

        public distance?: number,
        // beaufour
        public beaufour?: string,

        // Consumo mplaIfo
        public mplaIfo?: number,
        // Consumo auxIfo
        public auxIfo?: number,
        // consumo boilerIfo
        public boilerIfo?: number,
        // Otros consumos Ifo
        public otherIfo?: number,
        // Recarga de IFO
        public bunkeringIfo?: number,

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
        // Recarga de MGO
        public bunkeringMgo?: number,


        // CAMPOS AGREGADOS logitud
        public north_degree?: number,
        public north_minutes?: number,
        public north_north_south?: string,

        public east_degree?: number,
        public east_minutes?: number,
        public east_east_west?: string,


    ) {
        this.userId = userId || 0;
        this.year = year || 0;
        this.voyageId = voyageId || 0;
        this.voyageNumber = voyageNumber || 0;
        this.portId = portId || 0;
        this.portNumber = portNumber || 0;
        this.departurePort = departurePort || '';
        this.arrivalPort = arrivalPort || '';

        this.dailyReportId = dailyReportId || 0;
        this.date = date || null;
        this.hour = hour || '';
        this.steamingTime = steamingTime || 0;

        this.activityPerformed = activityPerformed || '';
        this.speedStraction = speedStraction || '';
        this.observation = observation || '';

        this.distance = distance || 0;
        this.beaufour = beaufour || '';

        // Consumo IFO
        this.mplaIfo = mplaIfo || 0;
        this.auxIfo = auxIfo || 0;
        this.boilerIfo = boilerIfo || 0;
        this.otherIfo = otherIfo || 0;
        this.bunkeringIfo = bunkeringIfo || 0;

        // Consumo MGO
        this.mplaMgo = mplaMgo || 0;
        this.auxMgo = auxMgo || 0;
        this.boilerMgo = boilerMgo || 0;
        this.ppMgo = ppMgo || 0;
        this.giMgo = giMgo || 0;
        this.otherMgo = otherMgo || 0;
        this.bunkeringMgo = bunkeringMgo || 0;



        this.north_degree = north_degree || 0;
        this.north_minutes = north_minutes || 0;
        this.north_north_south = north_north_south || '';

        this.east_degree = east_degree || 0;
        this.east_minutes = east_minutes || 0;
        this.east_east_west = east_east_west || '';
    }

}

// Informacion de inicio y fin de combustible de una fecha
export class InfoFuelStartEndForDate {

    constructor(
        public infoFuelStart?: GetROBByUser,
        public infoFuelEnd?: GetROBByUser
    ) {
        this.infoFuelStart = infoFuelStart || new GetROBByUser();
        this.infoFuelEnd = infoFuelEnd || new GetROBByUser();
    }
}

export class InfoReport_IFO_AND_MGO {
    constructor(
        public ifo?: GetReportVoyagePortDaily[],
        public mgo?: GetReportVoyagePortDaily[]

    ) {
        this.ifo = [];
        this.mgo = [];
    }
}


