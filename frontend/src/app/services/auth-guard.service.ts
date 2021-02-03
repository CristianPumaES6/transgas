import { Injectable } from '@angular/core';
import { Router, Route, CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';

import { NotificationsService } from 'angular2-notifications';
import { LanguageService } from './language.service';

import { Observable, throwError, of } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

    // Parametros generales traduccion
    public translateCategory: string = 'auth';

    constructor(
        private languageService: LanguageService,
        private notificationsService: NotificationsService,
    ) { }

    // Funcion canActivate que usa el router para validar si se debe permitir o no navegacion
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Todo OK, autorizo la navegacion
        return true;
    }


    // Manejo de errores para respuestas del API
    HandleError(err: any): Observable<never> {

        // Obtengo el mensaje de error, que es lo que se va a enviar hacia atras
        let errMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'CONNECTION_ERROR');

        // Si el error es un 401 Unauthorized asumo que la sesion se perdio
        if (err.status === 401) {
            // Actualizo sesion y usario en localStorage
            localStorage.removeItem('Session');
            localStorage.removeItem('LoggedUser');
            localStorage.removeItem('LoggedUserRole');
            localStorage.removeItem('IsSystemUser');
            localStorage.removeItem('LoggingOut');

            // RECARGAMOS LA SESSION.
            location.reload();
            // Actualizo el mensaje a mostrar
            errMsg = 'SESSION_LOST_401';


        }

        // Si el error es un 402 Payment required la instancia está vencida o suspendida
        if (err.status === 402) {
            // Verifico si el usuario tiene permisos para navegar a la pantalla de suscripción

            errMsg = 'ACCOUNT_EXPIRED_402';
        }

        // Si el error es un 403 Forbidden hay que avisar que es por permisos
        if (err.status === 403) {
            // Muestro mensaje de error
            errMsg = 'USER_HAS_NOT_PERSMISSIONS_403';
        }

        // Si el error es un 404 Not found devuelvo error traducido
        if (err.status === 404) {
            // Muestro mensaje de error
            errMsg = 'SERVER_RETURNED_NOT_FOUND_404';
        }

        // Verifico si hubo error de conexión con el servidor
        if (err.status === 0 && err.name === 'HttpErrorResponse') {
            // Muestro mensaje de error
            errMsg = this.languageService.GetMessage(this.translateCategory, 'CANNOT_REACH_SERVER');
        }

        // Propago el error
        return throwError(this.languageService.GetMessage(this.translateCategory, errMsg));
    }
}