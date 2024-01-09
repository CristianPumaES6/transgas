import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('groupOil')
export class GroupOilEntity {

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


}
