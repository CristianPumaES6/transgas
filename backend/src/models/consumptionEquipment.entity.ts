import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('consumptionEquipment')
export class ConsumptionEquipmentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;
    @Column({ nullable: false })
    date: string;
    @Column()
    amount: number;
    @Column()
    hourConsumption: number;
    @Column({ nullable: true })
    observation: string;
    @Column({ nullable: true })
    entityEquipmentId: number;
    @Column({ nullable: true })
    entityOilId: number;

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
        entityEquipmentId?: number,

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
        this.entityEquipmentId = entityEquipmentId || 0;

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

    SyncStatus = "";
}
