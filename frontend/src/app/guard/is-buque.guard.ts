import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsBuqueGuard implements CanActivate {

  constructor(
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Consultaremos que rol tiene el usuario logeado.
    let identity = this._userService.GetIdentity();

    // rol del buque
    if (identity.role === 'BUQUE') {
      this._router.navigate(['./../application/voyages'], { relativeTo: this.activatedRoute });
      return false;
    } else {
      this._router.navigate(['./../application/dashboard/general_analysis'], { relativeTo: this.activatedRoute });
      return false;
    }
  }

}
