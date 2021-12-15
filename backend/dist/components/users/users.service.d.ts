import { Repository } from 'typeorm';
import { UserEntity } from '../../models/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<UserEntity>);
    Get(id: number): Promise<UserEntity>;
    Gets(user: UserEntity): Promise<UserEntity[]>;
    CreateUserNickUnique(user: UserEntity): Promise<UserEntity>;
    UpdateUserNickUnique(user: UserEntity): Promise<UserEntity>;
    Delete(userId: number, deleteUserId: number): Promise<UserEntity>;
    GetUserByNick(nick: string): Promise<UserEntity>;
    UpdateImageUser(id: number, newFilename: string): Promise<string>;
}
