import { LoggedUser } from './models/loggedUser';
export declare class AppService {
    constructor();
    loggedUsers: LoggedUser[];
    getHello(): string;
    IsUserLogeatedExit(loggedUser: LoggedUser): boolean;
    private AddUserLogeated;
    private UpdateUserLogeated;
    GetLoggedUsers(): LoggedUser[];
    EmitConnect(): boolean;
}
