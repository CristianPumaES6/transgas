import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { DatabaseService } from './database.service'
// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';

// Importamos los servicio del webSocket
import { WebSocketService } from './../services/web-socket.service';
import { CantidadRestante, LoggedUser } from '../models/loggedUser';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { SocketEmitModel } from '../models/socketEmit';


declare const window: any;

@Injectable({ providedIn: 'root' })
export class OnlineOfflineService {

  private isOnline: boolean = false;

  // Este emit servira para saver si se cambio el estado de la conexion.
  public emitterIsOnline = new EventEmitter<boolean>();

  // Agregamos al servidor un evento de escucha
  constructor(
    private _AuthService: AuthService,
    private databaseService: DatabaseService,
    private notificationsService: NotificationsService,
    private webSocketService: WebSocketService,
  ) {
    console.log('constructor() Online Offlinea Service');

    // Agregamos la configuracion al constructor.
    this.ConfigWebSocketListening();
  }

  // Actualiza el estado de la coneccion
  private async UpdateOnlineStatus() {

    console.log('updateOnlineStatus()');

    // Emitimos a nuestra aplicacion angular el estado de la conexion.
    this.emitterIsOnline.emit(this.isOnline)

  }

  // Configuracion de escucha de websocket.
  private ConfigWebSocketListening() {

    // La aplicacion estara a la escucha de alguna connection.
    // Si escucha una nueva conexion enviara un update de su estado.
    this.webSocketService.listen('isOnlineConection').subscribe(
      (data) => {
        console.log('isOnlineConection');
        console.log(data);
        // Solo si la conexion estaba en false, se emitira un update de la reconexion
        if (!this.isOnline) {
          this.isOnline = true;

          // Solo cmabiamos el estado.
          this.UpdateOnlineStatus();

          // Emitimos una notificacion.
          this.notificationsService.warn('Online', '');
        }
      }
    );

    // Si escucha algun emitConecction desde el server
    this.webSocketService.listen('EmitConnect').subscribe(
      (dataSocketEmitModel: SocketEmitModel) => {

        // Revisamos que se desea
        
        
        //aqui pide una solicitud de quienes estan ocnectados.
        if (dataSocketEmitModel && dataSocketEmitModel.action == 'WHO_ARE_CONNECTED') {

          // Enviamos nuestra conexion.
          let newConection: LoggedUser = new LoggedUser();
          let useRLogger: User = this._AuthService.GetLoggedUser();

          newConection.userName = useRLogger.name;
          newConection.isActive = true;

          // emitimos un REGISTER_CONECTION_USER
          this.webSocketService.emit('EmitConnect', {
            action: 'REGISTER_CONECTION_USER',
            data: newConection
          });


        } else {

          console.log('No entro revisar que paso');
          console.log(dataSocketEmitModel);

        }

      }
    );

    // Si el webSocket se desconecta
    this.webSocketService.listen('disconnect').subscribe(
      (data) => {

        // Si la conexion estuvo en true, se actualiza a false.
        if (this.isOnline) {
          this.isOnline = false;
          // Luego de que cambie la conexion debemos avisar este cabio lo hacemos gracias al emit.
          this.UpdateOnlineStatus();

          console.log(data)
          this.notificationsService.warn('Offline');

        }

      }
    );

  }

  // Retorna el estado de la conexion con el servidor.
  public GetStatusOnline(): boolean {
    return this.isOnline;
  }

}
