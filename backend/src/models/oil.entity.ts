import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { GroupOilEntity } from './group-oils.entity';
import { EquipmentSystemEntity } from './equipment-system.entity';
import { ConsumptionEquipmentEntity } from './consumptionEquipment.entity';
import { BunkerOil } from './buker-oil.entity';
import { EquipmentOilCompatibilityEntity } from './equipment-oil-compatibility.entity';

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

  SyncStatus = '';
}

export class DataModuleOils {
  userId: number;
  listGroups: GroupOilEntity[];
  listEquipmentSystem: EquipmentSystemEntity[];
  listOils: OilEntity[];
  listBunkerOil: BunkerOil[];
  listEquipmentOilCompatibility: EquipmentOilCompatibilityEntity[];
  listConsumptionEquipment: ConsumptionEquipmentEntity[];

  constructor(
    _userId?: number,
    _listGroup?: GroupOilEntity[],
    _listEquipmentSystem?: EquipmentSystemEntity[],
    _listOil?: OilEntity[],
    _listBunkerOil?: BunkerOil[],
    _listEquipmentOilCompatibility?: EquipmentOilCompatibilityEntity[],
    _listConsumptionEquipment?: ConsumptionEquipmentEntity[],
  ) {
    this.userId = _userId || null;
    this.listGroups = _listGroup || [];
    this.listEquipmentSystem = _listEquipmentSystem || [];
    this.listOils = _listOil || [];
    this.listBunkerOil = _listBunkerOil || [];
    this.listEquipmentOilCompatibility = _listEquipmentOilCompatibility || [];
    this.listConsumptionEquipment = _listConsumptionEquipment || [];
  }
}

export class ImportExcelLubricanteDiario {
  USER_ID: number;
  DATE: string;
  IDENT_ME1: number;
  IDENT_ME2: number;
  IDENT_AUX1: number;
  IDENT_AUX2: number;
  IDENT_AUX3: number;
  HOUR_ME: number;
  HOUR_AUX1: number;
  HOUR_AUX2: number;
  HOUR_AUX3: number;
  LUB_ME: number;
  LUB_AUX1: number;
  LUB_AUX2: number;
  LUB_AUX3: number;
  LUB_ME_CYLINDER: number;
}
