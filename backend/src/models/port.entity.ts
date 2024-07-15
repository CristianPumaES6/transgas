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
    startDate: string;
    @Column({ type: 'decimal', precision: 10, scale: 8, default: 0, nullable: true })
    startIFO: number;
    @Column({ type: 'decimal', precision: 10, scale: 8, default: 0, nullable: true })
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


    SyncStatus:string;

}


export class GetLastPortAndTotalConsump {
    portId: number;
    userId: number;
    departurePort: string;
    arrivalPort: string;

    startDate: string;
    startIFO: number;
    startMGO: number;
    lastDate: string;

    bunkeringIfo: number;
    bunkeringMgo: number;

    mplaIfo: number;
    auxIfo: number;
    boilerIfo: number;
    otherIfo: number;

    mplaMgo: number;
    auxMgo: number;
    boilerMgo: number;
    ppMgo: number;
    giMgo: number;
    otherMgo: number;

    distance: number;

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
        
        this.portId= portId|| 0;
        this.userId= userId|| 0;
        this.departurePort = departurePort  || '';
        this.arrivalPort= arrivalPort  || '';

        this.startDate= startDate  || '';
        this.startIFO= startIFO|| 0;
        this.startMGO= startMGO|| 0;
        this.lastDate= lastDate  || '';
    
        this.bunkeringIfo=bunkeringIfo || 0;
        this.bunkeringMgo=bunkeringMgo|| 0;
    
        this.mplaIfo=mplaIfo || 0;
        this.auxIfo= auxIfo|| 0;
        this.boilerIfo=boilerIfo || 0;
        this.otherIfo=otherIfo || 0;
    
        this.mplaMgo=mplaMgo || 0;
        this.auxMgo=auxMgo || 0;
        this.boilerMgo=boilerMgo || 0;
        this.ppMgo=ppMgo || 0;
        this.giMgo=giMgo || 0;
        this.otherMgo=otherMgo || 0;
    
        this.distance=distance || 0;
    }
}