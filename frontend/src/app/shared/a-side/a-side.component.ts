import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

// Services
import { LanguageService } from '../../services/language.service';

// Models
import { User } from '../../models/user';

// Libreria Jquery.
import * as $ from 'jquery';
import { EnvConfig } from 'src/app/config/env.config';

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

  constructor(
    private languageService: LanguageService,
  ) {
    console.log('constructor()');


  }


  ngOnInit() {
    console.log(' ngOnInit() ');

    this.onLoaded.emit(this);

    // Boton hamburguesa
    $('.az-iconbar-toggle-menu').on('click', function (e) {
      e.preventDefault();

      $('body').removeClass('az-iconbar-show');
      $('body').removeClass('az-navbar-show');
      $('body').removeClass('az-iconbar-show');
    })



    // navbar backdrop for mobile only
    $('body').append('<div class="az-navbar-backdrop"></div>');
    $('.az-navbar-backdrop').on('click touchstart', function () {
      $('body').removeClass('az-navbar-show');
      $('body').removeClass('az-iconbar-show');
    });

    this.URL_EMPRESA = EnvConfig.URL_EMPRESA;
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
    this.onNavLinkSelect.emit(this.navLink);

    $('body').removeClass('az-iconbar-show');
    $('body').removeClass('az-navbar-show');
    $('body').removeClass('az-iconbar-show');
    return false;
  }

}