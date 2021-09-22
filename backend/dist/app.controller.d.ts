import { HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { UserEntity } from './models/user.entity';
import { AuthService } from './components/auth/auth.service';
import { LoggedUser } from './models/loggedUser';
export declare class AppController {
    private readonly appService;
    private readonly authService;
    constructor(appService: AppService, authService: AuthService);
    Pruebas(body: any): Promise<any>;
    GetVersionPlataform(): any;
    getHello(): any;
    login(req: any): Promise<{
        status: HttpStatus;
        message: string;
        data: UserEntity;
        token: string;
    }>;
    loggedUsers(headers: any, loggedUser: LoggedUser): Promise<any>;
    GetLoggedUsers(headers: any, loggedUser: LoggedUser): Promise<any>;
    EmitConnect(): Promise<any>;
}
