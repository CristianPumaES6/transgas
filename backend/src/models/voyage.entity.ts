import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Port } from './port.entity';

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


}
export class VoyageFilterByYears {
    userId: number;
    years: number[];
}


// estructura de excel de importacion de
export class ImportVoyage {
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
    speedStraction:number;
    observation: string;
    distance?: any;
    TIEMPO_DE_NAVEGACION?: any;
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
}