import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  // Esto por el momento oslo se ejecutar en la url raiz.
  // la idea es => si esta logeado directamente te redirecciona al modulo de la aplicacion.

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let identity = this._userService.GetIdentity();
    let token = this._userService.GetToken();
    // if (identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')) {


    return Promise.resolve(true).then(
      result => {
        // Si existe un identified nos vamos directamente a application.
        if (identity) {

          this._router.navigate(['./application']);
        } else {
          return true;
        }

      });



  }

}
