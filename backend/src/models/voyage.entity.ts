import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Port } from './port.entity';

@Entity()
export class Voyage {

    // Id unique.
    @PrimaryGeneratedColumn()
    id: number;
    @OneToMany(type => Port, port => port.voyage)
    ports: Port[];

    // userId : servira para hacer auditoria.
    @Column()
    userId: number;
    @Column()
    voyageNumber: number;
    @Column()
    year: number;



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
export class VoyageFilterByYear {
    userId: number;
    year: number[];
}