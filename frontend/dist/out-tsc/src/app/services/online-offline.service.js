import { __decorate, __metadata } from "tslib";
import { Injectable, EventEmitter } from '@angular/core';
import { DatabaseService } from './database.service';
// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';
// Importamos los servicio del webSocket
import { WebSocketService } from './../services/web-socket.service';
import { LoggedUser } from '../models/loggedUser';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
let OnlineOfflineService = class OnlineOfflineService {
    // Agregamos al servidor un evento de escucha
    constructor(_AuthService, databaseService, notificationsService, webSocketService, _LoadingService) {
        this._AuthService = _AuthService;
        this.databaseService = databaseService;
        this.notificationsService = notificationsService;
        this.webSocketService = webSocketService;
        this._LoadingService = _LoadingService;
        this.isOnline = false;
        // Este emit servira para saver si se cambio el estado de la conexion.
        this.emitterIsOnline = new EventEmitter();
        console.log('constructor() Online Offlinea Service');
        // Agregamos la configuracion al constructor.
        this.ConfigWebSocketListening();
    }
    // Actualiza el estado de la coneccion
    async UpdateOnlineStatus() {
        console.log('updateOnlineStatus()');
        // Emitimos a nuestra aplicacion angular el estado de la conexion.
        this.emitterIsOnline.emit(this.isOnline);
    }
    // Configuracion de escucha de websocket.
    ConfigWebSocketListening() {
        let isOnlyOneRegister = false;
        // La aplicacion estara a la escucha de alguna connection.
        // Si escucha una nueva conexion enviara un update de su estado.
        this.webSocketService.listen('isOnlineConection').subscribe((data) => {
            console.log('isOnlineConection');
            console.log(data);
            // Solo si la conexion estaba en false, se emitira un update de la reconexion
            if (!this.isOnline) {
                this.isOnline = true;
                // Solo cmabiamos el estado.
                this.UpdateOnlineStatus();
                // Verificamos si ya se registro, solo una vez se registra
                if (!isOnlyOneRegister) {
                    this.RegisterLoggerBySocket();
                    // Lo ponemos para que no se vuelva a registrar.
                    isOnlyOneRegister = true;
                }
                // Emitimos una notificacion.
                this.notificationsService.warn('Online', '');
            }
        });
        let isSyncing = false;
        // Si escucha algun emitConecction desde el server
        this.webSocketService.listen('EmitConnect').subscribe((dataSocketEmitModel) => {
            // Revisamos que se desea
            //aqui pide una solicitud de quienes estan ocnectados.
            if (dataSocketEmitModel && dataSocketEmitModel.action == 'WHO_ARE_CONNECTED') {
                this.RegisterLoggerBySocket();
            }
            else if (dataSocketEmitModel && dataSocketEmitModel.action == 'SYNC_DATA_BY_USER') {
                // Verificamos que no este cargando
                if (!isSyncing) {
                    // Haiblitamos e indicamos que estamos sincronizando
                    isSyncing = true;
                    Promise.resolve(true).then(result => {
                        // Sincronizamos la data desde un emit
                        return this.SyncDataForEmit();
                    }).then(isSyncSucces => {
                        if (!isSyncSucces)
                            throw 'ERROR_SYNC_DATA_FOR_EMIT';
                        isSyncing = false;
                    }).catch(err => {
                        isSyncing = false;
                        console.dir(err);
                        this.notificationsService.error('ERROR', '');
                        // Deshabilito el spinner de loading
                        this._LoadingService.Close();
                    });
                }
            }
            else {
                console.log('No entro revisar que paso');
                console.log(dataSocketEmitModel);
            }
        });
        // Si el webSocket se desconecta
        this.webSocketService.listen('disconnect').subscribe((data) => {
            // Si la conexion estuvo en true, se actualiza a false.
            if (this.isOnline) {
                this.isOnline = false;
                // Luego de que cambie la conexion debemos avisar este cabio lo hacemos gracias al emit.
                this.UpdateOnlineStatus();
                console.log(data);
                this.notificationsService.warn('Offline');
            }
        });
    }
    RegisterLoggerBySocket() {
        // Enviamos nuestra conexion.
        let newConection = new LoggedUser();
        let userLogger = this._AuthService.GetLoggedUser();
        if (!userLogger)
            throw 'No user logger, userLogger';
        newConection.userName = userLogger.name;
        newConection.isActive = true;
        // emitimos un REGISTER_CONECTION_USER
        this.webSocketService.emit('EmitConnect', {
            action: 'REGISTER_CONECTION_USER',
            data: newConection
        });
    }
    // Cuando que remos que un usuario sincronice su data local seleccionamos esto.
    SyncDataByUser(loggedUser) {
        // Enviamos nuestra conexion.
        let newConection = new LoggedUser();
        let userLogger = this._AuthService.GetLoggedUser();
        if (!userLogger)
            throw 'No user logger, userLogger';
        newConection.clientId = loggedUser.clientId;
        newConection.userName = userLogger.name;
        newConection.isActive = true;
        // emitimos un REGISTER_CONECTION_USER
        this.webSocketService.emit('EmitConnect', {
            action: 'SYNC_DATA_BY_USER',
            data: newConection
        });
    }
    // Retorna el estado de la conexion con el servidor.
    GetStatusOnline() {
        return this.isOnline;
    }
    // Sincronizar la data desde un emit.
    async SyncDataForEmit() {
        this._LoadingService.Open();
        let datosRestanteSync = {};
        return await Promise.resolve(true).then(result => {
            // Sincronizamos la data del servidor.
            return this.databaseService.Sync();
        }).then(result => {
            if (!result)
                throw 'ERROR SYNC SERVER';
            // Emitimos el reload
            return this.databaseService.EmitterReloadData();
        }).then(result => {
            if (!result) {
                throw 'ERROR EMITTER RELOAD DATA. (Contact support)';
            }
            // Verificamos que cantidad hay
            return this.databaseService.EmitterCantOffline();
        }).then((result) => {
            this._LoadingService.Close();
            return true;
        }).catch(err => {
            console.dir(err);
            this.notificationsService.error('ERROR', '');
            // Deshabilito el spinner de loading
            this._LoadingService.Close();
            return false;
        });
    }
    // Sincronizar la data para la funcion de timer
    async SyncDataForTimeOut() {
        return await Promise.resolve(true).then(result => {
            // Sincronizamos la data del servidor.
            return this.databaseService.Sync();
        }).then(result => {
            if (!result)
                throw 'ERROR SYNC SERVER';
            // Emitimos el reload
            return this.databaseService.EmitterReloadData();
        }).then(result => {
            if (!result) {
                throw 'ERROR EMITTER RELOAD DATA. (Contact support)';
            }
            // Verificamos que cantidad hay
            return this.databaseService.EmitterCantOffline();
        }).then((result) => {
            return true;
        }).catch(err => {
            console.dir(err);
            this.notificationsService.error('ERROR', '');
            return false;
        });
    }
};
OnlineOfflineService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [AuthService,
        DatabaseService,
        NotificationsService,
        WebSocketService,
        LoadingService])
], OnlineOfflineService);
export { OnlineOfflineService };
//# sourceMappingURL=online-offline.service.js.map