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
import { DetecteInactiveUserService } from '../services/detecte-inactive-user.service';
import { SpeedAnalysisService } from '../services/speed-analysis.service';
import { GetReportVoyagePortDaily } from '../models/dialog-export-excel';
import { Port } from '../models/port';
import { Voyage } from '../models/voyage';
import { DailyReport } from '../models/daily-report';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  // Usuario logeado.
  public loggedUser: User = <any>{};

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'application';

  // esta variable ayuda a saber si la aplicacion se encuantra en linea.
  public isOnline: boolean = false;
  public getUsers: User[] = [];
  public version: string = '';

  // estas variables nos permite saber cuantos registros tenemos en offline
  public cantidadRestanteOffline: CantidadRestante = new CantidadRestante();

  // Refresh
  public isRefreshingData: boolean = false;


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
    private _DetecteInactiveUserService: DetecteInactiveUserService,
    private _SpeedAnalysisService: SpeedAnalysisService
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
      (cantidadRestanteOffline: CantidadRestante) => {
        console.log('this.databaseService.emitterCantOffline.subscribe()');

        this.cantidadRestanteOffline = cantidadRestanteOffline;
      }
    )



  }


  // Este componente solo se ejecuta 1 vez ya que es un compoenente padre.
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

    // INICIAMOS EL DETECTOR DE INACTIVIDAD.
    // this._DetecteInactiveUserService.Initialize();
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

    let datosRestanteSync: CantidadRestante = {};
    await Promise.resolve(true).then(
      result => {
        return this.databaseService.Sync();
      }
    ).then(
      result => {

        if (!result) throw 'ERROR SYNC SERVER';

        return this.databaseService.EmitterReloadData();
      }
    ).then(
      result => {

        if (!result) {
          throw 'ERROR EMITTER RELOAD DATA. (Contact support)'
        }

        return this.databaseService.ConsultarCuantosInsertFaltanAgregaroActualizaroEliminarEnElServidor();
      }
    ).then(
      (datosFaltantes: CantidadRestante) => {
        // deben de ser 0 todos para que entre esta funcion
        if (!datosFaltantes.voyage && !datosFaltantes.port && !datosFaltantes.report) {
          datosRestanteSync = datosFaltantes;
          return this.authService.Logout();
        }
        else {

          return false
        }
      }
    ).then(
      result => {
        if (result) {

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

  public async ClickOpenListOfConnectedUsers() {
    await Promise.resolve(true).then(
      result => {
        this.OnSelectNavLink("list-of-connected-users");

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
  public async ClickSyncDataLocal() {
    if (this.isOnline) {

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

          if (!result) {
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

  public async ClickDownloadLocalData(): Promise<boolean> {

    let listVoyagePortDaily: GetReportVoyagePortDaily[] = [];



    // Aqui estaran los datos solo los que falten registra.
    let listVoyage: Voyage[] = [];
    let listPort: Port[] = [];
    let listDailyReport: DailyReport[] = [];

    this._loadingService.Open();

    // Obtenemos los viajes que faltan agregar.
    return await Promise.resolve(true).then(
      result => {
        // Obtenemos los viajes locales.
        return this.databaseService.getVoyagesIndexDB();
      }
    ).then(
      resultVoyages => {
        if (!resultVoyages) throw 'ERROR';

        // Filtramos los viajes que no estan en el server.
        listVoyage = resultVoyages.filter(voyage => voyage.syncStatus == 'added' || voyage.syncStatus == 'updated' || voyage.syncStatus == 'deleted');
        return this.databaseService.getPortsIndexDB();
      }
    ).then(
      resultPorts => {
        if (!resultPorts) throw 'ERROR';
        // Filtramos los viajes que no estan en el server.
        listPort = resultPorts.filter(port => port.syncStatus == 'added' || port.syncStatus == 'updated' || port.syncStatus == 'deleted');
        return this.databaseService.getReportDailysIndexDB();
      }
    ).then(
      resultDailyReport => {
        if (!resultDailyReport) throw 'ERROR';
        listDailyReport = resultDailyReport.filter(voyage => voyage.syncStatus == 'added' || voyage.syncStatus == 'updated' || voyage.syncStatus == 'deleted');

        if (!listDailyReport.length) {
          this.notificationsService.alert(this.languageService.GetMessage(this.translateCategory, 'DATOS_SINCRONIZADOS'), this.languageService.GetMessage(this.translateCategory, 'NO_DATA_LOCAL_EXCEL'));
          return true;
        }

        // Recorremos la lista de los reportes diarios.
        listDailyReport.forEach(
          (dailyReport: DailyReport) => {

            let objReportVoyagePortDaily = new GetReportVoyagePortDaily();

            objReportVoyagePortDaily.userId = dailyReport.userId;

            // DATOS NETAMENTE DEL DAILY REPORT.
            objReportVoyagePortDaily.dailyReportId = dailyReport.id;
            objReportVoyagePortDaily.activityPerformed = dailyReport.activityPerformed;
            objReportVoyagePortDaily.speedStraction = dailyReport.speedStraction;
            objReportVoyagePortDaily.date = dailyReport.date;
            objReportVoyagePortDaily.hour = dailyReport.hour;
            objReportVoyagePortDaily.bunkeringIfo = dailyReport.bunkeringIfo;
            objReportVoyagePortDaily.bunkeringMgo = dailyReport.bunkeringMgo;
            // Consumo IFO
            objReportVoyagePortDaily.mplaIfo = dailyReport.mplaIfo;
            objReportVoyagePortDaily.auxIfo = dailyReport.auxIfo;
            objReportVoyagePortDaily.boilerIfo = dailyReport.boilerIfo;
            objReportVoyagePortDaily.otherIfo = dailyReport.otherIfo;
            // Consumo MGO
            objReportVoyagePortDaily.mplaMgo = dailyReport.mplaMgo;
            objReportVoyagePortDaily.auxMgo = dailyReport.auxMgo;
            objReportVoyagePortDaily.boilerMgo = dailyReport.boilerMgo;
            objReportVoyagePortDaily.ppMgo = dailyReport.ppMgo;
            objReportVoyagePortDaily.giMgo = dailyReport.giMgo;
            objReportVoyagePortDaily.otherMgo = dailyReport.otherMgo;

            // DISTANCIA Y TIEMPO Viento Observaciones
            objReportVoyagePortDaily.steamingTime = dailyReport.steamingTime;
            objReportVoyagePortDaily.distance = dailyReport.distance;
            objReportVoyagePortDaily.beaufour = dailyReport.beaufour;
            objReportVoyagePortDaily.observation = dailyReport.observation;

            // Audiotoria
            objReportVoyagePortDaily.syncStatusDaily = dailyReport.syncStatus;
            objReportVoyagePortDaily.statusDaily = dailyReport.status;


            // Buscamos el puerto y solo si esta en offline lo agregamos.
            objReportVoyagePortDaily.portId = dailyReport.portId;
            let buscarPortById = listPort.find(port => port.id == objReportVoyagePortDaily.portId);
            if (buscarPortById) {
              objReportVoyagePortDaily.voyageId = buscarPortById.voyageId;
              objReportVoyagePortDaily.portNumber = buscarPortById.portNumber;
              objReportVoyagePortDaily.departurePort = buscarPortById.departurePort;
              objReportVoyagePortDaily.arrivalPort = buscarPortById.arrivalPort;
              // Audiotoria
              objReportVoyagePortDaily.statusPort = buscarPortById.status;
              objReportVoyagePortDaily.syncStatusPort = buscarPortById.syncStatus;


              // Buscamos el viaje y solo si esta en offline lo agregamos.
              objReportVoyagePortDaily.voyageId = buscarPortById.voyageId;
              let buscarVoyageById = listVoyage.find(voyage => voyage.id == objReportVoyagePortDaily.voyageId);
              if (buscarVoyageById) {
                // Lugar de partida,
                objReportVoyagePortDaily.voyageNumber = buscarVoyageById.voyageNumber;
                // Lugar de llegada.
                objReportVoyagePortDaily.year = buscarVoyageById.year;
                // Audiotoria
                objReportVoyagePortDaily.statusVoyage = buscarVoyageById.status;
                objReportVoyagePortDaily.syncStatusVoyage = buscarVoyageById.syncStatus;
              }

            }

            // Agregamos a la lista del arreglo.
            listVoyagePortDaily.push(objReportVoyagePortDaily);
          }
        );

        // Descargamos los datos locales.
        return this._SpeedAnalysisService.DowloadExcelDataLocal(this.loggedUser.name, listVoyagePortDaily);
      }
    ).then(
      result => {
        if (!result) throw 'ERROR';

        this._loadingService.Close();

        return true;
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
        return false;
      }
    );
  }


  public GetRoutelNavLink() {
    console.log('GetRoutelNavLink()');

    let router: string = this.router.url;
    let navLink: string = '';


    switch (router) {

      case '/application/dashboard':
        navLink = 'dashboard';
        break;
      case '/application/dashboard/general_analysis':
        navLink = 'general_analysis';
        break;
      case '/application/dashboard/speed_analysis':
        navLink = 'speed_analysis';
        break;
      case '/application/dashboard/consumer_analysis':
        navLink = 'consumer_analysis';
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
      case 'overview':
        this.router.navigate(['../application/dashboard/' + navLink], { relativeTo: this.activatedRoute });
        break;
      //Modulo de dashboard
      case 'general_analysis':
        this.router.navigate(['../application/dashboard/' + navLink], { relativeTo: this.activatedRoute });
        break;
      //Modulo de dashboard
      case 'consumer_analysis':
        this.router.navigate(['../application/dashboard/' + navLink], { relativeTo: this.activatedRoute });
        break;
      case 'speed_analysis':
        this.router.navigate(['../application/dashboard/' + navLink], { relativeTo: this.activatedRoute });
        break;
      // Fin dashboard

      case 'users':
        this.router.navigate(['../application/' + navLink], { relativeTo: this.activatedRoute });
        break;

      case 'voyages':
        this.router.navigate(['../application/' + navLink], { relativeTo: this.activatedRoute });
        break;

      case 'helps':
        this.router.navigate(['../application/' + navLink], { relativeTo: this.activatedRoute });
        break;

      case 'list-of-connected-users':
        this.router.navigate(['../application/users/who-are-connected'], { relativeTo: this.activatedRoute });
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
