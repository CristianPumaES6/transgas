import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { GroupOilEntity } from './group-oils.entity';
import { EquipmentSystemEntity } from './equipment-system.entity';
import { ConsumptionEquipmentEntity } from './consumptionEquipment.entity';
import { BunkerOil } from './buker-oil.entity';
import { EquipmentOilCompatibilityEntity } from './equipment-oil-compatibility.entity';

@Entity('oilPriceHistory')
export class OilPriceHistory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: true })
    entityOilId : number;
 
    @Column({ nullable: true })
    price  : number;

    @Column({ nullable: true })
    typeCurrency : string;

    @Column({ nullable: false })
    effectiveDate : string;

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
        price?: number,
        typeCurrency?: string,
        effectiveDate?: string,

        userIdCreated?: number,
        dateCreated?: string,
        userIdUpdated?: number,
        dateUpdated?: string,
        status?: boolean,
    ) {
        this.id = id || null;
        this.userId = userId || null;
        this.entityOilId = entityOilId || null;
        this.price = price || 0;
        this.typeCurrency = typeCurrency || '';
        this.effectiveDate = effectiveDate || '';

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

    SyncStatus = "";
}


