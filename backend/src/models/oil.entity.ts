import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { GroupOilEntity } from './group-oils.entity';
import { EquipmentSystemEntity } from './equipment-system.entity';
import { ConsumptionEquipmentEntity } from './consumptionEquipment.entity';
import { BunkerOil } from './buker-oil.entity';

@Entity('oil')
export class OilEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;
    @Column({ nullable: false })
    name: string;
 
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
        name?: string,

        userIdCreated?: number,
        dateCreated?: string,
        userIdUpdated?: number,
        dateUpdated?: string,
        status?: boolean,
    ) {
        this.id = id || null;
        this.userId = userId || null;
        this.name = name || '';

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

    SyncStatus = "";
}




export class SaveDateOils {
    userId: number;
    listGroups: GroupOilEntity[];
    listEquipmentSystem: EquipmentSystemEntity[];
    listConsumptionEquipment: ConsumptionEquipmentEntity[];
    listBunkerOil: BunkerOil[];
    listOils: OilEntity[];


    constructor(
        userId?: number,
        listGroups?: GroupOilEntity[],
        listEquipmentSystem?: EquipmentSystemEntity[],
        listConsumptionEquipment?: ConsumptionEquipmentEntity[],
        listBunkerOil?: BunkerOil[],
        listOil?: OilEntity[]
      ) {
        this.userId = userId || null;
        this.listGroups = listGroups || [];
        this.listEquipmentSystem = listEquipmentSystem || [];
        this.listConsumptionEquipment = listConsumptionEquipment || [];
        this.listBunkerOil = listBunkerOil || [];
        this.listOils = listOil || [];
      }
  }