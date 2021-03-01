import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

import { EnvConfig } from '../config/env.config'

// Service
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';

// Modelos
import { Voyage } from '../models/voyage';

@Injectable({ providedIn: 'root' })
export class VoyageService {

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
    Get(voyageId: Number): Observable<Voyage> {
        // Armo el request
        let url: string = this.url + '/voyages/' + voyageId;
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
    Gets(voyage: Voyage): Observable<Voyage[]> {
        // Armo el request
        let url: string = this.url + '/voyages?userId=' + (voyage.userId || '') + '&voyageNumber=' + (voyage.voyageNumber || '') + '&year=' + (voyage.year || '');
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
    GetsDetail(voyage: Voyage, page?: number): Observable<Voyage[]> {
        // Armo el request
        let url: string = this.url + '/voyages/detail?userId=' + (voyage.userId || '') + '&voyageNumber=' + (voyage.voyageNumber || '') + '&year=' + (voyage.year || '') + '&page=' + (page || '');
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


    Create(voyage: Voyage): Observable<Voyage> {
        // Armo el request
        let url: string = this.url + '/voyages/create';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });
        // Parseo el obj para poder enviarlo en el request
        let body: string = JSON.stringify(voyage);
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


    Save(voyage: Voyage): Observable<Voyage> {

        // Armo el request
        let url: string = this.url + '/voyages/' + voyage.id + '/update';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });

        // Armo el obj para enviarlo.
        let body: string = JSON.stringify(voyage);
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
    Delete(voyage: Voyage): Observable<Voyage> {
        // Armo el request
        let url: string = this.url + '/voyages/' + voyage.id + '/delete';
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