import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {


  constructor(
    private _router: Router,
    private _userService: UserService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    let identity = this._userService.GetIdentity();
    // if (identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')) {

    if (identity) {
      this._router.navigate(['./application']);
    } else {
      return true;
    }
  }

}
