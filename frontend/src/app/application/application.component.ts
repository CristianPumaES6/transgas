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
import { EnvConfig } from '../config/env.config';
import { CantidadRestante } from '../models/loggedUser';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  // Usuario logeado.
  public loggedUser: User = {};

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'application';

  // esta variable ayuda a saber si la aplicacion se encuantra en linea.
  public isOnline: boolean = false;
  public getUsers: User[] = [];
  public version: string = '';

  // estas variables nos permite saber cuantos registros tenemos en offline
  public cantidadRestanteOffline : CantidadRestante= new CantidadRestante();

  // Refresh
  public isRefreshingData : boolean = false;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private aSideService: ASideService,
    private languageService: LanguageService,
    private authService: AuthService,
    readonly onlineOfflineService: OnlineOfflineService,
    private databaseService: DatabaseService,
    private notificationsService: NotificationsService,
    private _loadingService: LoadingService,
  ) {
    console.log('ApplicationComponent constructor()');

    // Subscribe receives the value. sirve para recibir algun emit
    this.onlineOfflineService.emitterIsOnline.subscribe(
      (isOnline: boolean) => {
        console.log('this.onlineOfflineService.changeOnline.subscribe()');

        this.isOnline = isOnline;

      }
    );


    this.databaseService.emitterCantOffline.subscribe(
      (cantidadRestanteOffline:CantidadRestante) => {
        console.log('this.databaseService.emitterCantOffline.subscribe()');
        
        this.cantidadRestanteOffline = cantidadRestanteOffline;
      }
    )

    

  }


  // Al iniciar este componente se ejecuta lo siguiente.
  ngOnInit(): void {
    console.log('ngOnInit() application');

    this.version = EnvConfig.VERSION;
    // Obtenemos los datos de la session.
    this.loggedUser = this.authService.GetLoggedUser();
    // Obtenemos el estado en linea
    this.isOnline = this.onlineOfflineService.GetStatusOnline();

    // Configuracion de stylos por jqery
    this.ConfigStyleFromJquery();
    
    this.databaseService.EmitterCantOffline();
  }

  // OnAsideLoaded => Funcion que inicializa la funcion aside
  public OnAsideLoaded(aside: ASideComponent): void {
    console.log('OnAsideLoaded(aside: ASideComponent):');

    // Cuando se carga el formulario modal, capturo la referencia y se la envio al servicio
    this.aSideService.Initialize(aside);

    // Obtenemos el router.
    this.GetRoutelNavLink();
  }

  // OnNavLinkOpenClose => Abrimos o cerramos el componente NAV
  public OnNavLinkOpenClose(type: string): boolean {
    console.log('OnNavLinkOpenClose(type: string)');

    this.aSideService.OpenClose(type);
    return false;
  }

  // Funcion para cerrar la session de usuario.
  public async ClickLogout() {
    
    this._loadingService.Open();

    let datosRestanteSync:CantidadRestante = {};
    await Promise.resolve(true).then(
      result => {
        return this.databaseService.Sync();
      }
    ).then(
       result => {
        
         if(!result) throw 'ERROR SYNC SERVER'; 
         
         return this.databaseService.EmitterReloadData();
        }
      ).then(
         result => {

          if(!result){
            throw 'ERROR EMITTER RELOAD DATA. (Contact support)'
          }

          return this.databaseService.ConsultarCuantosInsertFaltanAgregaroActualizaroEliminarEnElServidor();
       }
    ).then(
      (datosFaltantes:CantidadRestante) => {
        // deben de ser 0 todos para que entre esta funcion
        if(!datosFaltantes.voyage && !datosFaltantes.port && !datosFaltantes.report ){
          datosRestanteSync = datosFaltantes;
          return this.authService.Logout();
        }
        else {
          
          return false
        }
      }
    ).then(
      result => {
        if(result){ 

        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      
      } else { 
        this.loggedUser = this.authService.GetLoggedUser(); 
        this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'CANNOT_CLOSE_PENDING_REPORTS'));
      }
      this._loadingService.Close();
      }
    ).catch(
      err => {
        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, err);

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this._loadingService.Close();
      }
    );
  }

  // Cuando le damos click a este boton intenta refrescarse la cpnexion
  public async ClickSyncDataLocal(){
    if(this.isOnline){
      
      this.isRefreshingData = true;
      this._loadingService.Open();
      await Promise.resolve(true).then(
        result => {
          return this.databaseService.Sync();
          
        }
      ).then(
        result => {
          this._loadingService.Close();
          return this.databaseService.EmitterReloadData();
         }
       ).then(
          result => {
 
           if(!result){
             throw 'ERROR EMITTER RELOAD DATA. (Contact support)'
           }
 
          this.isRefreshingData = false;
          return this.databaseService.EmitterCantOffline();

        }
      ).catch(
        err => {
          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, err);
  
          console.error(msg);
          console.dir(err);
  
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR_UPDATE_INDEXEDDB_IN_ONLINE'), msg);
            
          this.isRefreshingData = false;
          // Deshabilito el spinner de loading
          this._loadingService.Close();
        }
      );
    } else {
      
      this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR_UPDATE_INDEXEDDB_IN_ONLINE'), '');
       
    }
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

  // ConfigStyleFromJquery() => Configuracion de estilos mediante JQUERY.
  private ConfigStyleFromJquery() {

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

  // Funciones para cargar combos //
  //////////////////////////////////

}
