import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

// Services
import { LanguageService } from '../../services/language.service';

// Models
import { User } from '../../models/user';

// Libreria Jquery.
import * as $ from 'jquery';
import { EnvConfig } from '../../config/env.config';

@Component({
  selector: 'app-a-side',
  templateUrl: './a-side.html',
  styleUrls: ['./a-side.scss']
})
export class ASideComponent implements OnInit {

  // Variables de traduccion
  public translateCategory: string = 'aSide';
  public userLanguage: string = this.languageService.GetCurrentLanguage();

  @Input()
  public loggedUser: User = new User();

  // Creamos la variable
  @Output('onLoaded') private onLoaded: EventEmitter<ASideComponent> = new EventEmitter<ASideComponent>();

  // Creamos una variable de salida que emitira que navlink a sido seleccionado.
  @Output('onNavLinkSelect') onNavLinkSelect = new EventEmitter<string>();

  // Esta variable servira para almacenar el item seleccionado.
  public navLink: string = '';

  // Esta variable servira para saber si el menu esta abierto.
  public openedNavBarMovil: string = '';

  public URL_EMPRESA: string = '';

  // El sub menu esta abierto o cerrado.
  public isOpenSubMenu = false;

  constructor(
    private languageService: LanguageService,
  ) {
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
  public ClickCerrarMenu(): boolean {
    console.log(' ClickCerrarMenu()');

    $('body').removeClass('az-iconbar-show');
    $('body').removeClass('az-navbar-show');
    $('.az-iconbar .nav-link.active').removeClass('active');

    this.isOpenSubMenu = false;
    $('.az-iconbar-aside').removeClass('show');
    return false;
  }

  /*public OpenClose(): boolean { */
  public ClickFormulateOrMenuOrClose(type: string): boolean {
    console.log('ClickFormulateOrMenuOrClose(type: string)')


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

  public openMenu(): boolean {
    console.log('openMenu()');


    this.openedNavBarMovil = 'open-menu';
    return false;
  }

  public closeMenu(): boolean {
    console.log('closeMenu()');

    this.openedNavBarMovil = 'close-menu';
    return false;
  }

  public isOpened(): boolean {
    console.log('isOpened()');

    return (this.openedNavBarMovil === 'open-menu');
  }

  // Seteamos el nuevo navLink.
  public setNavLink(newNavLink: string): string {
    console.log('setNavLink(newNavLink: string)');

    this.navLink = newNavLink;
    return this.navLink;
  }

  // This function returns the selected nav.
  public whatNavLinkIsSelected(): string {
    console.log('whatNavLinkIsSelected()');


    return this.navLink;
  }

  // This function changes the nav value.
  public selectNavLink(navLink: string): boolean {
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

}