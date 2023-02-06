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
    
    @Column("varchar", { length: 2000 })
    html:string;

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

}
