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
import { OnlineOfflineService } from '../services/online-offline.service';
import { AuthService } from '../services/auth.service';
import { ASideService } from '../services/a-side.service';
import { UserService } from '../services/user.service';

import { DatabaseService } from '../services/database.service';

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

  public isOnline: boolean = !!window.navigator.onLine;
  public getUsers: User[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private aSideService: ASideService,
    private languageService: LanguageService,
    private authService: AuthService,
    readonly onlineOfflineService: OnlineOfflineService,
    private readonly databaseService: DatabaseService,
    private userService: UserService,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService,
  ) {
    console.log('ApplicationComponent constructor()');

    // subscribe receives the value. sirve para recibir algun emit
    this.onlineOfflineService.emitterIsOnline.subscribe(
      (isOnline: boolean) => {
        console.log('this.onlineOfflineService.changeOnline.subscribe()');

        this.isOnline = isOnline;
      }
    );
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



    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (!!window.navigator.onLine) {

      // Instanciamos el obj que usaremos.
      let user: User = new User();
      
      // Ejecuto todas las consultas para cargar datos segundarios
      forkJoin(
        [
          // Traigo a todos los User y lo instancio en el obj.
          this.GetUsers(user)
        ]
      ).pipe(
        mergeMap(
          (result: boolean[]) => {
            if (result) {

              // Obtengo resultados de las funciones
              let resulGetSailingAnalities: boolean = result[0];


              // Evaluo posibles errores en las ejecuciones
              if (!resulGetSailingAnalities) throw 'ERROR_GET_USERS';

              // Sincronizamos todos los datos.
              return this.databaseService.Sync();
            } else {
              // Algo fallo al ejecutar los observables
              throw this.languageService.GetMessage(this.translateCategory, 'ERROR_USERS_GET');
            }
          }
        ), mergeMap(
          (result: boolean) => {

            // Revisamos si el result es el esperado.
            if (!result) throw 'ERROR_SYNC_INDEXEDDB_IN_ONLINE';

            return this.databaseService.ClearUsersIndexedDB();
          }
        ), mergeMap(
          (result: boolean) => {
            // Revisamos si el result es el esperado.
            if (!result) throw 'ERROR_CLEAR_INDEXEDDB';

            // Agregamos los usuarios al indexedDB
            return this.databaseService.addUsersIndexedDB(this.getUsers);
          }
        )
      ).subscribe(
        (result: boolean) => {
          // Revisamos si el result es el esperado.
          if (!result) throw 'ERROR_UPDATE_INDEXEDDB_IN_ONLINE';

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        },
        err => {
          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD'));

          // Esto deberian de enviarlo para registrar los errores.
          console.error(msg);
          console.dir(err);

          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }


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


  // Funciones para cargar combos //
  //////////////////////////////////

  // GetUsers: Cargo todos los Users para el listado de Users.
  private GetUsers(user: User): Observable<boolean> {
    console.log('GetUsers(user: User)');

    // Consulto la lista de paises para cargar combo
    return this.userService.GetUsers(user).pipe(map(
      (resultUsers: User[]) => {

        // Update result Users
        this.getUsers = resultUsers;

        // Segun el resultado retornamos la respuesta.
        return (resultUsers !== null);
      }
    ));
  }


}
