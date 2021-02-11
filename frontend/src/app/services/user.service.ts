import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

import { EnvConfig } from '../config/env.config'
//import { UUID } from 'angular2-uuid';
import Dexie from 'dexie';
//import { Todo } from '../models/todo';

// Models
import { User } from '../models/user';

import { AuthGuardService } from './auth-guard.service';

@Injectable({ providedIn: 'root' })
export class UserService {

    public db: any;

    public url: string;
    public userIdentity: User;
    public token;
    public status;

    constructor(
        private httpClient: HttpClient,
        private authGuardService: AuthGuardService
    ) {
        console.log('constructor()');

        this.url = EnvConfig.API;
        // Obtenemos la identidad logeada.
        this.GetIdentity();
    }

    //--------------- Servicios Utiles, deberia ir en el shared Creo ----------------------------------------//
    // Obtiene al usuario logeado.
    public GetIdentity(): User {
        console.log('GetIdentity()');

        // Obtenemos la entidad del localStorage LoggedUser
        let identity: User = JSON.parse(localStorage.getItem('LoggedUser'));
        if (identity) {
            this.userIdentity = identity;
        } else {
            this.userIdentity = null;
        }

        return this.userIdentity;
    }

    // obtiene el token del usuario actual
    public GetToken(): string {
        console.log('GetToken()');

        let token = localStorage.getItem('Session');
        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }
    // --------------------------------------------------------




    //---------------------------------------------------------------------------//
    //----------------------------- Services ------------------------------------//
    //---[ Get<Class>s, Get<Class>, Create<Class>, Save<Class>, Delete<Class>]---//
    //---------------------------------------------------------------------------//

    GetUser(userId: Number): Observable<User> {
        console.log('GetUser(userId: Number)');

        // Armo el request
        let url: string = this.url + '/users/' + userId;
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.GetToken(),
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



    GetUsers(user: User): Observable<User[]> {
        // Armo el request
        let url: string = this.url + '/users?id=' + this.userIdentity.id + '&name=' + user.name + '&role=' + user.role;
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.GetToken(),
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


    CreateUser(user: User): Observable<User> {
        // Armo el request
        let url: string = this.url + '/users/create';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.GetToken(),
            });

        // Eliminamos el campo sync
        delete user.syncStatus;
        let body: string = JSON.stringify(user);
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


    SaveUser(user: User): Observable<User> {
        // Armo el request
        let url: string = this.url + '/users/' + user.id + '/update';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.GetToken(),
            });

        // Eliminamos el campo sync
        delete user.syncStatus;
        let body: string = JSON.stringify(user);
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


    DeleteUser(user: User): Observable<User> {
        // Armo el request
        let url: string = this.url + '/users/' + user.id + '/delete';
        let headers: HttpHeaders = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.GetToken(),
            });
        let options: any = { headers: headers, responseType: 'json' };

        debugger
        // Mando consulta al API
        return this.httpClient.delete(url, options).pipe(
            map(
                (response: any) => {
                    debugger
                    if (response.status && response.status === 200) {
                        debugger
                        return response.data;
                    } else {
                        throw response.description || response.error || '';
                    }
                    debugger
                }
            ),
            catchError((err) => this.authGuardService.HandleError(err))
        );
    }

    // -----------------------------------------


}