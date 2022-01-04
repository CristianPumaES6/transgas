import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { DatabaseService } from './database.service'
// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';

// Importamos los servicio del webSocket
import { WebSocketService } from './../services/web-socket.service';
import { CantidadRestante } from '../models/loggedUser';


declare const window: any;

@Injectable({ providedIn: 'root' })
export class OnlineOfflineService {

  private isOnline: boolean = false;

  // Este emit servira para saver si se cambio el estado de la conexion.
  emitterIsOnline = new EventEmitter<boolean>();

  // Este emit sirve para avisar si se debe volver a cargar la data hacer reload. refresh etc.
  emitterReloadData = new EventEmitter();

  // Agregamos al servidor un evento de escucha
  constructor(
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
    this.webSocketService.listen('connection').subscribe(
      (data) => {
        console.log('connection incio');


        // Solo si la conexion estaba en false, se emitira un update de la reconexion
        if (!this.isOnline) {
          this.isOnline = true;

          // Luego de la sincronizacion, cambiamos el estado.
    /* 
          this.databaseService.Sync().then(
            result => {

              // Luego de sincronizar la bd hacemos un update al estado de la conexion
              this.UpdateOnlineStatus();


              // Emitir reloadData, esto sirve para saber si debemos de volver a cargar la data.
              this.emitterReloadData.emit();

              // Emitimos una notificacion.
              this.notificationsService.warn('Online', '');

          });
    */

            // Solo cmabiamos el estado.
              this.UpdateOnlineStatus();
              // Emitir reloadData, esto sirve para saber si debemos de volver a cargar la data.
             
              this.emitterReloadData.emit();

              // Emitimos una notificacion.
              this.notificationsService.warn('Online', '');
        }
      }
    );

    this.webSocketService.listen('connection2').subscribe(
      (data) => {
       // alert('connection2')

        console.log('registrar el usuario de ocneccion.')

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
