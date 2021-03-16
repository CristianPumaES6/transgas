import { HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { UserEntity } from './models/user.entity';
import { AuthService } from './components/auth/auth.service';
export declare class AppController {
    private readonly appService;
    private readonly authService;
    constructor(appService: AppService, authService: AuthService);
    Pruebas(body: any): Promise<any>;
    getHello(): string;
    login(req: any): Promise<{
        status: HttpStatus;
        message: string;
        data: UserEntity;
        token: string;
    }>;
}
