import { Component, OnInit } from '@angular/core';
import { ASideComponent } from '../shared/a-side/a-side.component';

// ============== COMUNES ==============
// Router
import { ActivatedRoute, Router } from '@angular/router';

// Components Shared
import { LoadingService } from '../services/loading.service';
import { LanguageService } from '../services/language.service';

// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';

// Librerias
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
// =====================================

// Service
import { AuthService } from '../services/auth.service';
import { ASideService } from '../services/a-side.service'

// Models
import { User } from '../models/user';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  public loggedUser: User = {};

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'application';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private aSideService: ASideService,
    private languageService: LanguageService,
    private authService: AuthService,
  ) {
    console.log('constructor()');
  }

  ngOnInit(): void {
    console.log('ngOnInit()');

    // Obtenemos los datos de la session.
    this.loggedUser = this.authService.GetLoggedUser();

    // This template is mobile first so active menu in navbar
    // has submenu displayed by default but not in desktop
    // so the code below will hide the active menu if it's in desktop
    if (window.matchMedia('(min-width: 992px)').matches) {
      $('.az-navbar .active').removeClass('show');
    }

    // Shows header dropdown while hiding others
    $('.az-header .dropdown > a').on('click', function (e) {
      e.preventDefault();
      $(this).parent().toggleClass('show');
      $(this).parent().siblings().removeClass('show');
    });

    // this will hide dropdown menu from open in mobile
    $('.dropdown-menu .az-header-arrow').on('click', function (e) {
      e.preventDefault();
      $(this).closest('.dropdown').removeClass('show');
    });

    // Close dropdown menu of header menu
    $(document).on('click touchstart', function (e) {
      e.stopPropagation();

      // closing of dropdown menu in header when clicking outside of it
      var dropTarg = $(e.target).closest('.az-header .dropdown').length;
      if (!dropTarg) {
        $('.az-header .dropdown').removeClass('show');
      }

      // closing nav sub menu of header when clicking outside of it
      if (window.matchMedia('(min-width: 992px)').matches) {
        var navTarg = $(e.target).closest('.az-navbar .nav-item').length;
        if (!navTarg) {
          $('.az-navbar .nav-item').removeClass('show');
        }
      }
    });

  }

  // OnLoadingLoaded => Funcion que inicia el loading.service.
  public OnAsideLoaded(aside: ASideComponent): void {
    console.log('OnAsideLoaded(aside: ASideComponent):');

    // Cuando se carga el formulario modal, capturo la referencia y se la envio al servicio
    this.aSideService.Initialize(aside);

    this.GetRoutelNavLink();
  }

  public OnNavLinkOpenClose(type: string): boolean {
    console.log('OnNavLinkOpenClose(type: string)');

    this.aSideService.OpenClose(type);
    return false;
  }

  // Funcion para cerrar la session de usuario.
  public logout() {
    console.log('logout()');

    this.authService.Logout();
    this.loggedUser = this.authService.GetLoggedUser();
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  public GetRoutelNavLink() {
    console.log('GetRoutelNavLink()');

    let router: string = this.router.url;
    let navLink: string = '';


    switch (router) {

      case '/application/dashboard':
        navLink = 'dashboard';
        break;

      case '/application/voyages':
        navLink = 'voyages';
        break;

      case '/application/users':
        navLink = 'users';
        break;

      case '/application/helps':
        navLink = 'helps';
        break;

      default:
        navLink = 'dashboard';
        break;
    };

    this.aSideService.SetNavLink(navLink);

  }

  // This function select navLink in the router.
  public OnSelectNavLink(navLink: string) {
    console.log('OnSelectNavLink(navLink: string)');


    switch (navLink) {
      case 'dashboard':
        this.router.navigate(['../application/' + navLink], { relativeTo: this.activatedRoute });
        break;

      case 'users':
        this.router.navigate(['../application/' + navLink], { relativeTo: this.activatedRoute });
        break;

      case 'voyages':
        this.router.navigate(['../application/' + navLink], { relativeTo: this.activatedRoute });
        break;

      case 'helps':
        this.router.navigate(['../application/' + navLink], { relativeTo: this.activatedRoute });
        break;

      default:
        break;
    }
  }


}
