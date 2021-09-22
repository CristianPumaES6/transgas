import { AppGateway } from './app.gateway';
import { LoggedUser } from './models/loggedUser';
export declare class AppService {
    private gateway;
    constructor(gateway: AppGateway);
    loggedUsers: LoggedUser[];
    getHello(): string;
    IsUserLogeatedExit(loggedUser: LoggedUser): boolean;
    private AddUserLogeated;
    private UpdateUserLogeated;
    GetLoggedUsers(): LoggedUser[];
    EmitConnect(): boolean;
}
