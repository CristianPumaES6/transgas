import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('bunkerOil')
export class BunkerOil {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;
    
    @Column({ nullable: true })
    entityOilId: number;
    @Column({ type: 'decimal', precision: 10, scale: 8})
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
