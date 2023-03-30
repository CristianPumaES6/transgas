import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EnvConfig } from '../config/env.config';
import { LanguageService } from '../services/language.service';
import * as TimeZone from 'moment-timezone';
// Config
import { AuthGuardService } from './auth-guard.service';
import { UserService } from './user.service';
import { DatabaseService } from './database.service';
let AuthService = class AuthService {
    constructor(http, httpClient, languageService, authGuardService, userService, _databaseService) {
        this.http = http;
        this.httpClient = httpClient;
        this.languageService = languageService;
        this.authGuardService = authGuardService;
        this.userService = userService;
        this._databaseService = _databaseService;
        this.clientOffset = 0;
        console.log('Constructor');
        // Intento obtener datos almacenados en localStorage
        try {
            this.session = localStorage.getItem('Session');
            this.loggedUser = JSON.parse(localStorage.getItem('LoggedUser'));
        }
        catch (err) { }
    }
    Login(login) {
        // Armo el request
        let url = EnvConfig.API + '/auth/login';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        let body = JSON.stringify(login);
        let options = { headers: headers, responseType: 'json' };
        return this.httpClient.post(url, body, options)
            .pipe(map((response) => {
            // Verificamos que la respuesta.
            if (response.data && response.token) {
                // Guardamos la data y token del usuario.
                this.loggedUser = response.data;
                this.session = response.token;
                // Inicializo la zona horaria del cliente
                this.InitializeTimezone();
                // Seteo el idioma en uso
                this.languageService.SetCurrentLanguage(this.loggedUser.language);
                // Guardo la sesion y el usario en localStorage
                localStorage.setItem('Session', this.session);
                localStorage.setItem('LoggedUser', JSON.stringify(this.loggedUser));
                // Devuelvo true
                return response.data;
            }
            else {
                // Devuelvo false
                return false;
            }
        }));
    }
    GetTimeZone() {
        // Devuelvo la zona horaria del usuario
        return this.timeZone;
    }
    InitializeTimezone() {
        // Obtengo el nombre del timezone
        this.timeZone = TimeZone.tz.guess();
        // Obtengo objeto zona de moment, a partir del nombre del timezonetz.zone(this.timeZone)
        let zone = TimeZone.tz.zone(this.timeZone);
        // Obtengo diferencia en minutos de utc al timezone, para la fecha actual
        if (zone)
            this.clientOffset = -1 * zone.utcOffset(TimeZone().valueOf());
    }
    GetSession() {
        // Devuelvo la sesion guardada localmente
        return this.session;
    }
    GetLoggedUser() {
        // Devuelvo el usuario guardado localmente
        return this.loggedUser;
    }
    // Al deslogearnos tenemos que borrar los datos.
    async Logout() {
        this.session = null;
        this.loggedUser = null;
        localStorage.clear();
        return Promise.resolve(true).then(result => {
            return this._databaseService.DeleteDataBase();
        }).then(result => {
            console.log('ISUIENTE THJEN');
            // REVISAR=> Esta es una solucion rapida.
            // No me gusta que se tenga que recargar el sitio luego de cerar session.
            // Tampoco se si es sincrono, si se hace el reload luego eliminar la bd.
            // esto podria generar un error.
            // Revisar vien alfondo si el DeleteDataBase(); esta esperando caso contrario colocar then que es lo mas seguro para saber que es sincrono.
            location.reload();
            return true;
        });
    }
    // Verifica el token.
    // Solo obtiene la version si se tiene un token registrado.
    GetVerifyToken() {
        console.log('GetVerifyToken(userId: Number)');
        // Armo el request
        let url = EnvConfig.API;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.get(url, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => {
            return this.authGuardService.HandleError(err);
        }));
    }
    // COnsulta al servidor la version del proyecto.
    // Retorna la version del proyecto.
    GetVersionPlataform() {
        console.log('GetVerifyToken(userId: Number)');
        // Armo el request
        let url = EnvConfig.API + '/platform-version';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.get(url, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => {
            return this.authGuardService.HandleError(err);
        }));
    }
    // Este servicio registra el logeo de un usuario.
    EmitConnect() {
        // Armo el request
        let url = EnvConfig.API + '/emitConnect';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        let body = '';
        let options = { headers: headers, responseType: 'json' };
        return this.httpClient.post(url, body, options)
            .pipe(map((response) => {
            // Verificamos que la respuesta.
            if (response.status && response.status === 200) {
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }));
    }
    // Este servicio registra el logeo de un usuario.
    RegisterUserConnection(loggedUser) {
        // Armo el request
        let url = EnvConfig.API + '/loggedUsers';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            //'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        let body = JSON.stringify(loggedUser);
        let options = { headers: headers, responseType: 'json' };
        return this.httpClient.post(url, body, options)
            .pipe(map((response) => {
            // Verificamos que la respuesta.
            if (response.status && response.status === 200) {
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }));
    }
    // Obtiene todos los objetos segun el filtro enviado.
    GetUserConnection() {
        // Armo el request
        let url = EnvConfig.API + '/loggedUsers';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            //'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.get(url, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => {
            return this.authGuardService.HandleError(err);
        }));
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [HttpClient,
        HttpClient,
        LanguageService,
        AuthGuardService,
        UserService,
        DatabaseService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map