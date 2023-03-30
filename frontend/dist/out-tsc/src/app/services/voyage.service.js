import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EnvConfig } from '../config/env.config';
// Service
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';
let VoyageService = class VoyageService {
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
    Get(voyageId) {
        // Armo el request
        let url = this.url + '/voyages/' + voyageId;
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
    Gets(voyage) {
        // Armo el request
        let url = this.url + '/voyages?userId=' + (voyage.userId || '') + '&voyageNumber=' + (voyage.voyageNumber || '') + '&year=' + (voyage.year || '');
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
    GetsVoyageByYears(filter) {
        // Armo el request
        let url = this.url + '/voyages/byYears?userId=' + (filter.userId || '') + '&years=' + JSON.stringify(filter.years || []);
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
    GetsDetail(voyage, page) {
        // Armo el request
        let url = this.url + '/voyages/detail?userId=' + (voyage.userId || '') + '&voyageNumber=' + (voyage.voyageNumber || '') + '&year=' + (voyage.year || '') + '&page=' + (page || '');
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
    Create(voyage) {
        delete voyage.totalReport;
        // Armo el request
        let url = this.url + '/voyages/create';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        // Parseo el obj para poder enviarlo en el request
        let body = JSON.stringify(voyage);
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
    Save(voyage) {
        delete voyage.totalReport;
        // Armo el request
        let url = this.url + '/voyages/' + voyage.id + '/update';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        // Armo el obj para enviarlo.
        let body = JSON.stringify(voyage);
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
    Delete(voyage) {
        // Armo el request
        let url = this.url + '/voyages/' + voyage.id + '/delete';
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
};
VoyageService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [HttpClient,
        AuthGuardService,
        UserService])
], VoyageService);
export { VoyageService };
//# sourceMappingURL=voyage.service.js.map