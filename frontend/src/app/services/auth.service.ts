import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { EnvConfig } from '../config/env.config';

// ============== Modelos ==============
import { User } from '../models/user';
import { Login } from '../models/user';

// ============== Componentes ==============
import { AppComponent } from '../app.component'

// =====================================
// ============== COMUNES ==============
// =====================================

// Components Shared
import { LoadingService } from '../services/loading.service';
import { LanguageService } from '../services/language.service';


import * as Moment from 'moment';
import * as TimeZone from 'moment-timezone';

// Config
import { AuthGuardService } from './auth-guard.service';
import { LoggedUser } from '../models/loggedUser';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // Datos de la session activa
  private session: string;
  private loggedUser: User;

  constructor(
    public http: HttpClient,
    private httpClient: HttpClient,
    private languageService: LanguageService,
    private authGuardService: AuthGuardService,
  ) {
    console.log('Constructor');

    // Intento obtener datos almacenados en localStorage
    try {
      this.session = localStorage.getItem('Session');
      this.loggedUser = JSON.parse(localStorage.getItem('LoggedUser'));
    } catch (err) { }

  }

  // Datos de configuracion del usuario
  private timeZone: string;
  public clientOffset: number = 0;

  Login(login: Login): Observable<User> {

    // Armo el request
    let url: string = EnvConfig.API + '/auth/login';

    let headers: HttpHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json'
      });
    let body: string = JSON.stringify(login);
    let options: any = { headers: headers, responseType: 'json' };

    return this.httpClient.post(url, body, options)
      .pipe(map(
        (response: any) => {
          // Verificamos que la respuesta.
          if (response.data && response.token) {

            // Guardamos la data y token del usuario.
            this.loggedUser = response.data;
            this.session = response.token;

            // Inicializo la zona horaria del cliente
            this.InitializeTimezone();

            // Seteo el idioma en uso
            this.languageService.SetCurrentLanguage(this.loggedUser.language);

            // Guardo la sesion y el usario en localStorage
            localStorage.setItem('Session', this.session);
            localStorage.setItem('LoggedUser', JSON.stringify(this.loggedUser));

            // Devuelvo true
            return response.data;
          } else {
            // Devuelvo false
            return false;
          }
        }
      ));
  }

  GetTimeZone(): string {
    // Devuelvo la zona horaria del usuario
    return this.timeZone;
  }

  InitializeTimezone(): void {
    // Obtengo el nombre del timezone
    this.timeZone =  TimeZone.tz.guess();
    // Obtengo objeto zona de moment, a partir del nombre del timezonetz.zone(this.timeZone)
    let zone: TimeZone.MomentZone = TimeZone.tz.zone(this.timeZone);
    // Obtengo diferencia en minutos de utc al timezone, para la fecha actual
    if (zone) this.clientOffset = -1 * zone.utcOffset(TimeZone().valueOf());
  }

  GetSession(): string {
    // Devuelvo la sesion guardada localmente
    return this.session;
  }

  GetLoggedUser(): User {
    // Devuelvo el usuario guardado localmente
    return this.loggedUser;
  }


  Logout(): boolean {

    localStorage.clear();
    this.session = null;
    this.loggedUser = null;

    return false;

  }


  // Este servicio registra el logeo de un usuario.
  RegisterUserConnection(loggedUser:LoggedUser): Observable<boolean> {

    // Armo el request
    let url: string = EnvConfig.API + '/loggedUsers';

    let headers: HttpHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + this.userService.GetToken(),
      });
    let body: string = JSON.stringify(loggedUser);
    let options: any = { headers: headers, responseType: 'json' };

    return this.httpClient.post(url, body, options)
      .pipe(map(
        (response: any) => {

          // Verificamos que la respuesta.
          if (response.status && response.status === 200) {
              return response.data;
          } else {
              throw response.description || response.error || '';
          }

        }
      ));

  }



    // Obtiene todos los objetos segun el filtro enviado.
    GetUserConnection(): Observable<LoggedUser[]> {
      // Armo el request
      let url: string = EnvConfig.API + '/loggedUsers';
      let headers: HttpHeaders = new HttpHeaders(
          {
              'Content-Type': 'application/json',
              //'Authorization': 'Bearer ' + this.userService.GetToken(),
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

}
