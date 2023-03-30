import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
let IsLoginGuard = class IsLoginGuard {
    // Esto por el momento oslo se ejecutar en la url raiz.
    // la idea es => si esta logeado directamente te redirecciona al modulo de la aplicacion.
    constructor(_router, _userService, _authService) {
        this._router = _router;
        this._userService = _userService;
        this._authService = _authService;
    }
    canActivate(next, state) {
        let identity = this._userService.GetIdentity();
        let token = this._userService.GetToken();
        // if (identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')) {
        return Promise.resolve(true).then(result => {
            // Si existe un identified nos vamos directamente a application.
            if (identity) {
                this._router.navigate(['./application']);
            }
            else {
                return true;
            }
        });
    }
};
IsLoginGuard = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [Router,
        UserService,
        AuthService])
], IsLoginGuard);
export { IsLoginGuard };
//# sourceMappingURL=is-login.guard.js.map