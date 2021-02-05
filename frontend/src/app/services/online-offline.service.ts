import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

declare const window: any;

@Injectable({ providedIn: 'root' })
export class OnlineOfflineService {

  public isOnline: boolean = false;

  emitterIsOnline = new EventEmitter<boolean>();
  // Creamos un observable de tipo boolean.
  // private internalConnectionChanged = new Subject<boolean>();

  // Agregamos al servidor un evento de escucha
  constructor() {
    console.log('constructor()');

    // Caso sea online o Offline cambiara el estado de la coneccion interna.
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  // Actualiza el estado de la coneccion
  public updateOnlineStatus(): boolean {
    console.log('updateOnlineStatus()');

    this.isOnline = !!window.navigator.onLine;

    this.emitterIsOnline.emit(this.isOnline)

    return this.isOnline;
  }

}
