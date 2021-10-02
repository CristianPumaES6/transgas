import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';
import { EnvConfig } from '../config/env.config';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';
import { UserService } from '../services/user.service';
import { OnlineOfflineService } from '../services/online-offline.service';

@Injectable({
  providedIn: 'root'
})
export class IsUpdateServerGuard implements CanActivate {

  //======== VARIABLES DE TRADUCCION=============
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'guards';
  //=================[ FIN ]=====================

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _authService: AuthService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private onlineOfflineService: OnlineOfflineService,
  ) {
    console.log('Constructor()')
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      console.log('canActivate()')

    // Solo si esta estamos en linea actualizamos consultamos la version del servidor.
    if (true) {

      // Retornaremos true solo si la la plataforma esta actualizada.
      return Promise.resolve(true).then(
        result => {
          // Consultamos la version de la plataforma
          return this._authService.GetVersionPlataform().pipe().toPromise();
        }
      ).then(
        version => {
          // Verificamos si las versiones son diferentes,
          // SI lo son tenemos que hacerle redload.
          if (version !== EnvConfig.VERSION) {

            // alert(version +"  !==  "+EnvConfig.VERSION);
            location.reload();
          }

          return true;
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error);

          // Muestro notificación
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'Offline'), msg);


          // Igual retornamos true.
          return true;
        }
      );

    }

  }

}
