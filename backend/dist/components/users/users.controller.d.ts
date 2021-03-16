import { UsersService } from './users.service';
import { UserEntity } from '../../models/user.entity';
export declare class UsersController {
    private readonly _usersService;
    constructor(_usersService: UsersService);
    Get(headers: any, id: any): Promise<any>;
    Gets(headers: any, user: UserEntity): Promise<any>;
    Create(headers: any, user: UserEntity): Promise<any>;
    UpdateUser(headers: any, id: any, user: UserEntity): Promise<any>;
    delete(headers: any, id: any): Promise<any>;
    UploadImagePerfil(headers: any, id: any, file: any): Promise<any>;
}
