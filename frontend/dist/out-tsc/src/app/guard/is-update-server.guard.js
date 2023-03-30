import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { EnvConfig } from '../config/env.config';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';
import { UserService } from '../services/user.service';
import { OnlineOfflineService } from '../services/online-offline.service';
import { DialogUpdateServerComponent } from '../shared/dialog/dialog-update-server/dialog-update-server.component';
import { MatDialog } from '@angular/material/dialog';
let IsUpdateServerGuard = class IsUpdateServerGuard {
    //=================[ FIN ]=====================
    constructor(_router, _userService, _authService, languageService, notificationsService, onlineOfflineService, dialog) {
        this._router = _router;
        this._userService = _userService;
        this._authService = _authService;
        this.languageService = languageService;
        this.notificationsService = notificationsService;
        this.onlineOfflineService = onlineOfflineService;
        this.dialog = dialog;
        //======== VARIABLES DE TRADUCCION=============
        this.userLanguage = this.languageService.GetCurrentLanguage();
        this.translateCategory = 'guards';
        console.log('Constructor()');
    }
    canActivate(next, state) {
        console.log('canActivate()');
        // REVISAR Este CODIO 19961492
        // Solo si esta estamos en linea actualizamos consultamos la version del servidor.
        if (false) {
            // Retornaremos true solo si la la plataforma esta actualizada.
            return Promise.resolve(true).then(result => {
                // Consultamos la version de la plataforma
                return this._authService.GetVersionPlataform().pipe().toPromise();
            }).then(version => {
                // Verificamos si las versiones son diferentes,
                // SI lo son tenemos que hacerle redload.
                if (version !== EnvConfig.VERSION) {
                    // Si la version del server no es la misma entonces 
                    // abrimos el popup del reload.
                    this.OpenDialogUpdateServer(version, EnvConfig.VERSION);
                }
                return true;
            }).catch(error => {
                // Valido si viene un mensaje de error
                let msg = this.languageService.GetMessage(this.translateCategory, error);
                // Muestro notificación
                this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'Offline'), msg);
                // Igual retornamos true.
                return true;
            });
        }
        else {
            return true;
        }
    }
    // Abre el popup del update servidor
    OpenDialogUpdateServer(versionServer, versionWebActual) {
        let dialogUpdateServer = {
            versionActual: versionWebActual,
            versionServer: versionServer
        };
        const dialogRef = this.dialog.open(DialogUpdateServerComponent, {
            data: dialogUpdateServer
        });
        dialogRef.afterClosed().subscribe((result) => {
            location.reload();
        });
    }
};
IsUpdateServerGuard = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [Router,
        UserService,
        AuthService,
        LanguageService,
        NotificationsService,
        OnlineOfflineService,
        MatDialog])
], IsUpdateServerGuard);
export { IsUpdateServerGuard };
//# sourceMappingURL=is-update-server.guard.js.map