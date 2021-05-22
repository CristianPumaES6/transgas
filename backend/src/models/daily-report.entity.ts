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
    @ManyToOne(type => Port, port => port.id )
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

export class GetROBByUser{

    total_ifo: number;
    total_mgo: number;
    total_bunkering_ifo: number;
    total_bunkering_mgo: number;
    
}