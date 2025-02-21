import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class SendMessageEntity {
  // Id unique.
  @PrimaryGeneratedColumn()
  id: number;

  // userId : servira para hacer auditoria.
  @Column()
  userId: number;

  // userId : servira para hacer auditoria.
  @Column()
  emails: string;

  // Tipo de envio de las 08:00 HRs o del medio dia
  @Column()
  typeSend: string;

  @Column('varchar', { length: 2000 })
  html: string;

  @Column({ default: true })
  sendAutomatic: boolean;

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
    emails?: string,
    typeSend?: string,
    html?: string,
    sendAutomatic?: boolean,
    userIdCreated?: number,
    dateCreated?: string,
    userIdUpdated?: number,
    dateUpdated?: string,
    status?: boolean,
  ) {
    this.id = id || null;
    this.userId = userId || null;
    this.emails = emails || '';
    this.typeSend = typeSend || '';
    this.html = html || '';
    this.sendAutomatic = sendAutomatic || false;
    this.userIdCreated = userIdCreated || null;
    this.dateCreated = dateCreated || null;
    this.userIdUpdated = userIdUpdated || null;
    this.dateUpdated = dateUpdated || null;
    this.status = status || false;
  }
}
