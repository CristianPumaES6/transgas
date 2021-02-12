import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

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
        password?: string,
        language?: string,
        role?: string,
        status?: boolean,
    ) {
        this.id = id || null;
        this.nick = nick || '';
        this.name = name || '';
        this.password = password || '';
        this.language = language || '';
        this.role = role || '';
        this.status = status || false;
    }


}
