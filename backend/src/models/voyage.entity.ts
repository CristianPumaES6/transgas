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
export class ImportVoyage{
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