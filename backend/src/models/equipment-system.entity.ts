import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('equipmentSystem')
export class EquipmentSystemEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;
    @Column({ nullable: false })
    equipment: string;
    @Column({ nullable: false })
    rate: number;
    
    @Column({ nullable: true })
    frequencyId: number; // Grupo principal o segundario
    @Column({ nullable: true })
    entityGroupId: number; // Permite agrupar por un subgrupo (AUX)

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
        equipment?: string,
        rate?: number,
        frequencyId?: number,
        entityGroupId?: number,

        userIdCreated?: number,
        dateCreated?: string,
        userIdUpdated?: number,
        dateUpdated?: string,

        status?: boolean,
        
    ) {
        this.id = id || null;
        this.userId = userId || null;
        this.equipment = equipment || '';

        this.rate = rate || 0;
        this.frequencyId = frequencyId || 0;
        this.entityGroupId = entityGroupId || 0;

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

    SyncStatus = "";
}
