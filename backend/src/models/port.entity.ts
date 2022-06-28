import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { DailyReport } from './daily-report.entity';
import { Voyage } from './voyage.entity';

@Entity()
export class Port {

    // Id unique.
    @PrimaryGeneratedColumn()
    id: number;

    // userId : servira para hacer auditoria.
    @Column()
    userId: number;

    // Numero de viaje.
    @Column()
    voyageId: number;
    @ManyToOne(type => Voyage, voyage => voyage.id)
    voyage: Voyage;
    @OneToMany(type => DailyReport, dailyReport => dailyReport.port, {
        eager: true,
        cascade: true
    })
    dailyReports: DailyReport[];

    // Numero de viaje.
    @Column()
    portNumber: number;

    // Lugar de partida.
    @Column()
    departurePort: string;

    // Lugar de llegada.
    @Column()
    arrivalPort: string;

    @Column({ nullable: true })
    startDate: Date;
    @Column({ default: 0, nullable: true })
    startIFO: number;
    @Column({ default: 0, nullable: true })
    startMGO: number;

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