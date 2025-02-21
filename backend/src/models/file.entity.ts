import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fileName: string;

  // ubicacion del archivo
  @Column({ nullable: false })
  filePath: string;

  // tipo de archivo
  @Column({ type: 'varchar', length: 50, nullable: false })
  fileType: string;

  // peso del archivo
  @Column({ type: 'int', nullable: false })
  fileSize: number;

  @Column({ nullable: true })
  description: string;

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
    fileName?: string,
    filePath?: string,
    fileType?: string,
    fileSize?: number,
    description?: string,

    userIdCreated?: number,
    dateCreated?: string,
    userIdUpdated?: number,
    dateUpdated?: string,

    status?: boolean,
  ) {
    this.id = id || null;
    this.fileName = fileName || '';
    this.filePath = filePath || '';
    this.fileType = fileType || '';
    this.fileSize = fileSize || 0;
    this.description = description || '';

    // Auditoria
    this.userIdCreated = userIdCreated || 0;
    this.dateCreated = dateCreated || '';
    this.userIdUpdated = userIdUpdated || 0;
    this.dateUpdated = dateUpdated || '';
    this.status = status || false;
  }

  SyncStatus = '';
}
