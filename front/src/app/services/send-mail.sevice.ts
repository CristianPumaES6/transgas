import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

import { EnvConfig } from '../config/env.config'

// Service
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';

// Modelos
import { Voyage, VoyageFilterByYears } from '../models/voyage';
import { SendMessageEntity } from '../models/send-message';

@Injectable({ providedIn: 'root' })
export class SendMailService {

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



    GetConfigSendMail(usersId: number): Observable<SendMessageEntity> {
        // Armo el request
        let url: string = this.url + '/send-message/configSendMail?userId=' + (usersId || '');
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

    SaveConfigMail(sendMessageEntity: SendMessageEntity): Observable<SendMessageEntity> {
        // Armo el request
        let url: string = this.url + '/send-message/saveConfig';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.userService.GetToken(),
            });


        // Parseo el obj para poder enviarlo en el request
        let body: string = JSON.stringify(sendMessageEntity);
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


}