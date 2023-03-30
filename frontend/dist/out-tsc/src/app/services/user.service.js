import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EnvConfig } from '../config/env.config';
import { AuthGuardService } from './auth-guard.service';
let UserService = class UserService {
    constructor(httpClient, authGuardService) {
        this.httpClient = httpClient;
        this.authGuardService = authGuardService;
        console.log('constructor()');
        this.url = EnvConfig.API;
        // Obtenemos la identidad logeada.
        this.GetIdentity();
    }
    //--------------- Servicios Utiles, deberia ir en el shared Creo ----------------------------------------//
    // Obtiene al usuario logeado.
    GetIdentity() {
        console.log('GetIdentity()');
        // Obtenemos la entidad del localStorage LoggedUser
        let identity = JSON.parse(localStorage.getItem('LoggedUser'));
        if (identity) {
            this.userIdentity = identity;
        }
        else {
            this.userIdentity = null;
        }
        return this.userIdentity;
    }
    // obtiene el token del usuario actual
    GetToken() {
        console.log('GetToken()');
        let token = localStorage.getItem('Session');
        if (token != "undefined") {
            this.token = token;
        }
        else {
            this.token = null;
        }
        return this.token;
    }
    // --------------------------------------------------------
    //---------------------------------------------------------------------------//
    //----------------------------- Services ------------------------------------//
    //---[ Get<Class>s, Get<Class>, Create<Class>, Save<Class>, Delete<Class>]---//
    //---------------------------------------------------------------------------//
    GetUser(userId) {
        console.log('GetUser(userId: Number)');
        // Armo el request
        let url = this.url + '/users/' + userId;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.GetToken(),
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
    GetUsers(user) {
        // Armo el request
        let url = this.url + '/users?id=' + (user.id || '') + '&name=' + (user.name || '') + '&role=' + (user.role || '');
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.GetToken(),
        });
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.get(url, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                // Convertimos en JSON todos los años.
                response.data.forEach(user => {
                    user.years = JSON.parse(user.years);
                });
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => {
            return this.authGuardService.HandleError(err);
        }));
    }
    CreateUser(user) {
        // Armo el request
        let url = this.url + '/users/create';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.GetToken(),
        });
        // Eliminamos el campo sync
        delete user.syncStatus;
        let body = JSON.stringify(user);
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.post(url, body, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                // Convertimos a JSON LOS AÑOS
                response.data.years = JSON.parse(response.data.years);
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => this.authGuardService.HandleError(err)));
    }
    SaveUser(user) {
        // Armo el request
        let url = this.url + '/users/' + user.id + '/update';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.GetToken(),
        });
        // Eliminamos el campo sync
        delete user.syncStatus;
        let body = JSON.stringify(user);
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.put(url, body, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                // Convertimos en JSON LOS AÑOS  
                response.data.years = JSON.parse(response.data.years);
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => this.authGuardService.HandleError(err)));
    }
    DeleteUser(user) {
        // Armo el request
        let url = this.url + '/users/' + user.id + '/delete';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.GetToken(),
        });
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.delete(url, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => this.authGuardService.HandleError(err)));
    }
    UploadPerfil(id, file) {
        // Armo el request
        let url = this.url + '/users/' + id + '/image';
        let headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.GetToken(),
        });
        // Creamos el obj formulario.
        const formData = new FormData();
        // Agregamos la imagen
        formData.append('image', file.data);
        const httpRequest = new HttpRequest('POST', url, formData, {
            headers: headers,
            reportProgress: true
        });
        // Mando consulta al API
        return this.httpClient.request(httpRequest);
    }
};
UserService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [HttpClient,
        AuthGuardService])
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map