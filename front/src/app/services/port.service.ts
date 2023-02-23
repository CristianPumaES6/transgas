import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

import { EnvConfig } from '../config/env.config'

// Service
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';

// Modelos
import { GetLastPortAndTotalConsump, Port } from '../models/port';

@Injectable({ providedIn: 'root' })
export class PortService {

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
    Get(portId: Number): Observable<Port> {
        // Armo el request
        let url: string = this.url + '/ports/' + portId;
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
    Gets(port: Port): Observable<Port[]> {
        // Armo el request
        let url: string = this.url + '/ports?userId=' + (port.userId || '') + '&voyageId=' + (port.voyageId || '') + '&portNumber=' + (port.portNumber || '')+'&departurePort=' + (port.departurePort || '')+'&arrivalPort=' + (port.arrivalPort || '');
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
    GetsDetail(port: Port, page?: number): Observable<Port[]> {
        // Armo el request
        let url: string = this.url + '/ports/detail?userId=' + (port.userId || '') + '&voyageId=' + (port.voyageId || '') + '&portNumber=' + (port.portNumber || '')+'&departurePort=' + (port.departurePort || '')+'&arrivalPort=' + (port.arrivalPort || '');
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


    Create(port: Port): Observable<Port> {
        // Armo el request
        let url: string = this.url + '/ports/create';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });
            
        // Eliminamos el campo sync
        delete port.syncStatus;
        
        delete port.totalReport;
        // Parseo el obj para poder enviarlo en el request
        let body: string = JSON.stringify(port);
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


    Save(port: Port): Observable<Port> {

        // Armo el request
        let url: string = this.url + '/ports/' + port.id + '/update';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });

        // Eliminamos el campo sync
        delete port.syncStatus;
        delete port.totalReport;
        delete port.totalReport;
        delete port.dailyReports;
        // Armo el obj para enviarlo.
        let body: string = JSON.stringify(port);
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
    Delete(port: Port): Observable<Port> {
        // Armo el request
        let url: string = this.url + '/ports/' + port.id + '/delete';
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


     // Retorna el totar por actividad
     GetTotalByActivityFilterByUserIdAndDateAndType(userId: number): Observable<GetLastPortAndTotalConsump> {
        // Armo el request
        let url: string = this.url + '/ports/getLastPortAndTotalConsump/' +userId ;
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