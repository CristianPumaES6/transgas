import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { EnvConfig } from '../config/env.config';
let WebSocketService = class WebSocketService {
    constructor() {
        // url del ws
        this.url = EnvConfig.SOCKET;
        // Asignamos la url del ws.
        this.socket = io(this.url);
    }
    // Si queremos agregar un evento de escuagra agregamos esto.
    listen(eventName) {
        // Asignamos un observable para que este a la escucha de algun emit.
        return new Observable((suscriber) => {
            // Encendemos el Socket con un evento expecifico.
            this.socket.on(eventName, (data) => {
                // La informacion que nos devuelva el emit.
                // se lo enviaremos al Observable.
                suscriber.next(data);
            });
        });
    }
    // Si queremos emitir un evento.
    // nombre del evento y informacion que deseamos enviar.
    emit(eventName, data) {
        // Usamos socket para emitir el evento al server.
        this.socket.emit(eventName, data);
    }
};
WebSocketService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [])
], WebSocketService);
export { WebSocketService };
//# sourceMappingURL=web-socket.service.js.map