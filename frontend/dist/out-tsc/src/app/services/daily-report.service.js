import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { EnvConfig } from '../config/env.config';
// Service
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';
import { SendMailConfig } from '../models/sendMailConfig';
let DailyReportService = class DailyReportService {
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
    Get(dailyReportId) {
        // Armo el request
        let url = this.url + '/daily-report/' + dailyReportId;
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
    Gets(dailyReport) {
        // Armo el request
        let url = this.url + '/daily-reports?userId=' + (dailyReport.userId || '') + '&portId=' + (dailyReport.portId || '');
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
    Create(dailyReport) {
        // Armo el request
        let url = this.url + '/daily-reports/create';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        // Eliminamos el campo sync
        delete dailyReport.syncStatus;
        delete dailyReport.robIfo;
        delete dailyReport.robMgo;
        // Parseo el obj para poder enviarlo en el request
        let body = JSON.stringify(dailyReport);
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
    Save(dailyReport) {
        // Armo el request
        let url = this.url + '/daily-reports/' + dailyReport.id + '/update';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        // Eliminamos el campo sync
        delete dailyReport.syncStatus;
        delete dailyReport.robIfo;
        delete dailyReport.robMgo;
        // Armo el obj para enviarlo.
        let body = JSON.stringify(dailyReport);
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
    Delete(dailyReport) {
        // Armo el request
        let url = this.url + '/daily-reports/' + dailyReport.id + '/delete';
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
    // Obtenemos el consumo actual
    GetROBByUser(userId) {
        // Armo el request
        let url = this.url + '/daily-reports/get-rob/' + userId;
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
    // Obtenemos el consumo actual
    GetStartEndROByFilterDate(userId, startDate, endDate) {
        // Armo el request
        let url = this.url + '/daily-reports/get-start-end-rob/' + userId + '/' + startDate + '/' + endDate;
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
    // Obtenemos el consumo actual
    GetReportVoyagePortDailyByUserIdAndDate(userId, startDate, endDate) {
        // Armo el request
        let url = this.url + '/daily-reports/get-report-voyage-port-daily/' + userId + '/' + startDate + '/' + endDate;
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
    // Obtenemos el consumo actual
    GetReportVoyagePortDailyByUserId(userId) {
        // Armo el request
        let url = this.url + '/daily-reports/get-report-by-user/' + userId;
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
    // Obtenemos el consumo actual
    GetInfoVoyageROBAndBunkeringByBuqueAndDate(userId, startDate, endDate) {
        // Armo el request
        let url = this.url + '/daily-reports/get-info-voyage-rob-bunkering/' + userId + '/' + startDate + '/' + endDate;
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
    // Retorna el totar por actividad
    GetTotalByActivityFilterByUserIdAndDateAndType(userId, startDate, endDate, filter) {
        // Armo el request
        let url = this.url + '/daily-reports/get-total-by-activity/' + userId + '/' + startDate + '/' + endDate + '/' + filter;
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
    // Retorna el totar por actividad
    GetTotalConsumptionByActivityFilterByUserIdAndDateAndType(userId, startDate, endDate, typeSummary) {
        // Armo el request
        let url = this.url + '/daily-reports/get-total-consumption-by-activity/' + userId + '/' + startDate + '/' + endDate + '/' + typeSummary;
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
    // Retorna el totar por actividad
    GetReportDNVByUser(userId, startDate, endDate) {
        // Armo el request
        let url = this.url + '/daily-reports/get-report-dnv-by-user/' + userId + '/' + startDate + '/' + endDate;
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
    // Retorna el totar por actividad
    PostSendEmailLastVoyage(userId, emails) {
        // Armo el request
        let url = this.url + '/voyages/sendEmailLastVoyage';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.userService.GetToken(),
        });
        let sendMailConfig = new SendMailConfig();
        sendMailConfig.userId = userId;
        sendMailConfig.emails = emails;
        // Parseo el obj para poder enviarlo en el request
        let body = JSON.stringify(sendMailConfig);
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
};
DailyReportService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [HttpClient,
        AuthGuardService,
        UserService])
], DailyReportService);
export { DailyReportService };
//# sourceMappingURL=daily-report.service.js.map