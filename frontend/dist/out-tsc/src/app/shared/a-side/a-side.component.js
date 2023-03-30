import { __decorate, __metadata } from "tslib";
import { Component, Output, EventEmitter, Input } from '@angular/core';
// Services
import { LanguageService } from '../../services/language.service';
// Models
import { User } from '../../models/user';
// Libreria Jquery.
import * as $ from 'jquery';
import { EnvConfig } from '../../config/env.config';
let ASideComponent = class ASideComponent {
    constructor(languageService) {
        this.languageService = languageService;
        // Variables de traduccion
        this.translateCategory = 'aSide';
        this.userLanguage = this.languageService.GetCurrentLanguage();
        this.loggedUser = new User();
        // Creamos la variable
        this.onLoaded = new EventEmitter();
        // Creamos una variable de salida que emitira que navlink a sido seleccionado.
        this.onNavLinkSelect = new EventEmitter();
        // Esta variable servira para almacenar el item seleccionado.
        this.navLink = '';
        // Esta variable servira para saber si el menu esta abierto.
        this.openedNavBarMovil = '';
        this.URL_EMPRESA = '';
        // El sub menu esta abierto o cerrado.
        this.isOpenSubMenu = false;
        console.log('constructor()');
    }
    ngOnInit() {
        console.log(' ngOnInit() ');
        this.onLoaded.emit(this);
        // navbar backdrop for mobile only
        $('body').append('<div class="az-navbar-backdrop"></div>');
        $('.az-navbar-backdrop').on('click touchstart', function () {
            $('body').removeClass('az-navbar-show');
            $('body').removeClass('az-iconbar-show');
        });
        this.URL_EMPRESA = EnvConfig.URL_EMPRESA;
    }
    // Al darle click cerrar SubMenu
    ClickCerrarMenu() {
        console.log(' ClickCerrarMenu()');
        $('body').removeClass('az-iconbar-show');
        $('body').removeClass('az-navbar-show');
        $('.az-iconbar .nav-link.active').removeClass('active');
        this.isOpenSubMenu = false;
        $('.az-iconbar-aside').removeClass('show');
        return false;
    }
    /*public OpenClose(): boolean { */
    ClickFormulateOrMenuOrClose(type) {
        console.log('ClickFormulateOrMenuOrClose(type: string)');
        this.openedNavBarMovil = type;
        switch (this.openedNavBarMovil) {
            case 'open-menu':
                $('body').addClass(' az-navbar-show');
                $('body').addClass(' az-iconbar-show');
                break;
            case 'close-menu':
                //  alert('close')
                break;
            case 'open-formulario':
                $('body').addClass('az-content-body-show');
                break;
            case 'back-formulario':
                $('body').removeClass('az-content-body-show');
                break;
            default:
                $('body').removeClass('az-content-body-show');
                break;
        }
        return false;
    }
    openMenu() {
        console.log('openMenu()');
        this.openedNavBarMovil = 'open-menu';
        return false;
    }
    closeMenu() {
        console.log('closeMenu()');
        this.openedNavBarMovil = 'close-menu';
        return false;
    }
    isOpened() {
        console.log('isOpened()');
        return (this.openedNavBarMovil === 'open-menu');
    }
    // Seteamos el nuevo navLink.
    setNavLink(newNavLink) {
        console.log('setNavLink(newNavLink: string)');
        this.navLink = newNavLink;
        return this.navLink;
    }
    // This function returns the selected nav.
    whatNavLinkIsSelected() {
        console.log('whatNavLinkIsSelected()');
        return this.navLink;
    }
    // This function changes the nav value.
    selectNavLink(navLink) {
        console.log('selectNavLink(navLink: string)');
        // Actualizamos el navLink seleccionado.
        this.navLink = navLink;
        // solo si esta abiero el sub menu lo cerramos.
        if (this.isOpenSubMenu) {
            this.isOpenSubMenu = false;
            $('.az-iconbar-aside').removeClass('show');
        }
        // Si esta cerrado y ademas se a seleccioado el dashboard
        // Abrimos el subMenu
        else if (this.navLink == 'dashboard') {
            this.isOpenSubMenu = true;
            $('.az-iconbar-aside').addClass('show');
        }
        // SI el navlick no es dashboard, deveria mandar el emit y remover lo abierto.  
        if (this.navLink != 'dashboard') {
            this.onNavLinkSelect.emit(this.navLink);
            $('body').removeClass('az-iconbar-show');
            $('body').removeClass('az-navbar-show');
            $('body').removeClass('az-iconbar-show');
        }
        return false;
    }
};
__decorate([
    Input(),
    __metadata("design:type", User)
], ASideComponent.prototype, "loggedUser", void 0);
__decorate([
    Output('onLoaded'),
    __metadata("design:type", EventEmitter)
], ASideComponent.prototype, "onLoaded", void 0);
__decorate([
    Output('onNavLinkSelect'),
    __metadata("design:type", Object)
], ASideComponent.prototype, "onNavLinkSelect", void 0);
ASideComponent = __decorate([
    Component({
        selector: 'app-a-side',
        templateUrl: './a-side.html',
        styleUrls: ['./a-side.scss']
    }),
    __metadata("design:paramtypes", [LanguageService])
], ASideComponent);
export { ASideComponent };
//# sourceMappingURL=a-side.component.js.map