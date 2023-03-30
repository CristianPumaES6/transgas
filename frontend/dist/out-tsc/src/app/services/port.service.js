import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EnvConfig } from '../config/env.config';
// Service
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';
let PortService = class PortService {
    // Constructor
    constructor(
    // HttpClient
    httpClient, 
    // GuardService.
    authGuardService, 
    // Instanciamos al servicio usuario.
    userService) {
        this.httpClient = httpClient;
        this.authGuardService = authGuardService;
        this.userService = userService;
        this.url = EnvConfig.API;
    }
    // Obtine solo un objeto desde el ID.
    Get(portId) {
        // Armo el request
        let url = this.url + '/ports/' + portId;
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
    // Obtiene todos los objetos segun el filtro enviado.
    Gets(port) {
        // Armo el request
        let url = this.url + '/ports?userId=' + (port.userId || '') + '&voyageId=' + (port.voyageId || '') + '&portNumber=' + (port.portNumber || '') + '&departurePort=' + (port.departurePort || '') + '&arrivalPort=' + (port.arrivalPort || '');
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
    // Obtiene todos los objetos segun el filtro enviado.
    GetsDetail(port, page) {
        // Armo el request
        let url = this.url + '/ports/detail?userId=' + (port.userId || '') + '&voyageId=' + (port.voyageId || '') + '&portNumber=' + (port.portNumber || '') + '&departurePort=' + (port.departurePort || '') + '&arrivalPort=' + (port.arrivalPort || '');
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
    Create(port) {
        // Armo el request
        let url = this.url + '/ports/create';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        // Eliminamos el campo sync
        delete port.syncStatus;
        delete port.totalReport;
        // Parseo el obj para poder enviarlo en el request
        let body = JSON.stringify(port);
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.post(url, body, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => this.authGuardService.HandleError(err)));
    }
    Save(port) {
        // Armo el request
        let url = this.url + '/ports/' + port.id + '/update';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        // Eliminamos el campo sync
        delete port.syncStatus;
        delete port.totalReport;
        delete port.totalReport;
        delete port.dailyReports;
        // Armo el obj para enviarlo.
        let body = JSON.stringify(port);
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.put(url, body, options).pipe(map((response) => {
            if (response.status && response.status === 200) {
                return response.data;
            }
            else {
                throw response.description || response.error || '';
            }
        }), catchError((err) => this.authGuardService.HandleError(err)));
    }
    // Eliminamos el obj desde el id recibido desde el obj.
    Delete(port) {
        // Armo el request
        let url = this.url + '/ports/' + port.id + '/delete';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
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
    // Retorna el totar por actividad
    GetTotalByActivityFilterByUserIdAndDateAndType(userId) {
        // Armo el request
        let url = this.url + '/ports/getLastPortAndTotalConsump/' + userId;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        let options = { headers: headers, responseType: 'json' };
        // Mando consulta al API
        return this.httpClient.get(url, options).pipe(map((response) => {
            // Verifico si la respuesta fue correcta.
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
PortService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [HttpClient,
        AuthGuardService,
        UserService])
], PortService);
export { PortService };
//# sourceMappingURL=port.service.js.map