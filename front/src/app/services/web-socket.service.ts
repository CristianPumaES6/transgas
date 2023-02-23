import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { EnvConfig } from '../config/env.config';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  // url del ws
  readonly url: string = EnvConfig.SOCKET;

  // socket
  public socket: any;

  constructor() {
    // Asignamos la url del ws.
    this.socket = io(this.url);

  }


  // Si queremos agregar un evento de escuagra agregamos esto.
  public listen(eventName: string) {

    // Asignamos un observable para que este a la escucha de algun emit.
    return new Observable(
      (suscriber) => {

        // Encendemos el Socket con un evento expecifico.
        this.socket.on(eventName,
          (data) => {
            // La informacion que nos devuelva el emit.
            // se lo enviaremos al Observable.
            suscriber.next(data);
          }
        );

      }
    );

  }

  // Si queremos emitir un evento.
  // nombre del evento y informacion que deseamos enviar.
  public emit(eventName: string, data: any) {
    // Usamos socket para emitir el evento al server.
    this.socket.emit(eventName, data);
  }

}
