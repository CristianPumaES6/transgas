import { UsersService } from '../users/users.service';
import { UserEntity } from '../../models/user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateLogin(nick: string, password: string): Promise<UserEntity>;
    generateTokenForGuards(user: any): Promise<string>;
}
