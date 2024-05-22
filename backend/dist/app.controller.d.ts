import { HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { UserEntity } from './models/user.entity';
import { AuthService } from './components/auth/auth.service';
import { LoggedUser } from './models/loggedUser';
import { AppGateway } from './app.gateway';
export declare class AppController {
    private readonly appService;
    private readonly authService;
    private readonly _AppGateway;
    constructor(appService: AppService, authService: AuthService, _AppGateway: AppGateway);
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
    ConsultaGeneral(buqueId: any, startDate: any, endDate: any): Promise<import("./app.service").ListUserConsumptionLubricantPerMonth[]>;
    ConsultEquipmentConsumptionByMonthUser(buqueId: any, EquipmentId: any, YEAR_MONTH: any): Promise<any[] | import("./components/oils/consumption-equipment/consumption-equipment.service").consultEquipmentConsumptionByMonthUser[]>;
}
