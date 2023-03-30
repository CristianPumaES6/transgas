import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { LoadingService } from './services/loading.service';
// Moldes
import { User } from './models/user';
// Service
import { AuthService } from './services/auth.service';
let AppComponent = class AppComponent {
    constructor(loadingService, authService) {
        this.loadingService = loadingService;
        this.authService = authService;
        this.title = 'Transgas';
        // Configuracion para las notificaciones
        this.notificationOpts = {
            timeOut: 8000,
            lastOnBottom: true,
            clickToClose: true,
            maxLength: 0,
            maxStack: 7,
            showProgressBar: true,
            pauseOnHover: true
        };
        console.log('constructor()');
    }
    ;
    ngOnInit() {
        console.log('ngOnInit()');
        this.loggedUser = this.authService.GetLoggedUser();
    }
    // OnLoadingLoaded => Funcion que inicia el loading.service.
    OnLoadingLoaded(loading) {
        console.log('OnLoadingLoaded(loading: LoadingComponent)');
        // Cuando se carga el formulario modal, capturo la referencia y se la envio al servicio
        this.loadingService.Initialize(loading);
    }
};
__decorate([
    Input(),
    __metadata("design:type", User)
], AppComponent.prototype, "loggedUser", void 0);
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    }),
    __metadata("design:paramtypes", [LoadingService,
        AuthService])
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map