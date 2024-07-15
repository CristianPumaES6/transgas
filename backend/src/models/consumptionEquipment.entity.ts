import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('consumptionEquipment')
export class ConsumptionEquipmentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;
    @Column({ nullable: false })
    date: string;
    @Column({ type: 'decimal', precision: 10, scale: 8})
    amount: number;
    @Column({ type: 'decimal', precision: 10, scale: 8})
    hourConsumption: number;
    @Column({ nullable: true })
    observation: string;
    
    @Column({ nullable: false, default:0 })
    entityEquipmentOilCompatibilityId: number;

    // Tipo de consumo
    @Column({ nullable: false, default:0 })
    consumptionTypeId: number;
    @Column({ nullable: false, default:0 })
    entityOilAnalysisId: number;

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

    constructor(
        id?: number,

        userId?: number,
        date?: string,
        amount?: number,
        hourConsumption?: number,
        observation?: string,
        entityEquipmentOilCompatibilityId?: number,
        consumptionTypeId?: number,
        entityOilAnalysisId?: number,

        userIdCreated?: number,
        dateCreated?: string,
        userIdUpdated?: number,
        dateUpdated?: string,

        status?: boolean
    ) {
        this.id = id || null;
        this.userId = userId || null;
        this.date = date || '';

        this.amount = amount || 0;
        this.hourConsumption = hourConsumption || 0;
        this.observation = observation || '';
        this.entityEquipmentOilCompatibilityId = entityEquipmentOilCompatibilityId || 0;
        this.consumptionTypeId = consumptionTypeId || 0;
        this.entityOilAnalysisId = entityOilAnalysisId || 0;

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

    SyncStatus = "";
}
