import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    nick: string;

    @Column({ nullable: false })
    name: string;
    
    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    language: string;

    @Column({ nullable: false })
    role: string;

}
