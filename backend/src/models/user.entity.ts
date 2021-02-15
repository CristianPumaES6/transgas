import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { UserDetailEntity } from './user-detail.entity';

@Entity('User')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => UserDetailEntity, userDetail => userDetail.id)
    userDetail: UserDetailEntity;
    
    @Column({ nullable: false })
    nick: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    filename: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    language: string;

    @Column({ nullable: false })
    role: string;

    @Column({ nullable: false })
    status: boolean;

    constructor(
        id?: number,
        nick?: string,
        name?: string,
        filename?: string,
        password?: string,
        language?: string,
        role?: string,
        status?: boolean,
    ) {
        this.id = id || null;
        this.nick = nick || '';
        this.name = name || '';
        this.filename = filename || '';
        this.password = password || '';
        this.language = language || '';
        this.role = role || '';
        this.status = status || false;
    }


}
