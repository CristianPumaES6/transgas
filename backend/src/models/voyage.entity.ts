import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Port } from './port.entity';
import { DailyReport } from './daily-report.entity';

@Entity()
export class Voyage {
    // Id unique.
    @PrimaryGeneratedColumn()
    id: number;
    @OneToMany(type => Port, port => port.voyage)
    ports: Port[];

    // userId : servira para hacer auditoria.
    @Column()
    userId: number;
    @Column()
    voyageNumber: number;
    @Column()
    year: number;



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

    SyncStatus: string;
}

export class VoyageFilterByYears {
    userId: number;
    years: number[];
}


// estructura de excel de importacion de
export class ImportVoyage {
    voyageId:number;
    portId:number;
    dailyReportId:number;
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
    typeActivityPerformed: string;
    speedStraction:string;
    observation: string;
    distance?: any;
    steamingTime2?: any;
    VELOCIDAD: number;
    beaufour: string;
    RPM?: any;
    mplaIfo: number;
    auxIfo: number;
    boilerIfo: number;
    otherIfo:number;
    TOTAL: number[];
    bunkeringIfo: number;
    ROB: number[];
    mplaMgo: number;
    auxMgo: number;
    boilerMgo: number;
    ppMgo: number;
    giMgo: number;
    otherMgo:number;
    bunkeringMgo?: any;

    

    north_degree:number;
    north_minutes:number;
    north_north_south: string;
    east_degree :number;
    east_minutes:number;
    east_east_west: string;
    updatePort: number; // Esto nos dice si el puerto se va actualizar o no


    delete_report: boolean;
}

export class DataModuleCombustible {
    userId : number;
    listVoyages:Voyage[];
    listPorts:Port[];
    listDailyReports:DailyReport[];
    

    constructor(
        userId? : number,
        listVoyages?: Voyage[],
        listPorts?: Port[],
        listDailyReports?: DailyReport[]
      ) {
        this.userId = userId || null;
        this.listVoyages = listVoyages || []; 
        this.listPorts = listPorts || [];
        this.listDailyReports = listDailyReports || []; 
      }
}