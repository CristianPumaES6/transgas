import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { DailyReport } from './daily-report.entity';
import { Voyage } from './voyage.entity';

@Entity()
export class DailyReportSummary {
  // Id unique.
  @PrimaryGeneratedColumn()
  id: number;

  // userId : servira para hacer auditoria.
  @Column()
  userId: number;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  date_ETA: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  latitud_degree: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  latitud_minutes: number;
  @Column()
  latitud_north_south: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  longitude_degree: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  longitude_minutes: number;
  @Column()
  longitude_east_west: string;

  @Column()
  typeOfEvent: string;

  @Column()
  voyageId: number;
  @Column()
  voyage: string;

  @Column()
  portId: number;
  @Column()
  port_Departure: string;
  @Column()
  port_Arrive: string;

  @Column()
  loadingCondition: string;
  @Column()
  voyComment: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  timeElapsed: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  timeElapsedSailing: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  distanceSailed: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  nauticalMile: number;

  @Column()
  navigationObservations: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  bunkeringIfo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  bunkeringMgo: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  mplaIfo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  auxIfo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  boilerIfo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  otherIfo: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  mplaMgo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  auxMgo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  boilerMgo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  ppMgo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  giMgo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  otherMgo: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  rob_Mgo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  rob_Ifo: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  load_Power: number;
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 8,
    default: '',
    nullable: true,
  })
  engine_Distance: number;

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

  SyncStatus: string;
}
