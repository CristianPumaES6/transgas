import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('oilAnalysis')
export class OilAnalysisEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  equipmentOilCompatibilityId: number;

  @Column({ nullable: false })
  fileId: number;

  @Column({ type: 'timestamp', nullable: false })
  analysisDate: string;

  @Column({ nullable: true })
  comments: string;

  // Auditoria
  @Column({ nullable: false })
  userIdCreated: number;
  @Column({ nullable: false })
  dateCreated: string;
  @Column({ nullable: true })
  userIdUpdated: number;
  @Column({ nullable: true })
  dateUpdated: string;

  @Column({ nullable: false })
  status: boolean;

  constructor(
    id?: number,
    equipmentOilCompatibilityId?: number,
    fileId?: number,
    analysisDate?: string,
    comments?: string,

    userIdCreated?: number,
    dateCreated?: string,
    userIdUpdated?: number,
    dateUpdated?: string,

    status?: boolean,
  ) {
    this.id = id || null;
    this.equipmentOilCompatibilityId = equipmentOilCompatibilityId || 0;
    this.fileId = fileId || 0;
    this.analysisDate = analysisDate || '';
    this.comments = comments || '';

    // Auditoria
    this.userIdCreated = userIdCreated || 0;
    this.dateCreated = dateCreated || '';
    this.userIdUpdated = userIdUpdated || 0;
    this.dateUpdated = dateUpdated || '';
    this.status = status || false;
  }

  SyncStatus = '';
}
