import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { DatabaseService } from './database.service'
// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';

declare const window: any;

@Injectable({ providedIn: 'root' })
export class OnlineOfflineService {

  public isOnline: boolean = false;

  emitterIsOnline = new EventEmitter<boolean>();
  emitterReloadData = new EventEmitter();
  // Creamos un observable de tipo boolean.
  // private internalConnectionChanged = new Subject<boolean>();

  // Agregamos al servidor un evento de escucha
  constructor(
    private databaseService: DatabaseService,
    private notificationsService: NotificationsService
  ) {
    console.log('constructor()');

    this.isOnline = !!window.navigator.onLine;

    // Caso sea online o Offline cambiara el estado de la coneccion interna.
    window.addEventListener('online', () => {

      this.updateOnlineStatus();
      this.databaseService.Sync().then(
        result => {
          console.log('ReloadData Emit()');

          // Emitir reloadData.
          this.emitterReloadData.emit();

          this.notificationsService.warn('Online','');

        });

    });
    window.addEventListener('offline', () => {
      this.updateOnlineStatus();
      this.notificationsService.warn('Offline');
    });
  }

  // Actualiza el estado de la coneccion
  private async updateOnlineStatus(): Promise<boolean> {
    console.log('updateOnlineStatus()');

    this.isOnline = !!window.navigator.onLine;

    this.emitterIsOnline.emit(this.isOnline)

    return this.isOnline;
  }

}
