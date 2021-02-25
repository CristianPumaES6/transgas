import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

import { EnvConfig } from '../config/env.config'

// Service
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';

// Modelos
import { DailyReport } from '../models/daily-report';

@Injectable({ providedIn: 'root' })
export class DailyReportService {

    public url: string;

    // Constructor
    constructor(
        // HttpClient
        private httpClient: HttpClient,
        // GuardService.
        private authGuardService: AuthGuardService,
        // Instanciamos al servicio usuario.
        private userService: UserService,
    ) {
        this.url = EnvConfig.API;
    }

    // Obtine solo un objeto desde el ID.
    Get(dailyReportId: Number): Observable<DailyReport> {
        // Armo el request
        let url: string = this.url + '/daily-repots/' + dailyReportId;
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });
        let options: any = { headers: headers, responseType: 'json' };

        // Mando consulta al API
        return this.httpClient.get(url, options).pipe(
            map(
                (response: any) => {
                    if (response.status && response.status === 200) {
                        return response.data;
                    } else {
                        throw response.description || response.error || '';
                    }
                }
            ), catchError((err) => {
                return this.authGuardService.HandleError(err);
            })
        );
    }

    // Obtiene todos los objetos segun el filtro enviado.
    Gets(dailyReport: DailyReport): Observable<DailyReport[]> {
        // Armo el request
        let url: string = this.url + '/daily-reports?userId=' + (dailyReport.userId || '') + '&portId=' + (dailyReport.portId || '');
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });
        let options: any = { headers: headers, responseType: 'json' };

        // Mando consulta al API
        return this.httpClient.get(url, options).pipe(
            map(
                (response: any) => {
                    if (response.status && response.status === 200) {
                        return response.data;
                    } else {
                        throw response.description || response.error || '';
                    }
                }
            ), catchError((err) => {
                return this.authGuardService.HandleError(err);
            })
        );
    }

    Create(dailyReport: DailyReport): Observable<DailyReport> {
        // Armo el request
        let url: string = this.url + '/daily-report/create';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });
        // Parseo el obj para poder enviarlo en el request
        let body: string = JSON.stringify(dailyReport);
        let options: any = { headers: headers, responseType: 'json' };

        // Mando consulta al API
        return this.httpClient.post(url, body, options).pipe(
            map(
                (response: any) => {
                    if (response.status && response.status === 200) {
                        return response.data;
                    } else {
                        throw response.description || response.error || '';
                    }
                }
            ),
            catchError((err) => this.authGuardService.HandleError(err))
        );
    }

    Save(dailyReport: DailyReport): Observable<DailyReport> {

        // Armo el request
        let url: string = this.url + '/daily-reports/' + dailyReport.id + '/update';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });

        // Armo el obj para enviarlo.
        let body: string = JSON.stringify(dailyReport);
        let options: any = { headers: headers, responseType: 'json' };

        // Mando consulta al API
        return this.httpClient.put(url, body, options).pipe(
            map(
                (response: any) => {
                    if (response.status && response.status === 200) {
                        return response.data;
                    } else {
                        throw response.description || response.error || '';
                    }
                }
            ),
            catchError((err) => this.authGuardService.HandleError(err))
        );
    }

    // Eliminamos el obj desde el id recibido desde el obj.
    Delete(dailyReport: DailyReport): Observable<DailyReport> {
        // Armo el request
        let url: string = this.url + '/daily-reports/' + dailyReport.id + '/delete';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });
        let options: any = { headers: headers, responseType: 'json' };

        // Mando consulta al API
        return this.httpClient.delete(url, options).pipe(
            map(
                (response: any) => {
                    if (response.status && response.status === 200) {
                        return response.data;
                    } else {
                        throw response.description || response.error || '';
                    }
                }
            ),
            catchError((err) => this.authGuardService.HandleError(err))
        );
    }


}