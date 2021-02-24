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
import { map, mergeMap } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import { DatabaseService } from '../../../services/database.service';
import { Voyage } from '../../../models/voyage';
import { getYear } from '../../../../assets/moment/moment.assets';
import { DialogData, DialogDeleteComponent } from '../../../shared/dialog/delete/dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Port } from '../../../models/port';
import { PortService } from '../../../services/port.service';



@Component({
  selector: 'app-voyage',
  templateUrl: './voyage.component.html',
  styleUrls: ['./voyage.component.scss']
})
export class VoyageComponent implements OnInit {
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

  // Texto de la cabecera del body
  public title_header_media: string = '';
  public sub_title_header_media: string = '';


  // Esta variable servira para identificar si estamos en
  // Voyage, Port, DailyReport
  public List_Voyages_Ports_DailyReports = 'Voyages';
  public toolTipSave = '';
  public toolTipDiscard = '';

  // Esta variable permite habilita la edicion en el formulario.
  public disableEdit: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private userService: UserService,
    private voyageService: VoyageService,
    private portService: PortService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private aSideService: ASideService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    // Activamos el loading.
    this.loadingService.Open();
    // si el aSide esta abierto lo cerramos.
    this.aSideService.Close();

    // Seleccionalos al usuario logeado.
    this.selectUser = this.userService.GetIdentity();
    // Obtenemos el rol del usuario.
    this.roleUser = this.userService.GetIdentity().role;

    // Configuracion AzList
    this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage'];
    this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'VOYAGE_REGISTER');
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


    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (!!window.navigator.onLine) {

      let user: User = new User();

      // Si el usuario es un buque lo filtramos.
      if (this.selectUser.role === 'BUQUE') {
        user.id = this.selectUser.id;
      } else {
      }

      Promise.resolve(true).then(
        result => {

          // Traigo a todos los User y lo instancio en el obj.
          return this.GetUsers(user).pipe().toPromise();
        }
      ).then(
        resultGetUser => {
          if (!resultGetUser) throw 'ERROR_GET_USERS';


          let voyage: Voyage = new Voyage();
          let firstUser: User = this.getUsers.find(user => user.role === 'BUQUE');
          if (firstUser) {
            this.selectUser = firstUser;
            this.selectUserDropdown = firstUser.id;
            voyage.userId = this.selectUserDropdown;

            this.SettingAzList.isNew = true;
            this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_VOYAGE');
          } else {
            if (!resultGetUser) throw 'NO_BUQUE_REGISTER';
          }


          // Traigo a todos los User y lo instancio en el obj.
          // GeyVoyage obtiene todos los puertos.
          return this.GetVoyagesDetail(voyage).pipe().toPromise();
        }
      ).then(
        resulGetVoyages => {
          if (!resulGetVoyages) throw 'ERROR_GET_VOYAGES';

          // Traigo a todos los User y lo instancio en el obj.
          return this.databaseService.Sync();
        }
      ).then(
        resultSync => {
          // Revisamos si el result es el esperado.
          if (!resultSync) throw 'ERROR_SYNC_INDEXEDDB_IN_ONLINE';

          // Hacemos Clear a la Tabla Users
          return this.databaseService.ClearUsersIndexedDB();
        }
      ).then(
        resultClear => {
          // Revisamos si el result es el esperado.
          if (!resultClear) throw 'ERROR_CLEAR_INDEXEDDB';

          // Hacemos Clear a la Tabla Users
          return this.databaseService.ClearVoyagesIndexedDB();
        }
      ).then(
        resultClear => {
          // Revisamos si el result es el esperado.
          if (!resultClear) throw 'ERROR_CLEAR_INDEXEDDB';

          // Hacemos Clear a la Tabla Users
          return this.databaseService.ClearPortsIndexedDB();
        }
      ).then(
        resultClear => {
          // Revisamos si el result es el esperado.
          if (!resultClear) throw 'ERROR_CLEAR_INDEXEDDB';

          // Agregamos los usuarios al indexedDB
          return this.databaseService.addUsersIndexedDB(this.getUsers);
        }
      ).then(
        resultAddUser => {
          // Revisamos si el result es el esperado.
          if (!resultAddUser) throw 'ERROR_ADD_USER_INDEXEDDB';

          // Agregamos los usuarios al indexedDB
          return this.databaseService.addVoyagesIndexedDB(this.getVoyages);
        }
      ).then(
        resultAddVoyages => {
          // Revisamos si el result es el esperado.
          if (!resultAddVoyages) throw 'ERROR_UPDATE_INDEXEDDB_IN_ONLINE';

          this.loadDataIndexedDB();
        }
      ).catch(
        err => {

          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, err || 'ERROR_ON_LOAD'));

          console.error(msg);
          console.dir(err);

          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });

    }
    else {
      this.loadDataIndexedDB();
    }
  }

  // ==============  Funciones  AZLIST ====================
  public SelectItemAzList(event: AzList): void {
    console.log('SelectItemAzList(event: AzList)');

    // REVISAR SI ES QUE LO BUSCAMOS DESDE EL ARREGLO O DESDE EL indexedDB
    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {
      // A lista se vuelve puertos
      this.List_Voyages_Ports_DailyReports = 'Ports';

      Promise.resolve(true).then(
        result => {

          // Seleccionamos al viaje.
          this.selectVoyage = this.getVoyages.find(
            (voyage: Voyage) => {
              return Number(voyage.id) === Number(event.id)
            }
          );

          this.title_header_media = 'Voyage-' + this.selectVoyage.year + '-' + this.selectVoyage.voyageNumber;

          return this.databaseService.getPortsByVoyageIndexDB(this.selectVoyage.id);
        }
      ).then(
        resultPorts => {
          if (!resultPorts) throw 'NO_FOUND_PORTS';

          this.getPorts = resultPorts;

          this.generateAzListByPorts(this.getPorts);

          this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage', 'Port'];
          this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'PORT_REGISTER');
          this.SettingAzList.isNew = true;
          this.SettingAzList.isBack = true;
          this.SettingAzList.toolTipOptionDelete = this.languageService.GetMessage(this.translateCategory, 'TOOLTIP_DELETE_PORT');
          this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_PORT');
          this.SettingAzList.toolTipBack = this.languageService.GetMessage(this.translateCategory, 'BACK_LIST_VOYAGE');
          this.SettingAzList.activateSelectItemEmit2 = false;
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

    } else if (this.List_Voyages_Ports_DailyReports === 'Ports') {
      // A lista se vuelve puertos
      //this.List_Voyages_Ports_DailyReports = 'DailyReports';

      Promise.resolve(true).then(
        result => {

          // Seleccionamos al viaje.
          this.selectPort = this.getPorts.find(
            (port: Port) => {
              return Number(port.id) === Number(event.id)
            }
          );

          return true;
        }
      ).then(
        result => {
          this.Initialize();
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


    }
  }

  public ClickSelectUser(userId: number): void {
    console.log('ClickSelectUser(event: AzList)');
    console.log(userId);
    userId = Number(userId);

    this.loadingService.Open();


    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (!!window.navigator.onLine) {

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
          this.loadDataIndexedDB();
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
      // Deshabilito el spinner de loading
      this.loadingService.Close();
    }

  }

  public ClickNew() {
    console.log('ClickNew(event: AzList)');


    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {
      let newVoyage = new Voyage();

      newVoyage.userId = this.selectUser.id;
      if (this.getVoyages && this.getVoyages.length > 0) { newVoyage.voyageNumber = this.getVoyages[0].voyageNumber + 1; }
      else { newVoyage.voyageNumber = 1; };
      newVoyage.year = Number(getYear());
      newVoyage.status = true;

      this.CreateVoyageOnlineOffline(newVoyage);
    } else if (this.List_Voyages_Ports_DailyReports === 'Ports') {

      // habilitamos el puerto actual para registrar uno nuevo.
      this.selectPort = new Port();

      this.Initialize();
      this.disableEdit = false;

    }

    return false;
  }

  public ClickSave() {
    console.log('ClickSave()');

    if (this.List_Voyages_Ports_DailyReports === 'Ports') {

      let newPort = new Port();

      newPort.userId = this.selectUser.id;
      if (this.getPorts && this.getPorts.length > 0) { newPort.portNumber = this.getPorts[0].portNumber + 1; }
      else { newPort.portNumber = 1; };
      newPort.voyageId = this.selectVoyage.id;
      newPort.departurePort = this.selectPort.departurePort;
      newPort.arrivalPort = this.selectPort.arrivalPort;
      newPort.status = true;

      this.CreatePortOnlineOffline(newPort);
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
            this.selectPort = this.selectPort.id ? this.initialPort : new Port();
            this.Initialize();
          } else {

          }
        });

    } else {

      if (this.List_Voyages_Ports_DailyReports === 'Ports') {
        this.selectPort = this.selectPort.id ? this.initialPort : new Port();

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

    if (this.List_Voyages_Ports_DailyReports === 'Ports') {
      // A lista se vuelve puertos
      this.List_Voyages_Ports_DailyReports = 'Voyages';

      this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage'];
      this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'VOYAGE_REGISTER');
      this.SettingAzList.isNew = true;
      this.SettingAzList.isBack = false;
      this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_VOYAGE');
      this.SettingAzList.toolTipBack = ''
      this.SettingAzList.toolTipOptionDelete = this.languageService.GetMessage(this.translateCategory, 'TOOLTIP_DELETE_VOYAGE');
      this.SettingAzList.activateSelectItemEmit2 = true;

      this.selectPort = new Port();
      this.title_header_media = '';
      this.sub_title_header_media = '';

      this.generateAzListByVoyages(this.getVoyages);
    }
  }

  public ClickAddPort(event: AzList) {
    console.log('ClickAddPort()');

  }

  public ClickAddReport(event: AzList) {
    console.log('ClickAddReport()');

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
      title: this.languageService.GetMessage(this.translateCategory, 'COMFIMR_DELETE_TITLE_REPLACE').replace('[VOYAGE]', voyageDelete.year + '-' + voyageDelete.voyageNumber),
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

  public ClickDelete(event: AzList) {
    console.log('ClickDelete(event: AzList)');
    this.ClickDeleteVoyage(event);
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
    voyages.forEach((voyage: Voyage) => {
      this.azLists.push(
        new AzList(voyage.id, 'Voyage' + voyage.year + '-' + voyage.voyageNumber, '', '', '' + voyage.totalPort, '' + voyage.totalReport)
      );
    });

  }

  // Azlist
  private generateAzListByPorts(ports: Port[]) {
    console.log('generateAzListByPorts(ports: Port[])');

    // vaciamos el objeto
    this.azLists = [];

    // Armo un obj azList.
    ports.forEach((port: Port) => {
      this.azLists.push(
        new AzList(port.id, 'Port' + port.portNumber, port.departurePort + ' - ' + port.arrivalPort, '', '' + 123, '')
      );
    });

  }

  // Local Data
  private loadDataIndexedDB() {
    console.log('loadDataIndexedDB()');

    Promise.resolve(true).then(
      () => {
        // Obtenemos los datos del usuario.
        return this.databaseService.getUsersIndexDB();
      }
    ).then(
      (users: User[]) => {
        if (users.length > 0) {

          // En la carga de data indexexDB cargo solo los buque.
          this.getUsers = users.filter(
            (user: User) => {
              return user.role === 'BUQUE';
            }
          );
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
        return this.databaseService.getVoyagesIndexDB(); // Revisar
      }
    ).then(
      (voyages: Voyage[]) => {
        // Los viajes pueden llegar vacio. solo si es array[] seria true.
        if (voyages) {

          this.getVoyages = voyages;
          // Generar lista por usuarios.
          this.generateAzListByVoyages(this.getVoyages); // Revisar

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
        let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD'));

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
        this.getUsers = resultUser || this.getUsers;

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
        this.getVoyages = resultVoyages || this.getVoyages;

        // Segun el resultado retornamos la respuesta.
        return (resultVoyages !== null);
      }
    ));
  }

  private CreateVoyageOnlineOffline(newVoyage: Voyage) {

    // Verificamos si estamos en linea
    if (!!window.navigator.onLine) {

      this.voyageService.Create(newVoyage).subscribe(
        (resultCreate: Voyage) => {

          // Actualizamos el nuevo viaje con el resultado.
          newVoyage = resultCreate;

          // armamos el obj Azlist
          let azList = new AzList(newVoyage.id, 'Voyage' + newVoyage.year + '-' + newVoyage.voyageNumber, '', '');

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

      Promise.resolve(true).then(
        () => {
          // Agregamos el voyage al indexedDB.
          return this.databaseService.addVoyageIndexedDB(newVoyage);
        }
      ).then(
        (resultVoyageIndexedDB: Voyage) => {

          newVoyage = resultVoyageIndexedDB;

          // armamos el obj Azlist
          let azList = new AzList(newVoyage.id, 'Voyage' + newVoyage.year + '-' + newVoyage.voyageNumber, '', '');

          // Se lo agregamos asus arreglos correspondientes.
          this.azLists.unshift(azList);
          this.getVoyages.unshift(newVoyage);

          // vuelvo a cargar los datos de incio del token.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Muestro notificación
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_VOYAGE_CREATE_LOCAL'));

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

    if (!!window.navigator.onLine) {

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

          // Revisar como llega el usuario y si viaja en false.
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
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_VOYAGE_DELETE_LOCAL'));

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
    if (!!window.navigator.onLine) {

      this.portService.Create(newPort).subscribe(
        (resultCreate: Port) => {

          // Actualizamos el nuevo viaje con el resultado.
          newPort = resultCreate;

          // armamos el obj Azlist
          let azList = new AzList(newPort.id, 'Port' + newPort.portNumber, newPort.departurePort + ' - ' + newPort.arrivalPort, '', '' + 123, '')

          // Se lo agregamos asus arreglos correspondientes.
          this.azLists.unshift(azList);
          this.getPorts.unshift(newPort);
          this.databaseService.addPortIndexedDB(newPort);

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

      Promise.resolve(true).then(
        () => {
          // Agregamos el port al indexedDB.
          return this.databaseService.addPortIndexedDB(newPort);
        }
      ).then(
        (resultPortIndexedDB: Port) => {

          newPort = resultPortIndexedDB;

          // armamos el obj Azlist
          let azList = new AzList(newPort.id, 'Port' + newPort.portNumber, newPort.departurePort + ' - ' + newPort.arrivalPort, '', '' + 123, '')

          // Se lo agregamos asus arreglos correspondientes.
          this.azLists.unshift(azList);
          this.getPorts.unshift(newPort);

          // vuelvo a cargar los datos de incio del token.
          this.Initialize();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Muestro notificación
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_PORT_CREATE_LOCAL'));

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
    }

  }

  private Collect(): any {

    if (this.List_Voyages_Ports_DailyReports === 'Voyages') {

    } else if (this.List_Voyages_Ports_DailyReports === 'Ports') {

      // El objeto user lo seteamos.
      let port: Port = this.selectPort;

      // Retorno el objeto
      return JSON.parse(JSON.stringify(port));
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
    }

  }


}
