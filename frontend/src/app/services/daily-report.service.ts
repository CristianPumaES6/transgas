import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

import { EnvConfig } from '../config/env.config'

// Service
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';

// Modelos
import { DailyReport, GetInfoVoyageROBBunkering, GetROBByUser } from '../models/daily-report';
import { GetReportVoyagePortDaily } from '../models/dialog-export-excel';

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
        let url: string = this.url + '/daily-report/' + dailyReportId;
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
        let url: string = this.url + '/daily-reports/create';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });

        // Eliminamos el campo sync
        delete dailyReport.syncStatus;
        delete dailyReport.robIfo;
        delete dailyReport.robMgo;

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

        // Eliminamos el campo sync
        delete dailyReport.syncStatus;
        delete dailyReport.robIfo;
        delete dailyReport.robMgo;

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



    // Obtenemos el consumo actual
    GetROBByUser(userId: Number): Observable<GetROBByUser> {
        // Armo el request
        let url: string = this.url + '/daily-reports/get-rob/' + userId;
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
                    // Verifico si la respuesta fue correcta.
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

    // Obtenemos el consumo actual
    GetStartEndROByFilterDate(userId: number, startDate: string, endDate: string): Observable<GetROBByUser[]> {
        // Armo el request
        let url: string = this.url + '/daily-reports/get-start-end-rob/' + userId+'/'+startDate+'/'+endDate;
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
                    // Verifico si la respuesta fue correcta.
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


    // Obtenemos el consumo actual
    GetReportVoyagePortDailyByUserIdAndDate(userId: number, startDate: string, endDate: string): Observable<GetReportVoyagePortDaily[]> {
        // Armo el request
        let url: string = this.url + '/daily-reports/get-report-voyage-port-daily/' + userId + '/' + startDate + '/' + endDate;
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
                    // Verifico si la respuesta fue correcta.
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

    // Obtenemos el consumo actual
    GetReportVoyagePortDailyByUserId(userId: number): Observable<GetReportVoyagePortDaily[]> {
        // Armo el request
        let url: string = this.url + '/daily-reports/get-report-by-user/' + userId;
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
                    // Verifico si la respuesta fue correcta.
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

    // Obtenemos el consumo actual
    GetInfoVoyageROBAndBunkeringByBuqueAndDate(userId: number, startDate: string, endDate: string): Observable<GetInfoVoyageROBBunkering[]> {
        // Armo el request
        let url: string = this.url + '/daily-reports/get-info-voyage-rob-bunkering/' + userId + '/' + startDate + '/' + endDate;
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
                    // Verifico si la respuesta fue correcta.
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


}