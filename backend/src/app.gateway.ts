// Importamos la libreria Logger, sirve para imprimir log en consola.
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetDate } from './assets/moment.assets';

import { URL_Server } from './config/server.config';
import { LoggedUser } from './models/loggedUser';
import { SocketEmitModel } from './models/socketEmit';

// Agregamos una decorator a la class para saber que sera una clase de WebSocket.
@WebSocketGateway(URL_Server.puertoSocket, { transport: ['websocket'] })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // Instanciamos el webSocket
  @WebSocketServer()
  wss;

  // Le assignamos un nombre para diferenciarlo.
  private logger = new Logger('AppGateway');

  // Detectamos una conexion
  // si detectamos una conexion lo reistramos
  public handleConnection(client) {
    // Lo mostramos en consola que un usuario se a conectado.
    this.logger.log('New client connected' + client.id);
    if (client && client.id) {
      let IsUserLogeatedExit: LoggedUser = new LoggedUser();
      IsUserLogeatedExit.clientId = client.id;

      this.IsUserLogeatedExit(IsUserLogeatedExit);
    }
    // Emitimos al cliente un mensaje.
    client.emit('isOnlineConection');
  }

  // Detectamos si un usuario se a desconectado.
  public handleDisconnect(client) {
    // Mostramos en consola que un usuario se a desconectado.
    this.logger.log('Client disconnected' + client.id);

    // Si existe el id lo buscamos.
    if (client && client.id) {
      // Busmos el id socket
      let userDisconnect = this.loggedUsers.find(logeate => {
        return logeate.clientId === client.id && logeate.isActive == true;
      });

      // Si existe actualizamos la ultima hora conectado.
      if (userDisconnect) {
        userDisconnect.lastConnection = GetDate();
        userDisconnect.isActive = false;
        this.UpdateUserLogeated(userDisconnect);
      }
    }
  }

  @SubscribeMessage('EmitConnect')
  handleEvent(@MessageBody() socketEmitModel: SocketEmitModel, @ConnectedSocket() client: Socket): LoggedUser[] {
    this.logger.log('EmitConnect');

    if (socketEmitModel && socketEmitModel.action == 'REGISTER_CONECTION_USER') {
      let IsUserLogeatedExit: LoggedUser = socketEmitModel.data;
      IsUserLogeatedExit.clientId = client.id;

      this.IsUserLogeatedExit(IsUserLogeatedExit);
    } else if (socketEmitModel && socketEmitModel.action == 'SYNC_DATA_BY_USER') {
      let userLogeate: LoggedUser = socketEmitModel.data;
      // LA action sera la misma SYNC_DATA_BY_USER
      this.wss.to(userLogeate.clientId).emit('EmitConnect', socketEmitModel); // Que este desactivado.
    } else {
      this.logger.log('No entro revisar.');
      this.logger.log('Socket updateConectionUser');
      this.logger.log(JSON.stringify(socketEmitModel));
    }

    // enviamos a todos los usuarios logeados.
    return [];
  }

  public loggedUsers: LoggedUser[] = [];

  // Verifica si el usuario logeado existe,
  // Si exite lo actualiza
  // Si no exite lo registra
  public IsUserLogeatedExit(loggedUser: LoggedUser): boolean {
    // Busmos el id socket
    let isUserExit = this.loggedUsers.find(logeate => {
      return logeate.clientId === loggedUser.clientId;
    });

    // Si existe actualizamos la ultima hora conectado.
    if (isUserExit) {
      isUserExit.userName = loggedUser.userName || isUserExit.userName;
      isUserExit.lastConnection = GetDate();
      isUserExit.isActive = true;

      this.UpdateUserLogeated(isUserExit);
    } else {
      // Si no existe
      this.AddUserLogeated(loggedUser);
    }

    return true;
  }

  // Agregamos a los usuarios logeados.
  private AddUserLogeated(loggedUser: LoggedUser): boolean {
    loggedUser.firstConnection = GetDate();
    loggedUser.lastConnection = GetDate();
    loggedUser.isActive = true;
    this.loggedUsers.push(loggedUser);

    return true;
  }

  // Actualizamos los usuarios logeados.
  private UpdateUserLogeated(loggedUser: LoggedUser): boolean {
    this.loggedUsers.forEach(logged => {
      // Verificamos que el token sea el mismo para actualizar su longitud y latitud.
      if (logged.clientId === loggedUser.clientId) {
        logged.userName = loggedUser.userName;
        // Actualizamos la ultima hora de conexion.
        logged.lastConnection = loggedUser.lastConnection;
        logged.isActive = loggedUser.isActive;

        // si la latitud y la longitud es la misma no actualizo.
        if (loggedUser.lat == 0 && loggedUser.lng == 0) {
        } else {
          // actualizamos la latiud y la longitud.
          logged.lat = loggedUser.lat;
          logged.lat = loggedUser.lng;
        }
      }
    });

    // Tenemos que actualizare
    return true;
  }

  // Obtenemos los usuarios que estan logeados.
  public GetLoggedUsers(): LoggedUser[] {
    return this.loggedUsers;
  }
}
