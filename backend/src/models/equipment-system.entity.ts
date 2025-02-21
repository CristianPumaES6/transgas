import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('equipmentSystem')
export class EquipmentSystemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;
  @Column({ nullable: false })
  equipment: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: 0,
    nullable: false,
  })
  trialDay: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: 0,
    nullable: false,
  })
  lubUsedDuringMaintenance: number; // Cantidad de uso de mantenimiento

  @Column({ nullable: true })
  ETM_OilAnalysis_Oid: string;

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
    trialDay?: number,
    lubUsedDuringMaintenance?: number,
    ETM_OilAnalysis_Oid?: string,
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
    this.trialDay = trialDay || 0;
    this.lubUsedDuringMaintenance = lubUsedDuringMaintenance || 0;
    this.ETM_OilAnalysis_Oid = ETM_OilAnalysis_Oid || '';
    this.frequencyId = frequencyId || 0;
    this.entityGroupId = entityGroupId || 0;

    // Auditoria
    this.userIdCreated = userIdCreated || 0;
    this.dateCreated = dateCreated || '';
    this.userIdUpdated = userIdUpdated || 0;
    this.dateUpdated = dateUpdated || '';
    this.status = status || false;
  }

  SyncStatus = '';
}
