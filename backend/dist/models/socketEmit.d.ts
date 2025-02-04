import { LoggedUser } from './loggedUser';
export declare class SocketEmitModel {
    action: string;
    data: LoggedUser;
    constructor(action?: string, data?: LoggedUser);
}
