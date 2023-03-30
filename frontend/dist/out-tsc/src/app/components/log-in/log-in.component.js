import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
// ============== COMUNES ==============
// Router
import { ActivatedRoute, Router } from '@angular/router';
// Components Shared
import { LoadingService } from '../../services/loading.service';
import { LanguageService } from '../../services/language.service';
// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';
// =====================================
// Models
import { Login } from '../../models/user';
//Service
import { AuthService } from '../../services/auth.service';
import { EnvConfig } from '../../config/env.config';
import { DatabaseService } from '../../services/database.service';
let LogInComponent = class LogInComponent {
    constructor(router, activatedRoute, loadingService, languageService, authService, databaseService, notificationsService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.loadingService = loadingService;
        this.languageService = languageService;
        this.authService = authService;
        this.databaseService = databaseService;
        this.notificationsService = notificationsService;
        // Variables de traduccion
        this.userLanguage = this.languageService.GetCurrentLanguage();
        this.translateCategory = 'logIn';
        // Armo modelo Login
        this.login = new Login();
        this.version = '';
        console.log("constructor()");
        // Mostramos la version del app
        this.version = EnvConfig.VERSION;
    }
    ngOnInit() {
        console.log('ngOnInit()');
    }
    // Cambiar lenguaje
    ChangeLanguage(language) {
        console.log("ChangeLanguage(language: string)");
        // Usamos un servicio de language ya creado.
        this.languageService.SetCurrentLanguage(language);
        location.reload();
    }
    async Login() {
        console.log('Login()');
        let resultUser = {};
        this.loadingService.Open();
        await Promise.resolve(true).then(result => {
            // Hacemos la consulta del login
            return this.authService.Login(this.login).toPromise();
        }).then((resultLoginGetUser) => {
            // Verifico si el login fue exitoso 
            if (!resultLoginGetUser) {
                // CASO QUE NO SE EL LOGIN CORRECTO ENVIO UN ERROR
                throw 'LOGIN_FAILED';
            }
            resultUser = resultLoginGetUser;
            // Muestro notificación
            this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_LOGIN').replace('{{NAME}}', resultUser.name));
            // SINCRONIZAMOS LOS DATOS.
            return this.databaseService.Sync();
        }).then(result => {
            if (!result) {
                throw 'ERROR SYNC SALTO RAPIDO';
            }
            // SINCRONIZAMOS LOS DATOS.
            return this.databaseService.UpdateDataLocal();
        }).then(result => {
            if (!result) {
                throw 'ERROR UpdateDataLocal';
            }
            // Al logearse un buque te redirecciona al modulo de voyages
            if (resultUser.role === 'BUQUE') {
                this.router.navigate(['./application/voyages'], { relativeTo: this.activatedRoute });
            }
            else {
                // Si no es un buque redirecciona a application
                // Todo OK, navego al home
                this.router.navigate(['./application'], { relativeTo: this.activatedRoute });
            }
        }).catch(error => {
            // Mensaje de error generico
            let errMsg = this.languageService.GetMessage(this.translateCategory, 'ERROR_CONNECTION');
            // Verifico si hubo error de conexion HTTP y muestro mensaje
            if (error.status === 0)
                this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), errMsg);
            else if (error.status > 0)
                this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), errMsg); // Quite estas opciones error.error && error.error.error ||  =>
            // Deshabilito flag de processing
            // Deshabilito el spinner de loading
            this.loadingService.Close();
        });
    }
};
LogInComponent = __decorate([
    Component({
        selector: 'app-log-in',
        templateUrl: './log-in.component.html',
        styleUrls: ['./log-in.component.scss']
    }),
    __metadata("design:paramtypes", [Router,
        ActivatedRoute,
        LoadingService,
        LanguageService,
        AuthService,
        DatabaseService,
        NotificationsService])
], LogInComponent);
export { LogInComponent };
//# sourceMappingURL=log-in.component.js.map