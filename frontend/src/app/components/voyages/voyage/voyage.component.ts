import { Component, OnInit } from '@angular/core';

//Modelos
import { AzList, azListDropdown, SettingAzList } from '../../../models/azlist';
import { User } from '../../../models/user';

// ============== COMUNES ==============
// Components Shared
import { AzListComponent } from "../../../shared/crud/az-list/az-list.component";
import { LoadingService } from '../../../services/loading.service';
import { LanguageService } from '../../../services/language.service';
import { ASideService } from '../../../services/a-side.service'
// Service
import { UserService } from '../../../services/user.service';
import { VoyageService } from '../../../services/voyage.service';

// Components Shared
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

// Librerias
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import { DatabaseService } from '../../../services/database.service';
import { Voyage } from '../../../models/voyage';
import { ConvertirDateHourToMoment2, ConvertMMDDYYYYHHmmToMomment, ConvertMoment, ConvertMomentUTC, FormatDateUTCToDateHour, GetDate, getYear, stringToDate, validateDate } from '../../../../assets/moment/moment.assets';
import { mathRound } from '../../../../assets/math/math.assets';
import { DialogData, DialogDeleteComponent } from '../../../shared/dialog/delete/dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Port } from '../../../models/port';
import { PortService } from '../../../services/port.service';
import { DailyReport } from '../../../models/daily-report';
import { DailyReportService } from '../../../services/daily-report.service';
import { OnlineOfflineService } from '../../../services/online-offline.service';
import { ConvertirDateHourToMoment, DiferentHourTwoMoment, FormatYYYYMMDD, FormatYYYYMMDDToSTRING } from '../../../../assets/moment/moment.assets';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-voyage',
  templateUrl: './voyage.component.html',
  styleUrls: ['./voyage.component.scss']
})
export class VoyageComponent implements OnInit {

  public year: number = 0;

  // rol del usuario.
  public roleUser: string = '';

  //======== VARIABLES DE TRADUCCION=============
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'voyage';
  //=================[ FIN ]=====================


  //======== Datos para el componente azList ===========
  public SettingAzList: SettingAzList = new SettingAzList();
  public azLists: AzList[] = [];
  public azListDropdowns: azListDropdown[] = [];

  // Data
  // Usuario seleccionado
  public selectUserDropdown: number = 0;
  public selectUser: User = new User();
  // Lista de los datos del usuario
  public getUsers: User[] = [];

  // Lista y seleccion de viajes.
  public selectVoyage: Voyage = new Voyage();
  public getVoyages: Voyage[] = [];

  // Lista del puerto y seleccion
  public initialPort: Port = new Port();
  public selectPort: Port = new Port();
  public getPorts: Port[] = [];

  //
  public initialDailyReport: DailyReport = new DailyReport();
  public selectDailyReport: DailyReport = new DailyReport();
  public getDailyReports: DailyReport[] = [];

  // Texto de la cabecera del body
  public title_header_media: string = '';
  public sub_title_header_media: string = '';


  // Esta variable servira para identificar si estamos en
  // Voyage, Port, DailyReport
  public List_Voyages_Ports_DailyReports = 'Voyages';
  public toolTipSave = '';
  public toolTipDiscard = '';
  public toolTipEnableForm = '';

  // Esta variable permite habilita la edicion en el formulario.
  public disableEdit: boolean = true;

  public isBunkering: boolean = false;

  public lastRecordedHour: any;


  myControlFormSelectBefourt = new FormControl();
  optionsBefourt: string[] = [
    '1', '2', '3', '4', '5', '6',
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6',
    'NE1', 'NE2', 'NE3', 'NE4', 'NE5', 'NE6',
    'E1', 'E2', 'E3', 'E4', 'E5', 'E6',
    'SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6',
    'SW1', 'SW2', 'SW3', 'SW4', 'SW5', 'SW6',
    'W1', 'W2', 'W3', 'W4', 'W5', 'W6',
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6'];
  filteredOptionsSelectBefourt: Observable<string[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private userService: UserService,
    private voyageService: VoyageService,
    private portService: PortService,
    private dailyReportService: DailyReportService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private aSideService: ASideService,
    private onlineOfflineService: OnlineOfflineService,
    public dialog: MatDialog,
  ) {


    // Si se recibe algun cambio de conexion, se resetea el formulario.
    this.databaseService.emitterReloadData.subscribe(
      (isOnline: boolean) => {

        // Cargamos los datos locales.
        this.loadDataIndexedDBByUserId(this.selectUser.id);


        this.List_Voyages_Ports_DailyReports = 'Voyages';
        this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage ' + this.year];
        this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'VOYAGES_LIST');
        this.SettingAzList.isNew = true;
        this.SettingAzList.isBack = false;
        this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_VOYAGE');
        this.SettingAzList.toolTipBack = ''
        this.SettingAzList.toolTipOptionDelete = this.languageService.GetMessage(this.translateCategory, 'TOOLTIP_DELETE_VOYAGE');
        this.SettingAzList.activateSelectItemEmit2 = true;
        this.selectPort = new Port();
        this.title_header_media = '';
        this.sub_title_header_media = '';

      }
    );


  }

  ngOnInit(): void {


    this.filteredOptionsSelectBefourt = this.myControlFormSelectBefourt.valueChanges.pipe(
      startWith(''),
      map(value => this.FilterInputBefourt(value)),
    );

    console.log('ngOnInit()');

    // Activamos el loading.
    this.loadingService.Open();
    // si el aSide esta abierto lo cerramos.
    this.aSideService.Close();

    // Obtenemos el rol del usuario.
    this.roleUser = this.userService.GetIdentity().role;

    // Configuracion AzList
    this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage'];
    this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'VOYAGES_LIST');
    this.SettingAzList.isBack = false;
    this.SettingAzList.toolTipBack = ''
    this.SettingAzList.activateDropDown = this.roleUser === 'ADMIN' || this.roleUser === 'SUPPORT' ? true : false;
    this.SettingAzList.placeholderDropdown = this.languageService.GetMessage(this.translateCategory, (this.roleUser === 'ADMIN' || this.roleUser === 'SUPPORT' ? 'SELECT_BUQUE' : ''));
    this.SettingAzList.activateOptionDelete = true;
    this.SettingAzList.toolTipOptionDelete = this.languageService.GetMessage(this.translateCategory, 'TOOLTIP_DELETE_VOYAGE');
    // Activamos el 2° selectItem
    this.SettingAzList.activateSelectItemEmit2 = true;
    this.SettingAzList.toolTipSelectItemEmit2 = this.languageService.GetMessage(this.translateCategory, 'ADD_PORT');
    this.SettingAzList.iconSelectItemEmit2 = 'icon-port';
    // Activamos el 3° selectItem
    this.SettingAzList.activateSelectItemEmit3 = true;
    this.SettingAzList.toolTipSelectItemEmit3 = this.languageService.GetMessage(this.translateCategory, 'ADD_REPORT');
    this.SettingAzList.iconSelectItemEmit3 = 'icon-clipboard';


    setTimeout(() => {
      // PerfectScroll a body
      new PerfectScrollbar('.az-contact-info-body', {
        suppressScrollX: true
      });

    }, 500)




    Promise.resolve(true).then(
      result => {
        // Obtenemos todos los usuarios que estan en la bd.
        return this.databaseService.getUsersIndexDB();
      }
    ).then(
      resultUsers => {

        // En la carga de data indexedDB cargo solo los buque.
        this.getUsers = resultUsers.filter(
          (user: User) => {
            return user.role === 'BUQUE';
          }
        );

        // Seleccionamos al usuario que esta logeado.
        let userLoggin = this.userService.GetIdentity();

        // Si el usuario logeado no es un buque
        if (userLoggin.role === 'BUQUE') {
          return userLoggin.id;
        } else {
          return this.databaseService.CheckWhatUserWeHaveInLocal();
        }
      }
    ).then(
      resultUserId => {
        // Si retorna un id lo buscamos en local
        if (resultUserId) {
          // Cargamos los datos del userId
          this.loadDataIndexedDBByUserId(resultUserId);
        } else {
          // si no buscamos el primer userId con rol buque y lo buscamos.
          let firstUser = this.getUsers.find(user => user.role === 'BUQUE');
          return this.ClickSelectUser(firstUser.id);
        }

      }
    ).then(
      resultLoad => {

        return true;


      }).catch(
        err => {
          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, err || 'ERROR_ON_LOAD'));

          console.error(msg);
          console.dir(err);

          // this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });





  }

  // ==============  Funciones  AZLIST ====================
  public SelectItemAzList(event: AzList): void {
    console.log('SelectItemAzList(event: AzList)');

    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {

      this.SelectVoyagebyVoyageId(event.id);

    } else if (this.List_Voyages_Ports_DailyReports === 'Ports' || this.List_Voyages_Ports_DailyReports === 'DailyReports') {
      // A lista se vuelve puertos
      //this.List_Voyages_Ports_DailyReports = 'DailyReports';
      this.SelectPortByPortId(event.id);
      this.aSideService.OpenClose('open-formulario');
    }
  }

  public async SelectVoyagebyVoyageId(voyageId: number): Promise<boolean> {
    console.log('SelectVoyagebyVoyageId(voyageId: number)');


    this.toolTipSave = 'SAVE_PORT';
    this.toolTipDiscard = 'DISCARD_PORT';
    this.toolTipEnableForm = 'ENABLE_FORM';

    // A lista se vuelve puertos
    this.List_Voyages_Ports_DailyReports = 'Ports';

    return await Promise.resolve(true).then(
      result => {

        // Seleccionamos al viaje.
        this.selectVoyage = this.getVoyages.find(
          (voyage: Voyage) => {
            return Number(voyage.id) === Number(voyageId)
          }
        );

        this.title_header_media = 'Voyage ' + this.selectVoyage.year + '  N°' + this.selectVoyage.voyageNumber;
        this.sub_title_header_media = '';

        return this.databaseService.getPortsByVoyageIndexDB(this.selectVoyage.id);
      }
    ).then(
      resultPorts => {

        if (!resultPorts) throw 'NO_FOUND_PORTS';

        this.getPorts = resultPorts;
        this.getDailyReports = [];

        this.generateAzListByPorts(this.getPorts);

        this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage ' + this.year, 'Port'];
        this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'PORT_REGISTER');
        this.SettingAzList.isNew = true;
        this.SettingAzList.isBack = true;
        this.SettingAzList.toolTipOptionDelete = this.languageService.GetMessage(this.translateCategory, 'TOOLTIP_DELETE_PORT');
        this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_PORT');
        this.SettingAzList.toolTipBack = this.languageService.GetMessage(this.translateCategory, 'BACK_LIST_VOYAGE');
        this.SettingAzList.activateSelectItemEmit2 = false;

        return true;
      }
    ).catch(
      err => {
        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD'));

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this.loadingService.Close();
        return false;
      }
    );
  }

  public async SelectPortByPortId(portId: number): Promise<boolean> {
    console.log('SelectPortByPortId(portId: number)');


    this.toolTipSave = 'SAVE_PORT';
    this.toolTipDiscard = 'DISCARD_PORT';
    this.toolTipEnableForm = 'ENABLE_FORM';

    this.List_Voyages_Ports_DailyReports = 'Ports';

    return await Promise.resolve(true).then(
      result => {
        // Seleccionamos al viaje.
        this.selectPort = this.getPorts.find(
          (port: Port) => {
            return Number(port.id) === Number(portId)
          }
        );
        this.selectPort = JSON.parse(JSON.stringify(this.selectPort));

        this.sub_title_header_media = 'Port N°' + this.selectPort.portNumber + ' (' + this.selectPort.departurePort + ' - ' + this.selectPort.arrivalPort + ')';

        return true;
      }
    ).then(
      result => {
        // no validamos el resultado por que siempre es true.

        return this.databaseService.getReportDailysByPortIdIndexDB(this.selectPort.id);
      }
    ).then(
      dailyReports => {
        this.getDailyReports = dailyReports;


        // AQui debe de restar la hora.
        this.Initialize();

        return true;
      }
    ).catch(
      err => {
        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD'));

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this.loadingService.Close();
        return false;
      }
    );


  }

  public ClickSelectUser(userId: number): void {
    console.log('ClickSelectUser(event: AzList)');
    console.log(userId);
    userId = Number(userId);

    this.loadingService.Open();

    // Al seleccionar un usuario se actualiza el lcombo select usetr.
    this.selectUser = this.getUsers.find(user => user.id === userId);

    // SI existe un arreglo de años lo seleccionamos.
    if (this.selectUser.years && this.selectUser.years.length) {
      this.year = this.selectUser.years[(this.selectUser.years.length || 1) - 1]
    } else {
      this.year = 0;
    }

    this.List_Voyages_Ports_DailyReports = 'Voyages';
    this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage ' + this.year];
    this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'VOYAGES_LIST');
    this.SettingAzList.isNew = true;
    this.SettingAzList.isBack = false;
    this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_VOYAGE');
    this.SettingAzList.toolTipBack = ''
    this.SettingAzList.toolTipOptionDelete = this.languageService.GetMessage(this.translateCategory, 'TOOLTIP_DELETE_VOYAGE');
    this.SettingAzList.activateSelectItemEmit2 = true;
    this.selectPort = new Port();
    this.title_header_media = '';
    this.sub_title_header_media = '';

    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (this.onlineOfflineService.GetStatusOnline()) {

      Promise.resolve(true).then(
        () => {
          // Syncronizamos los datos que falten sincronizar.
          return this.databaseService.Sync();
        }
      ).then(
        (result: boolean) => {
          // Reportamos un error si no es el esperado.
          if (!result) throw 'ERROR_SYNC_INDEXEDDB_IN_ONLINE';

          return this.databaseService.getUserIndexDB(userId);
        }
      ).then(
        (resultUser: User) => {

          if (!resultUser) throw 'ERROR_GET_USER_NO_FOUND';

          this.selectUser = resultUser;
          // Agregamos el usuario para el filtro de viaje.
          let voyage = new Voyage();
          voyage.userId = Number(this.selectUser.id);
          this.SettingAzList.isNew = this.selectUser.role === 'BUQUE' ? true : false;
          voyage.year = this.year
          this.loadingService.Open();
          // Obtenemos los datos del usuario.
          return this.GetVoyagesDetail(voyage).pipe().toPromise();
        }
      ).then(
        (result: boolean) => {
          // Revizamos que los viajes sean los esperados.
          if (!result) throw 'ERROR_GET_VOYAGES';

          // Reseteamos los datos de la tabla viaje.
          return this.databaseService.ClearVoyagesIndexedDB();
        }
      ).then(
        (result: boolean) => {
          // Revizamos que los viajes sean los esperados.
          if (!result) throw Error('Error limpiar la data Voyages.');

          // Reseteamos los datos de la tabla viaje.
          return this.databaseService.ClearPortsIndexedDB();
        }
      ).then(
        (result: boolean) => {
          // Revizamos que los viajes sean los esperados.
          if (!result) throw Error('Error limpiar la data Port.');

          // Reseteamos los datos de la tabla viaje.
          return this.databaseService.ClearDailyReportsIndexedDB();
        }
      ).then(
        (result: boolean) => {
          if (!result) throw Error('Error limpiar la data Voyages.');

          // Agregamos los viajes al IndexedDB
          return this.databaseService.addVoyagesIndexedDB(this.getVoyages);
        }
      ).then(
        (result: boolean) => {
          if (!result) throw Error('Error limpiar la data Voyages.');

          return true;
        }
      ).then(
        () => {
          // Cargo la data en locla
          this.loadDataIndexedDBByUserId(this.selectUser.id);
          this.loadingService.Close();
        }
      ).catch(
        err => {
          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD'));

          console.error(msg);
          console.dir(err);

          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );
    } else {

      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'NEED_CONNECTION'));

      Promise.resolve(true).then(
        () => {
          // Obtenemos los viajes de IndexDB
          return this.databaseService.getVoyagesByUserIdIndexDB(userId);
        }
      ).then(
        (voyages: Voyage[]) => {

          // Los viajes pueden llegar vacio. solo si es array[] seria true.
          if (voyages) {

            this.getVoyages = voyages;
            // Generar lista por usuarios.
            this.generateAzListByVoyages(this.getVoyages);

            return true;
          } else {
            throw this.languageService.GetMessage(this.translateCategory, 'ERROR_GET_USERS_INDEXEDDB');
          }
        }
      ).then(
        (result: boolean) => {

          // Inicializo el SailingAnality
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      ).catch(
        err => {
          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, err);

          console.error(msg);
          console.dir(err);

          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );
    }

  }

  public ClickNew() {
    console.log('ClickNew(event: AzList)');

    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {
      let newVoyage = new Voyage();

      newVoyage.userId = this.selectUser.id;
      if (this.getVoyages && this.getVoyages.length > 0) { newVoyage.voyageNumber = this.getVoyages[0].voyageNumber + 1; }
      else { newVoyage.voyageNumber = 1; };
      newVoyage.year = this.year;
      newVoyage.status = true;


      this.CreateVoyageOnlineOffline(newVoyage);
    } else if (this.List_Voyages_Ports_DailyReports === 'Ports' || this.List_Voyages_Ports_DailyReports === 'DailyReports') {

      this.NewPort();
      this.getDailyReports = [];
      this.aSideService.OpenClose('open-formulario');

    }

    return false;
  }

  public NewPort(): void {

    this.List_Voyages_Ports_DailyReports = 'Ports';
    // habilitamos el puerto actual para registrar uno nuevo.
    this.selectPort = new Port();

    this.Initialize();
    this.disableEdit = false;

    let newPort = new Port();

    if (this.getPorts && this.getPorts.length > 0) {
      newPort.portNumber = this.getPorts[0].portNumber + 1;
    }
    else { newPort.portNumber = 1; };

    this.sub_title_header_media = 'Port N°' + newPort.portNumber;

  }

  public ClickDelete(event: AzList) {
    console.log('ClickDelete(event: AzList)');

    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {

      this.ClickDeleteVoyage(event);
    } else if (this.List_Voyages_Ports_DailyReports === 'Ports') {

      this.ClickDeletePort(event);
    }

  }

  // ESTE CLICK SAVE SE USAN EN PORT; VOYAGE: DAILY
  public ClickSave() {
    console.log('ClickSave()');

    if (this.List_Voyages_Ports_DailyReports === 'Ports') {


      if (!this.selectPort.id) {
        let newPort = new Port();

        newPort.userId = this.selectUser.id;
        if (this.getPorts && this.getPorts.length > 0) { newPort.portNumber = this.getPorts[0].portNumber + 1; }
        else { newPort.portNumber = 1; };
        newPort.voyageId = this.selectVoyage.id;
        newPort.departurePort = this.selectPort.departurePort;
        newPort.arrivalPort = this.selectPort.arrivalPort;
        newPort.status = true;

        this.CreatePortOnlineOffline(newPort);

      } else {
        let portToSave = this.selectPort;
        delete portToSave.dailyReports;
        this.UpdatePortOnelineOffline(portToSave)

      }

    } else if (this.List_Voyages_Ports_DailyReports === 'DailyReports') {


      this.selectDailyReport.beaufour = this.myControlFormSelectBefourt.value;

      if (!this.selectDailyReport.id) {

        let newDailyReport = this.selectDailyReport;
        newDailyReport.userId = this.selectUser.id;
        newDailyReport.portId = this.selectPort.id;


        // Le agregamos la hora a la fecha.
        newDailyReport.status = true;

        this.CreateDailyReportOnlineOffline(newDailyReport);

      } else {
        let dailyReportToSave = this.selectDailyReport;
        // Le agregamos la hora a la fecha.

        this.UpdateDailyReportOnelineOffline(dailyReportToSave);

      }

    }

    return false;
  }

  public ClickDiscard() {
    console.log('ClickDiscard()');

    // Valido si algun elemento se cambio
    if (this.Modified()) {


      let dialogData: DialogData = {
        color: "warning",
        icon: "icon-warning",
        title: this.languageService.GetMessage(this.translateCategory, 'COMFIMR_DISCARD_CHANGES'),
        mensage: this.languageService.GetMessage(this.translateCategory, 'COMFIRM_DISCARD_DESCRIPTION'),
      };

      const dialogRef = this.dialog.open(DialogDeleteComponent, {
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(
        (result: Boolean) => {

          if (result) {

            if (this.List_Voyages_Ports_DailyReports === 'Ports') {
              this.selectPort = this.selectPort.id ? this.initialPort : new Port();
            } else if (this.List_Voyages_Ports_DailyReports === 'DailyReports') {
              this.selectDailyReport = this.selectDailyReport.id ? this.initialDailyReport : new DailyReport();
              this.lastRecordedHour = null;
              this.List_Voyages_Ports_DailyReports = 'Ports';
            }

            this.toolTipSave = 'SAVE_PORT';
            this.toolTipDiscard = 'DISCARD_PORT';
            this.toolTipEnableForm = 'ENABLE_FORM';

            this.Initialize();
          } else {

          }
        });

    } else {

      if (this.List_Voyages_Ports_DailyReports === 'Ports') {
        this.selectPort = this.selectPort.id ? this.initialPort : new Port();
      } else if (this.List_Voyages_Ports_DailyReports === 'DailyReports') {
        this.selectDailyReport = this.selectDailyReport.id ? this.initialDailyReport : new DailyReport();
        this.List_Voyages_Ports_DailyReports = 'Ports';
      }

      // Inicializamos el user para que detecte la diferencia.

      this.Initialize();
    }
  }

  public ClickChangeEnableFrm(isActive?: boolean): boolean {
    console.log('ClickChangeEnableFrm()');

    if (isActive) {
      this.disableEdit = false;
    } else if (isActive === false) {
      this.disableEdit = true;
    } else {
      this.disableEdit = !this.disableEdit;
    }
    return false;
  }

  public ClickSelectBack() {
    console.log('ClickSelectBack()');
    if (this.List_Voyages_Ports_DailyReports === 'Ports' || this.List_Voyages_Ports_DailyReports === 'DailyReports') {
      // A lista se vuelve puertos
      this.List_Voyages_Ports_DailyReports = 'Voyages';

      this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage ' + this.year];
      this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'VOYAGES_LIST');
      this.SettingAzList.isNew = true;
      this.SettingAzList.isBack = false;
      this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_VOYAGE');
      this.SettingAzList.toolTipBack = ''
      this.SettingAzList.toolTipOptionDelete = this.languageService.GetMessage(this.translateCategory, 'TOOLTIP_DELETE_VOYAGE');
      this.SettingAzList.activateSelectItemEmit2 = true;

      this.selectPort = new Port();
      this.getDailyReports = [];

      this.title_header_media = '';
      this.sub_title_header_media = '';

      this.disableEdit = true;

      this.generateAzListByVoyages(this.getVoyages);
    }
  }

  public ClickAddPort(event: AzList) {
    console.log('ClickAddPort()');

    this.SelectVoyagebyVoyageId(event.id).then(
      result => {
        if (!result) throw new Error('ERROR SELECT VOYAGE');
        this.NewPort();

        return true;
      }
    );

    this.aSideService.OpenClose('open-formulario');

  }

  // Click a la opcion agregar nuevo reporte, icono dentro de la lista de viaje,
  public ClickAddReport(event: AzList) {
    console.log('ClickAddReport()');

    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {

      this.SelectVoyagebyVoyageId(event.id).then(
        result => {
          if (!result) throw new Error('ERROR SELECT VOYAGE');

          this.selectPort = this.getPorts[0];

          return this.databaseService.getReportDailysByPortIdIndexDB(this.selectPort.id);
        }
      ).then(
        dailyReports => {
          this.getDailyReports = dailyReports;

          this.sub_title_header_media = 'Port N°' + this.selectPort.portNumber + ' (' + this.selectPort.departurePort + ' - ' + this.selectPort.arrivalPort + ')';

          this.List_Voyages_Ports_DailyReports = 'DailyReports';

          this.toolTipSave = 'SAVE_REPORT';
          this.toolTipDiscard = 'DISCARD_REPORT';
          this.toolTipEnableForm = 'ENABLE_REPORT';

          this.selectDailyReport = new DailyReport();
          this.Initialize();

          this.disableEdit = false;
          this.isBunkering = false;

          return true;
        }

      );

    } else if (this.List_Voyages_Ports_DailyReports === 'Ports' || this.List_Voyages_Ports_DailyReports === 'DailyReports') {

      this.selectPort = this.getPorts[0];
      this.sub_title_header_media = 'Port N°' + this.selectPort.portNumber + ' (' + this.selectPort.departurePort + ' - ' + this.selectPort.arrivalPort + ')';
      this.List_Voyages_Ports_DailyReports = 'DailyReports';

      this.toolTipSave = 'SAVE_REPORT';
      this.toolTipDiscard = 'DISCARD_REPORT';
      this.toolTipEnableForm = 'ENABLE_REPORT';

      this.selectDailyReport = new DailyReport();

      this.Initialize();

      this.disableEdit = false;
      this.isBunkering = false;

    }

    this.aSideService.OpenClose('open-formulario');


  }

  public ClickAddNewReport() {
    console.log('ClickAddNewReport()');

    this.List_Voyages_Ports_DailyReports = 'DailyReports';

    this.toolTipSave = 'SAVE_REPORT';
    this.toolTipDiscard = 'DISCARD_REPORT';
    this.toolTipEnableForm = 'ENABLE_REPORT';

    this.selectDailyReport = new DailyReport();
    this.Initialize();
    this.disableEdit = false;
    this.isBunkering = false;
  }

  // Click al boton editar reporte.
  public ClickEditReport(dailyReport: DailyReport): boolean {
    console.log('ClickEditReport(dailyReport: DailyReport)');


    this.List_Voyages_Ports_DailyReports = 'DailyReports';
    let dailyReportFind = this.getDailyReports.find(report => Number(report.id) === Number(dailyReport.id));


    // Parseamos el obj para evirar cambios de valor de regerencia
    this.selectDailyReport = JSON.parse(JSON.stringify(dailyReportFind));

    // Le asignamos la hora lastRecort
    let convertMomentUTC = ConvertMomentUTC(dailyReportFind.date);
    let restarStemintime = convertMomentUTC.subtract(dailyReportFind.steamingTime, 'hours');

    this.lastRecordedHour = FormatDateUTCToDateHour(restarStemintime)

    this.Initialize();
    this.disableEdit = false;

    if (this.selectDailyReport.bunkeringIfo > 0 || this.selectDailyReport.bunkeringMgo > 0) {
      this.isBunkering = true;
    } else {
      this.isBunkering = false;
    }

    return false;
  }

  public ClickDeleteVoyage(event: AzList) {
    console.log('ClickDeleteVoyage(event: AzList)');


    // Buscamos el usuario que se desea eliminar.
    let voyageDelete: Voyage = this.getVoyages.find(
      (voyage: Voyage) => {
        return Number(voyage.id) === Number(event.id);
      }
    );

    let dialogData: DialogData = {
      color: "warning",
      icon: "icon-delete",
      title: this.languageService.GetMessage(
        this.translateCategory, 'COMFIMR_DELETE_TITLE_REPLACE').replace('[NAME]',
          'the Voyage ' + voyageDelete.year + ' N°' + voyageDelete.voyageNumber),
      mensage: this.languageService.GetMessage(this.translateCategory, 'COMFIRM_DELETE_DESCRIPTION'),
    };

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(
      (result: Boolean) => {

        if (result) {
          this.DeleteVoyageOnlineOffline(voyageDelete);
        }
      });
  }

  public ClickDeletePort(event: AzList) {
    console.log('ClickDeletePort(event: AzList)');


    // Buscamos el usuario que se desea eliminar.
    let portDelete: Port = this.getPorts.find(
      (port: Port) => {
        return Number(port.id) === Number(event.id);
      }
    );

    let dialogData: DialogData = {
      color: "warning",
      icon: "icon-delete",
      title: this.languageService.GetMessage(this.translateCategory, 'COMFIMR_DELETE_TITLE_REPLACE').replace('[NAME]', 'the Port N°' + portDelete.portNumber),
      mensage: this.languageService.GetMessage(this.translateCategory, 'COMFIRM_DELETE_DESCRIPTION'),
    };

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(
      (result: Boolean) => {

        if (result) {
          this.DeletePortOnlineOffline(portDelete);
        }
      });
  }

  public ClickDeleteReport(dailyReport: DailyReport): boolean {
    console.log('ClickDeletePort(event: AzList)');


    // Buscamos el usuario que se desea eliminar.
    let dailyReportDelete: DailyReport = this.getDailyReports.find(
      (report: DailyReport) => {
        return Number(report.id) === Number(dailyReport.id);
      }
    );

    let dialogData: DialogData = {
      color: "warning",
      icon: "icon-delete",
      title: this.languageService.GetMessage(this.translateCategory, 'COMFIMR_DELETE_TITLE_REPLACE').replace('[NAME]', 'the Report ' + FormatDateUTCToDateHour(dailyReportDelete.date)),
      mensage: this.languageService.GetMessage(this.translateCategory, 'COMFIRM_DELETE_DESCRIPTION'),
    };

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(
      (result: Boolean) => {

        if (result) {
          this.DeleteDailyReportOnlineOffline(dailyReportDelete);
        }
      });

    return false;
  }

  // Azlist
  private generateAzListDropdownsByUsers(users: User[]) {
    console.log('generateAzListDropdownsByUsers(users: User[])');

    // vaciamos el objeto
    this.azListDropdowns = [];

    // Armo un obj azList.
    users.forEach((user: User) => {
      this.azListDropdowns.push(
        new azListDropdown(user.id, user.name)
      );
    });

  }
  // Azlist
  private generateAzListByVoyages(voyages: Voyage[]) {
    console.log('generateAzListBycUsers(users: User[])');

    // vaciamos el objeto
    this.azLists = [];

    // Armo un obj azList.
    voyages.forEach((newVoyage: Voyage) => {
      this.azLists.push(
        new AzList(newVoyage.id, 'Voyage ' + newVoyage.year + ' N°' + newVoyage.voyageNumber, '', '', String(newVoyage.totalPort), String(newVoyage.totalReport))
      );
    });

  }

  // Azlist
  private generateAzListByPorts(ports: Port[]) {
    console.log('generateAzListByPorts(ports: Port[])');

    // vaciamos el objeto
    this.azLists = [];

    // Armo un obj azList.
    ports.forEach((azPort: Port) => {
      this.azLists.push(
        new AzList(azPort.id, 'Port N°' + azPort.portNumber, '(' + azPort.departurePort + ' - ' + azPort.arrivalPort + ')', '', '', String(azPort.totalReport))
      );
    });

  }

  // Local Data // Seleccionar usuario
  private loadDataIndexedDBByUserId(selectUserId: Number) {
    console.log('loadDataIndexedDB()');

    Promise.resolve(true).then(
      () => {
        // Obtenemos los datos del usuario.
        return this.databaseService.getUsersIndexDB();
      }
    ).then(
      (users: User[]) => {
        if (users.length > 0) {

          // Seleccionamos el usuario por Id
          this.selectUser = this.getUsers.find(user => user.id === selectUserId);
          this.selectUserDropdown = this.selectUser.id;
          let yearFromUser = this.selectUser.years;
          // Seleccionamos el año
          if (yearFromUser && yearFromUser.length) {
            this.year = yearFromUser[(yearFromUser.length || 1) - 1];
            this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage ' + this.year];
          }

          this.SettingAzList.isNew = true;
          this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_VOYAGE');
          // Generar lista por usuarios.
          this.generateAzListDropdownsByUsers(this.getUsers);

          return true;
        } else {
          throw this.languageService.GetMessage(this.translateCategory, 'ERROR_GET_USERS_INDEXEDDB');
        }
      }
    ).then(
      () => {
        // Obtenemos los viajes de IndexDB
        return this.databaseService.getVoyagesByUserIdIndexDB(this.selectUser.id);
      }
    ).then(
      (voyages: Voyage[]) => {

        // Los viajes pueden llegar vacio. solo si es array[] seria true.
        if (voyages) {

          this.getVoyages = voyages;
          // Generar lista por usuarios.
          this.generateAzListByVoyages(this.getVoyages);

          return true;
        } else {
          throw this.languageService.GetMessage(this.translateCategory, 'ERROR_GET_USERS_INDEXEDDB');
        }
      }
    ).then(
      (result: boolean) => {

        // Inicializo el SailingAnality
        this.Initialize();

        // Deshabilito el spinner de loading
        this.loadingService.Close();
      }
    ).catch(
      err => {
        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, err);

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this.loadingService.Close();
      }
    );

  }

  // Funciones para cargar Data //
  //////////////////////////////////

  // GetUsers: Cargo todos los Users para el listado de Users.
  private GetUsers(user: User): Observable<boolean> {
    console.log('GetUsers(user: User)');

    // Consulto la lista de paises para cargar combo
    return this.userService.GetUsers(user).pipe(map(
      (resultUser: User[]) => {

        // Guardamos el valor en nuestra variable global.
        this.getUsers = resultUser.reverse() || this.getUsers;

        // Segun el resultado retornamos la respuesta.
        return (resultUser !== null);
      }
    ));
  }

  private GetVoyagesDetail(voyage: Voyage): Observable<boolean> {
    console.log('GetVoyages(voyage: Voyage)');

    // Consulto la lista de paises para cargar combo
    return this.voyageService.GetsDetail(voyage).pipe(map(
      (resultVoyages: Voyage[]) => {

        // Guardamos el valor en nuestra variable global.
        this.getVoyages = resultVoyages.reverse() || this.getVoyages;

        // Segun el resultado retornamos la respuesta.
        return (resultVoyages !== null);
      }
    ));
  }

  private CreateVoyageOnlineOffline(newVoyage: Voyage) {

    // Verificamos si estamos en linea
    if (false) {

      this.voyageService.Create(newVoyage).subscribe(
        (resultCreate: Voyage) => {

          // Actualizamos el nuevo viaje con el resultado.
          newVoyage = resultCreate;
          newVoyage.totalPort = 0;
          newVoyage.totalReport = 0;

          // armamos el obj Azlist
          let azList = new AzList(newVoyage.id, 'Voyage ' + newVoyage.year + ' N°' + newVoyage.voyageNumber, '', '', String(newVoyage.totalPort), String(newVoyage.totalReport))

          // Se lo agregamos asus arreglos correspondientes.
          this.azLists.unshift(azList);
          this.getVoyages.unshift(newVoyage);
          this.databaseService.addVoyageIndexedDB(newVoyage);

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_VOYAGE_CREATE'));

          // Inicializamos los datos.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          return true;
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_VOYAGE_CREATE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    } else {

      // Le agregamos un stado Sync
      newVoyage.syncStatus = 'added';
      delete newVoyage.id;
      newVoyage.totalPort = 0;
      newVoyage.totalReport = 0;

      Promise.resolve(true).then(
        () => {
          // Agregamos el voyage al indexedDB.
          return this.databaseService.addVoyageIndexedDB(newVoyage);
        }
      ).then(
        (resultVoyageIndexedDB: Voyage) => {

          newVoyage = resultVoyageIndexedDB;

          // armamos el obj Azlist
          let azList = new AzList(newVoyage.id, 'Voyage ' + newVoyage.year + ' N°' + newVoyage.voyageNumber, '', '', String(newVoyage.totalPort), String(newVoyage.totalReport))

          // Se lo agregamos asus arreglos correspondientes.
          this.azLists.unshift(azList);
          this.getVoyages.unshift(newVoyage);

          // vuelvo a cargar los datos de incio del token.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_VOYAGE_CREATE_LOCAL'));

          this.databaseService.EmitterCantOffline();
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_VOYAGE_CREATE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }
  }

  private DeleteVoyageOnlineOffline(voyageDelete: Voyage) {

    if (false) {

      // Guardo el objeto obtenido
      this.voyageService.Delete(voyageDelete).subscribe(
        (result: Voyage) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_VOYAGE_DELETE'));

          // La siguiente linea de codigo eliminara un objeto del array.
          this.getVoyages = this.getVoyages.filter(
            (voyage: Voyage) => {
              if (Number(voyage.id) === Number(result.id)) {
                return false;
              }
              return true;
            }
          )
          this.azLists = this.azLists.filter(
            azList => {
              if (Number(azList.id) === Number(result.id)) {
                return false;
              }
              return true;
            }
          );

          this.databaseService.updateVoyageIndexedDB(result);

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // vuelvo a cargar los datos de incio del token.
          this.Initialize();
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_VOYAGE_DELETE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });

    } else {

      Promise.resolve(true).then(
        () => {
          // Consultamos al userIndexDB para saber el estado del sync.
          return this.databaseService.getVoyageIndexDB(voyageDelete.id);
        }
      ).then(
        (voyageIndexedDB: Voyage) => {
          // Verificamos el estado si es add que continue, caso contrario delete.
          if (voyageIndexedDB.syncStatus === 'added' || voyageIndexedDB.syncStatus === 'updated') {

          } else {
            voyageDelete.syncStatus = 'deleted';
          }

          // le seteo el password por defecto y el estado a false.
          voyageDelete.status = false;

          // Actualizo el voyage con el estado en False.
          return this.databaseService.updateVoyageIndexedDB(voyageDelete);
        }
      ).then(
        (resultUpdate: Voyage) => {

          // Elimino el usuario del arreglo.
          this.getVoyages = this.getVoyages.filter(
            (voyage: Voyage) => {
              if (Number(voyage.id) === Number(resultUpdate.id)) {
                return false;
              }
              return true;
            }
          );
          this.azLists = this.azLists.filter(
            azList => {
              if (Number(azList.id) === Number(resultUpdate.id)) {
                return false;
              }
              return true;
            }
          )
          // Inicializo los datos.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_VOYAGE_DELETE_LOCAL'));

          this.databaseService.EmitterCantOffline();
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_VOYAGE_DELETE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }

  }

  private CreatePortOnlineOffline(newPort: Port) {

    let error: boolean = false;
    if (!newPort.departurePort && !newPort.departurePort.length) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'DEPARTURE_MISSING'));
      error = true;
    }
    if (!newPort.arrivalPort && !newPort.arrivalPort.length) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'ARRIVAL_MISSING'));
      error = true;
    }

    if (error) throw 'OK';

    // Verificamos si estamos en linea
    if (false) {

      this.portService.Create(newPort).subscribe(
        (resultCreate: Port) => {

          this.selectPort = resultCreate;

          // Actualizamos el nuevo viaje con el resultado.
          newPort = resultCreate;
          newPort.totalReport = 0;

          // armamos el obj Azlist
          let azList = new AzList(newPort.id, 'Port N°' + newPort.portNumber, '(' + newPort.departurePort + ' - ' + newPort.arrivalPort + ')', '', '', String(newPort.totalReport))

          // Se lo agregamos asus arreglos correspondientes.
          this.azLists.unshift(azList);
          this.getPorts.unshift(newPort);
          this.databaseService.addPortIndexedDB(newPort);

          // Actualizamos el total de puertos.
          this.selectVoyage.totalPort = this.selectVoyage.totalPort + 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getVoyages = this.getVoyages.map(
            (voyage: Voyage) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(voyage.id) === Number(this.selectVoyage.id)) {
                // Actualizamos el valor con el resultado
                voyage = this.selectVoyage;
              }

              return voyage;
            }
          );
          this.databaseService.updateVoyageIndexedDB(this.selectVoyage);

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_CREATE'));


          // Inicializamos los datos.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          return true;
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_PORT_CREATE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    } else {

      // Le agregamos un stado Sync
      newPort.syncStatus = 'added';
      delete newPort.id;
      newPort.totalReport = 0;

      Promise.resolve(true).then(
        () => {
          // Agregamos el port al indexedDB.
          return this.databaseService.addPortIndexedDB(newPort);
        }
      ).then(
        (resultPortIndexedDB: Port) => {

          newPort = resultPortIndexedDB;

          // armamos el obj Azlist
          let azList = new AzList(newPort.id, 'Port N°' + newPort.portNumber, '(' + newPort.departurePort + ' - ' + newPort.arrivalPort + ')', '', '', String(newPort.totalReport))

          // Se lo agregamos asus arreglos correspondientes.
          this.azLists.unshift(azList);
          this.getPorts.unshift(newPort);


          // Actualizamos el total de puertos.
          this.selectVoyage.totalPort = this.selectVoyage.totalPort + 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getVoyages = this.getVoyages.map(
            (voyage: Voyage) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(voyage.id) === Number(this.selectVoyage.id)) {
                // Actualizamos el valor con el resultado
                voyage = this.selectVoyage;
              }

              return voyage;
            }
          );
          this.databaseService.updateVoyageIndexedDB(this.selectVoyage);

          // vuelvo a cargar los datos de incio del token.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();


          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_CREATE_LOCAL'));

          this.databaseService.EmitterCantOffline();

        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_PORT_CREATE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }
  }

  private UpdatePortOnelineOffline(portToSave: Port) {

    let error: boolean = false;
    if (!portToSave.departurePort && !portToSave.departurePort.length) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'DEPARTURE_MISSING'));
      error = true;
    }
    if (!portToSave.arrivalPort && !portToSave.arrivalPort.length) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'ARRIVAL_MISSING'));
      error = true;
    }

    if (error) throw 'OK';

    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (false) {
      // ENcapsulamos el valor antes qie se elimine en el lservicio.
      let totalReport = portToSave.totalReport;
      // Guardo el objeto obtenido
      this.portService.Save(portToSave).subscribe(

        (result: Port) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_SAVE'));
          portToSave.totalReport = totalReport;
          // le seteo el total de reporte por que este valor no viene desde el backend.
          result.totalReport = totalReport;

          // Filtro y actualizo luego lo agrego al arreglo.
          this.getPorts = this.getPorts.map(
            (port: Port) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(port.id) === Number(result.id)) {
                // Actualizamos el valor con el resultado
                port = result;
              }

              return port;
            }
          );
          this.databaseService.updatePortIndexedDB(result);

          // Actualizamos la lista del azlist
          this.azLists = this.azLists.map(
            (azList: AzList) => {

              // Buscamos el id para cambiar el valor de result.
              if (Number(azList.id) === Number(result.id)) {

                // Actualizamos el valor con el resultado
                azList = new AzList(result.id, 'Port N°' + result.portNumber, '(' + result.departurePort + ' - ' + result.arrivalPort + ')', '', '', String(result.totalReport));
              }

              return azList;
            }
          )

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Si no hubo cambios solo navego
          this.Initialize();
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_PORT_UPDATE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    } else {

      Promise.resolve(true).then(
        () => {
          // Consultamos al getPortIndexDB para saber el estado del sync.
          return this.databaseService.getPortIndexDB(portToSave.id);
        }
      ).then(
        (portIndexedDB: Port) => {
          // Verificamos el estado si es add que continue, caso contrario delete.
          if (portIndexedDB.syncStatus !== 'added') {
            portToSave.syncStatus = 'updated';
          } else {
            portToSave.syncStatus = 'added';
            // Corregir todo con then
          }

          // Actualizo el puerto
          return this.databaseService.updatePortIndexedDB(portToSave);
        }
      ).then(
        (resultUpdate: Port) => {
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getPorts = this.getPorts.map(
            (port: Port) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(port.id) === Number(resultUpdate.id)) {
                // Actualizamos el valor con el resultado
                port = resultUpdate;
              }

              return port;
            }
          );

          // Actualizamos la lista del azlist
          this.azLists = this.azLists.map(
            (azList: AzList) => {

              // Buscamos el id para cambiar el valor de result.
              if (azList.id === resultUpdate.id) {
                // Actualizamos el valor con el resultado
                azList = new AzList(resultUpdate.id, 'Port N°' + resultUpdate.portNumber, '(' + resultUpdate.departurePort + ' - ' + resultUpdate.arrivalPort + ')', '', '', String(resultUpdate.totalReport));
              }
              return azList;

            }
          )

          // Si no hubo cambios solo navego
          this.Initialize();
          // Deshabilito el spinner de loading
          this.loadingService.Close();
          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_SAVE_LOCAL'));

          this.databaseService.EmitterCantOffline();
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_PORT_UPDATE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }
  }

  private DeletePortOnlineOffline(portDelete: Port) {

    if (false) {
      // Guardo el objeto obtenido
      this.portService.Delete(portDelete).subscribe(
        (result: Port) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_DELETE'));

          // La siguiente linea de codigo eliminara un objeto del array.
          this.getPorts = this.getPorts.filter(
            (port: Port) => {
              if (Number(port.id) === Number(result.id)) {
                return false;
              }
              return true;
            }
          )
          this.azLists = this.azLists.filter(
            azList => {
              if (Number(azList.id) === Number(result.id)) {
                return false;
              }
              return true;
            }
          );


          // Actualizamos el total de puertos.
          this.selectVoyage.totalPort = this.selectVoyage.totalPort - 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getVoyages = this.getVoyages.map(
            (voyage: Voyage) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(voyage.id) === Number(this.selectVoyage.id)) {
                // Actualizamos el valor con el resultado
                voyage = this.selectVoyage;
              }

              return voyage;
            }
          );
          this.databaseService.updateVoyageIndexedDB(this.selectVoyage);


          this.databaseService.updatePortIndexedDB(result);

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // vuelvo a cargar los datos de incio del token.
          this.Initialize();
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_PORT_DELETE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });

    } else {

      Promise.resolve(true).then(
        () => {
          // Consultamos al userIndexDB para saber el estado del sync.
          return this.databaseService.getPortIndexDB(portDelete.id);
        }
      ).then(
        (getPortIndexDB: Port) => {
          // Verificamos el estado si es add que continue, caso contrario delete.
          if (getPortIndexDB.syncStatus === 'added' || getPortIndexDB.syncStatus === 'updated') {

          } else {
            getPortIndexDB.syncStatus = 'deleted';
          }

          // le seteo el password por defecto y el estado a false.
          getPortIndexDB.status = false;

          // Actualizo el voyage con el estado en False.
          return this.databaseService.updatePortIndexedDB(getPortIndexDB);
        }
      ).then(
        (resultUpdate: Port) => {

          // Elimino el usuario del arreglo.
          this.getPorts = this.getPorts.filter(
            (port: Port) => {
              if (Number(port.id) === Number(resultUpdate.id)) {
                return false;
              }
              return true;
            }
          );
          this.azLists = this.azLists.filter(
            azList => {
              if (Number(azList.id) === Number(resultUpdate.id)) {
                return false;
              }
              return true;
            }
          )


          // Actualizamos el total de puertos.
          this.selectVoyage.totalPort = this.selectVoyage.totalPort - 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getVoyages = this.getVoyages.map(
            (voyage: Voyage) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(voyage.id) === Number(this.selectVoyage.id)) {
                // Actualizamos el valor con el resultado
                voyage = this.selectVoyage;
              }

              return voyage;
            }
          );
          this.databaseService.updateVoyageIndexedDB(this.selectVoyage);

          // Inicializo los datos.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_DELETE_LOCAL'));

          this.databaseService.EmitterCantOffline();
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_PORT_DELETE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }

  }

  // ----------------------------      DailyReport      -----------------------------
  private CreateDailyReportOnlineOffline(newDailyReport: DailyReport) {

    let error: boolean = false;
    if (!newDailyReport.date || !validateDate(newDailyReport.date)) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_DATE_FIELD'));
      error = true;
    }
    if (!newDailyReport.hour && !newDailyReport.hour) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_HOUR_FIELD'));
      error = true;
    }
    if (!newDailyReport.activityPerformed && !newDailyReport.activityPerformed) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_ACTIVITY_FIELD'));
      error = true;
    }

    if (newDailyReport.activityPerformed == 'SAILING_IN_BALLAST' || newDailyReport.activityPerformed == 'SAILING_WITH_LADEN' || newDailyReport.activityPerformed == 'ECONOMICAL_NAVIGATION') {
      if (!newDailyReport.beaufour) {
        this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_BEFOURT'));
        error = true;
      }

      if (!newDailyReport.distance) {
        this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_DISTANCE'));
        error = true;
      }
    }

    if (error) throw 'OK';

    newDailyReport.steamingTime = this.GenerateTimeOperation();
    newDailyReport.date = ConvertirDateHourToMoment2(newDailyReport.date, newDailyReport.hour);


    // Verificamos si estamos en linea
    if (false) {

      this.dailyReportService.Create(newDailyReport).subscribe(
        (resultCreate: DailyReport) => {

          // Actualizamos el nuevo viaje con el resultado.
          newDailyReport = resultCreate;

          this.getDailyReports.unshift(newDailyReport);
          this.databaseService.addDailyReportIndexedDB(newDailyReport);

          // Actualizamos el total de puertos.
          this.selectVoyage.totalReport = this.selectVoyage.totalReport + 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getVoyages = this.getVoyages.map(
            (voyage: Voyage) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(voyage.id) === Number(this.selectVoyage.id)) {
                // Actualizamos el valor con el resultado
                voyage = this.selectVoyage;
              }

              return voyage;
            }
          );
          this.databaseService.updateVoyageIndexedDB(this.selectVoyage);


          // Actualizamos el total de reportes.
          this.selectPort.totalReport = this.selectPort.totalReport + 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getPorts = this.getPorts.map(
            (port: Port) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(port.id) === Number(this.selectPort.id)) {
                // Actualizamos el valor con el resultado
                port = this.selectPort;
              }

              return port;
            }
          );
          this.databaseService.updatePortIndexedDB(this.selectPort);

          this.azLists = this.azLists.map(
            (azList: AzList) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(azList.id) === Number(this.selectPort.id)) {
                // Actualizamos el valor con el resultado
                azList.item3 = String(this.selectPort.totalReport);
              }

              return azList;
            }
          );


          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_DAILY_REPORT_CREATE'));

          // Inicializamos los datos.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();
          this.List_Voyages_Ports_DailyReports = 'Ports';

          return true;
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_DAILY_REPORT_CREATE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    } else {

      // Le agregamos un stado Sync
      newDailyReport.syncStatus = 'added';
      delete newDailyReport.id;

      Promise.resolve(true).then(
        () => {
          // Agregamos el port al indexedDB.
          return this.databaseService.addDailyReportIndexedDB(newDailyReport);
        }
      ).then(
        (resultDailyReportIndexedDB: DailyReport) => {

          newDailyReport = resultDailyReportIndexedDB;

          this.getDailyReports.unshift(newDailyReport);

          // Actualizamos el total de puertos.
          this.selectVoyage.totalReport = this.selectVoyage.totalReport + 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getVoyages = this.getVoyages.map(
            (voyage: Voyage) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(voyage.id) === Number(this.selectVoyage.id)) {
                // Actualizamos el valor con el resultado
                voyage = this.selectVoyage;
              }

              return voyage;
            }
          );
          this.databaseService.updateVoyageIndexedDB(this.selectVoyage);


          // Actualizamos el total de reportes.
          this.selectPort.totalReport = this.selectPort.totalReport + 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getPorts = this.getPorts.map(
            (port: Port) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(port.id) === Number(this.selectPort.id)) {
                // Actualizamos el valor con el resultado
                port = this.selectPort;
              }

              return port;
            }
          );
          this.databaseService.updatePortIndexedDB(this.selectPort);


          this.azLists = this.azLists.map(
            (azList: AzList) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(azList.id) === Number(this.selectPort.id)) {
                // Actualizamos el valor con el resultado
                azList.item3 = String(this.selectPort.totalReport);
              }

              return azList;
            }
          );



          // vuelvo a cargar los datos de incio del token.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_DAILY_REPORT_CREATE_LOCAL'));
          this.List_Voyages_Ports_DailyReports = 'Ports';

          this.databaseService.EmitterCantOffline();
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_DAILY_REPORT_CREATE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }
  }

  private UpdateDailyReportOnelineOffline(dailyReportToSave: DailyReport) {
    let error: boolean = false;
    if (!dailyReportToSave.date || !validateDate(dailyReportToSave.date)) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'REVISAR DATE'));
      error = true;
    }
    if (!dailyReportToSave.hour && !dailyReportToSave.hour) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'REVISAR HOUR'));
      error = true;
    }
    if (!dailyReportToSave.activityPerformed && !dailyReportToSave.activityPerformed) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'REVISAR ACTIVITY'));
      error = true;
    }

    if (dailyReportToSave.activityPerformed == 'SAILING_IN_BALLAST' || dailyReportToSave.activityPerformed == 'SAILING_WITH_LADEN' || dailyReportToSave.activityPerformed == 'ECONOMICAL_NAVIGATION') {
      if (!dailyReportToSave.beaufour) {
        this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_BEFOURT'));
        error = true;
      }

      if (!dailyReportToSave.distance) {
        this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_DISTANCE'));
        error = true;
      }
    }

    if (error) throw 'OK';

    dailyReportToSave.steamingTime = this.GenerateTimeOperation();

    dailyReportToSave.date = ConvertirDateHourToMoment2(dailyReportToSave.date, dailyReportToSave.hour);

    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (false) {

      // Guardo el objeto obtenido
      this.dailyReportService.Save(dailyReportToSave).subscribe(
        (result: DailyReport) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_DAILY_REPORT_SAVE'));

          // Filtro y actualizo luego lo agrego al arreglo.
          this.getDailyReports = this.getDailyReports.map(
            (dailyReport: DailyReport) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(dailyReport.id) === Number(result.id)) {
                // Actualizamos el valor con el resultado
                dailyReport = result;
              }

              return dailyReport;
            }
          );
          this.databaseService.updateDailyReportIndexedDB(result);

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Si no hubo cambios solo navego
          this.Initialize();
          this.List_Voyages_Ports_DailyReports = 'Ports';

        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_PORT_UPDATE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    } else {

      Promise.resolve(true).then(
        () => {
          // Consultamos al getPortIndexDB para saber el estado del sync.
          return this.databaseService.getDailyReportIndexDB(dailyReportToSave.id);
        }
      ).then(
        (dailyReportIndexedDB: DailyReport) => {
          // Verificamos el estado si es add que continue, caso contrario delete.
          if (dailyReportIndexedDB.syncStatus !== 'added') {
            dailyReportToSave.syncStatus = 'updated';
          } else {
            dailyReportToSave.syncStatus = 'added';
            // Corregir todo con then
          }

          // Actualizo el puerto
          return this.databaseService.updateDailyReportIndexedDB(dailyReportToSave)
        }
      ).then(
        (resultUpdate: Port) => {
          // Filtro y actualizo luego lo agrego al arreglo.

          // Filtro y actualizo luego lo agrego al arreglo.
          this.getDailyReports = this.getDailyReports.map(
            (dailyReport: DailyReport) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(dailyReport.id) === Number(resultUpdate.id)) {
                // Actualizamos el valor con el resultado
                dailyReport = resultUpdate;
              }

              return dailyReport;
            }
          );

          // Si no hubo cambios solo navego
          this.Initialize();
          // Deshabilito el spinner de loading
          this.loadingService.Close();
          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_SAVE_LOCAL'));

          this.List_Voyages_Ports_DailyReports = 'Ports';

          this.databaseService.EmitterCantOffline();
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_PORT_UPDATE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }
  }

  private DeleteDailyReportOnlineOffline(dailyReportDelete: DailyReport) {

    if (false) {
      // Guardo el objeto obtenido
      this.dailyReportService.Delete(dailyReportDelete).subscribe(
        (result: DailyReport) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_DAILY_REPORT_DELETE'));

          // La siguiente linea de codigo eliminara un objeto del array.
          this.getDailyReports = this.getDailyReports.filter(
            (dailyReport: DailyReport) => {
              if (Number(dailyReport.id) === Number(result.id)) {
                return false;
              }
              return true;
            }
          );



          // Actualizamos el total de puertos.
          this.selectVoyage.totalReport = this.selectVoyage.totalReport - 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getVoyages = this.getVoyages.map(
            (voyage: Voyage) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(voyage.id) === Number(this.selectVoyage.id)) {
                // Actualizamos el valor con el resultado
                voyage = this.selectVoyage;
              }

              return voyage;
            }
          );
          this.databaseService.updateVoyageIndexedDB(this.selectVoyage);


          // Actualizamos el total de reportes.
          this.selectPort.totalReport = this.selectPort.totalReport - 1;
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getPorts = this.getPorts.map(
            (port: Port) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(port.id) === Number(this.selectPort.id)) {
                // Actualizamos el valor con el resultado
                port = this.selectPort;
              }

              return port;
            }
          );
          this.databaseService.updatePortIndexedDB(this.selectPort);


          this.azLists = this.azLists.map(
            (azList: AzList) => {
              // Buscamos el id para cambiar el valor de result.
              if (Number(azList.id) === Number(this.selectPort.id)) {
                // Actualizamos el valor con el resultado
                azList.item3 = String(this.selectPort.totalReport);
              }

              return azList;
            }
          );

          this.databaseService.updateDailyReportIndexedDB(result);

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // vuelvo a cargar los datos de incio del token.
          this.Initialize();
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_DAILY_REPORT_DELETE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });

    } else {
      this.DeleteDailyReportOFFLINE(dailyReportDelete);
    }

  }

  private DeleteDailyReportOFFLINE(dailyReportDelete: DailyReport) {

    Promise.resolve(true).then(
      () => {
        // Consultamos al userIndexDB para saber el estado del sync.
        return this.databaseService.getDailyReportIndexDB(dailyReportDelete.id);
      }
    ).then(
      (getDailyReportIndexDB: DailyReport) => {
        // Verificamos el estado si es add que continue, caso contrario delete.
        if (getDailyReportIndexDB.syncStatus === 'added' || getDailyReportIndexDB.syncStatus === 'updated') {
        } else {
          getDailyReportIndexDB.syncStatus = 'deleted';
        }

        // le seteo el password por defecto y el estado a false.
        getDailyReportIndexDB.status = false;

        // Actualizo el voyage con el estado en False.
        return this.databaseService.updateDailyReportIndexedDB(getDailyReportIndexDB);
      }
    ).then(
      (resultUpdate: DailyReport) => {

        // Elimino el usuario del arreglo.
        this.getDailyReports = this.getDailyReports.filter(
          (dailyReport: DailyReport) => {
            if (Number(dailyReport.id) === Number(resultUpdate.id)) {
              return false;
            }
            return true;
          }
        );

        // Actualizamos el total de puertos.
        this.selectVoyage.totalReport = this.selectVoyage.totalReport - 1;
        // Filtro y actualizo luego lo agrego al arreglo.
        this.getVoyages = this.getVoyages.map(
          (voyage: Voyage) => {
            // Buscamos el id para cambiar el valor de result.
            if (Number(voyage.id) === Number(this.selectVoyage.id)) {
              // Actualizamos el valor con el resultado
              voyage = this.selectVoyage;
            }

            return voyage;
          }
        );
        this.databaseService.updateVoyageIndexedDB(this.selectVoyage);

        // Actualizamos el total de reportes.
        this.selectPort.totalReport = this.selectPort.totalReport - 1;
        // Filtro y actualizo luego lo agrego al arreglo.
        this.getPorts = this.getPorts.map(
          (port: Port) => {
            // Buscamos el id para cambiar el valor de result.
            if (Number(port.id) === Number(this.selectPort.id)) {
              // Actualizamos el valor con el resultado
              port = this.selectPort;
            }

            return port;
          }
        );



        this.azLists = this.azLists.map(
          (azList: AzList) => {
            // Buscamos el id para cambiar el valor de result.
            if (Number(azList.id) === Number(this.selectPort.id)) {
              // Actualizamos el valor con el resultado
              azList.item3 = String(this.selectPort.totalReport);
            }

            return azList;
          }
        );




        this.databaseService.updatePortIndexedDB(this.selectPort);

        // Inicializo los datos.
        this.Initialize();

        // Deshabilito el spinner de loading
        this.loadingService.Close();

        // Muestro notificación
        this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_DELETE_LOCAL'));

        this.databaseService.EmitterCantOffline();
      }
    ).catch(
      error => {
        // Valido si viene un mensaje de error
        let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_DAILY_REPORT_DELETE_LOCAL');

        // Muestro notificación
        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

        // Deshabilito el spinner de loading
        this.loadingService.Close();
      }
    );

  }
  // Funciones para inicializar datos //
  //////////////////////////////////////
  // InitializeUser() : Iniziliza el objeto SailingAnality.
  private Initialize(): void {
    console.log('Initialize()');



    // Inicializo su valor.
    this.disableEdit = true;

    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {

    } else if (this.List_Voyages_Ports_DailyReports === 'Ports') {

      // actualizo el valor del InitializeSailingAnality.
      this.initialPort = this.Collect();
    } else if (this.List_Voyages_Ports_DailyReports === 'DailyReports') {


      if (!this.selectDailyReport.id) {

        this.databaseService.GetLastReportDailys().then(
          result => {

            this.lastRecordedHour = FormatDateUTCToDateHour(result.date);


            // ya que se inicia un nuevo reporte, verificamos los cambios de la actividad.
            this.ChangeActivityPerformed();

            this.selectDailyReport.steamingTime = this.GenerateTimeOperation();
          }
        )
      }


      // actualizo el valor del InitializeSailingAnality.
      this.initialDailyReport = this.Collect();
    }

  }

  public onKeyUpEvent(event?: any): void {

    if (this.selectDailyReport.hour.length > 0 && validateDate(this.selectDailyReport.date)) {
      this.selectDailyReport.steamingTime = this.GenerateTimeOperation();
    }

  }

  private GenerateTimeOperation(): number {

    let lastDateHour = ConvertirDateHourToMoment(this.selectDailyReport.date, this.selectDailyReport.hour);
    let momendate = ConvertMMDDYYYYHHmmToMomment(this.lastRecordedHour);

    let diferentHour = DiferentHourTwoMoment(lastDateHour, momendate);


    return this.MathRoundOneDecimal(diferentHour, 2);

  }

  private Collect(): any {

    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {

    } else if (this.List_Voyages_Ports_DailyReports === 'Ports') {

      // El objeto user lo seteamos.
      let port: Port = this.selectPort;

      // Retorno el objeto
      return JSON.parse(JSON.stringify(port));

    } else if (this.List_Voyages_Ports_DailyReports === 'DailyReports') {

      // El objeto user lo seteamos.
      let dailyReport: DailyReport = this.selectDailyReport;
      // Se obtine el valor segun se esta iniciando.
      this.myControlFormSelectBefourt.setValue(dailyReport.beaufour);
      // Retorno el objeto
      return JSON.parse(JSON.stringify(dailyReport));
    }

  }

  // ModifiedUser() : Verifica si el usuario a sido modificado.
  private Modified(): boolean {


    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {

    } else if (this.List_Voyages_Ports_DailyReports === 'Ports') {
      // Armo objeto para pasarle al servicio
      let portToSave: Port = this.Collect();
      // Comparo los objetos antes y despues
      return !(JSON.stringify(portToSave) === JSON.stringify(this.initialPort));
    } else if (this.List_Voyages_Ports_DailyReports === 'DailyReports') {
      // Armo objeto para pasarle al servicio
      let dailyReportToSave: DailyReport = this.Collect();
      // Comparo los objetos antes y despues
      return !(JSON.stringify(dailyReportToSave) === JSON.stringify(this.initialDailyReport));
    }

  }




  // Mejorar esto
  public FormatDate(fecha: any): string {
    let formatfecha = stringToDate(fecha);

    return formatfecha;
  }


  // Total del consumo IFO
  public TotalIFO(dailyReport: DailyReport): number {
    // Total del consumo MGO
    let total = 0;

    // sumamos el consumo

    total = dailyReport.mplaIfo + dailyReport.auxIfo + dailyReport.boilerIfo + dailyReport.otherIfo;

    // Retornamos el total de cosumo
    return mathRound(total, 2);
  }

  // Total del consumo MGO
  public TotalMGO(dailyReport: DailyReport): number {
    // Total del consumo MGO
    let total = 0;

    // sumamos el consumo
    total = dailyReport.mplaMgo + dailyReport.auxMgo + dailyReport.boilerMgo + dailyReport.ppMgo + dailyReport.giMgo + dailyReport.otherMgo;

    // Retornamos el total de cosumo
    return mathRound(total, 2);
  }


  public ActivateBunkering(activateOrDes: boolean): boolean {

    if (activateOrDes) {
      this.isBunkering = true;
      this.selectDailyReport.bunkeringIfo = 0;
      this.selectDailyReport.bunkeringMgo = 0;
    } else {
      this.isBunkering = false;
      this.selectDailyReport.bunkeringIfo = 0;
      this.selectDailyReport.bunkeringMgo = 0;
    }

    return false;
  }

  public MathRoundOneDecimal(valor, cantDecimales: number) {
    if (!valor) { return 0; }

    let result = mathRound(valor, 2)
    return result;
  }

  public ChangeActivityPerformed() {
    console.log('ChangeActivityPerformed()')
    if (
      this.selectDailyReport.activityPerformed !== 'SAILING_IN_BALLAST' &&
      this.selectDailyReport.activityPerformed !== 'SAILING_WITH_LADEN' &&
      this.selectDailyReport.activityPerformed !== 'ECONOMICAL_NAVIGATION') {
      this.selectDailyReport.speedStraction = '';
    }
    if (
      this.selectDailyReport.activityPerformed === 'SAILING_IN_BALLAST' ||
      this.selectDailyReport.activityPerformed === 'SAILING_WITH_LADEN') {
      this.selectDailyReport.speedStraction = 'FULL_SPEED';
    }
  }

  public ChangeTypeActivityPerformed() {
    console.log('ChangeTypeActivityPerformed()')

    if(this.selectDailyReport.typeActivityPerformed == 'REPORT_AT_08_00'){
      this.selectDailyReport.activityPerformed = "";
    } else {
      
      this.selectDailyReport.activityPerformed = this.selectDailyReport.typeActivityPerformed;
      this.ChangeActivityPerformed()
    }
  }
  // filtro befourt
  private FilterInputBefourt(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsBefourt.filter(option => option.toLowerCase().includes(filterValue));
  }

}
