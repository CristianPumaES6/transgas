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



    // actividad Registrada
    @Column({ default: "Otros" })
    activityPerformed: string;

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