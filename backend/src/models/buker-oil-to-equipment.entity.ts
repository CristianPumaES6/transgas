import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('bunkerOilToEquipment')
export class BunkerOilToEquipmentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;
    @Column({ nullable: true })
    entityEquipmentId: number;
    @Column({ nullable: true })
    entityOilId: number;
    @Column()
    bunker: number;
    @Column({ nullable: true })
    comment: string;
    @Column({ nullable: false })
    datetime: string;

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
        entityEquipmentId?: number,
        entityOilId?: number,

        bunker?: number,
        comment?: string,
        datetime?: string,

        userIdCreated?: number,
        dateCreated?: string,
        userIdUpdated?: number,
        dateUpdated?: string,

        status?: boolean
    ) {
        this.id = id || null;
        this.userId = userId || null;
        this.entityEquipmentId = entityEquipmentId || 0;
        this.entityOilId = entityOilId || 0;
        this.bunker = bunker || 0;
        this.comment = comment || '';


        this.datetime = datetime || '';

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

    SyncStatus = "";
}
