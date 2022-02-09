import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LoggedUser } from './models/loggedUser';
import { SocketEmitModel } from './models/socketEmit';
export declare class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    wss: any;
    private logger;
    handleConnection(client: any): void;
    handleDisconnect(client: any): void;
    handleEvent(socketEmitModel: SocketEmitModel, client: Socket): LoggedUser[];
    loggedUsers: LoggedUser[];
    IsUserLogeatedExit(loggedUser: LoggedUser): boolean;
    private AddUserLogeated;
    private UpdateUserLogeated;
    GetLoggedUsers(): LoggedUser[];
}
