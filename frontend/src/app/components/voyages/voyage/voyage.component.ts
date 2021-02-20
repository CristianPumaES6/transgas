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
import { UserService } from 'src/app/services/user.service';
import { VoyageService } from 'src/app/services/voyage.service';

// Components Shared
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

// Librerias
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import { DatabaseService } from 'src/app/services/database.service';
import { Voyage } from 'src/app/models/voyage';
import { voyage } from 'src/app/languages/en.messages';
import { getYear } from 'src/assets/moment/moment.assets';
import { DialogData, DialogDeleteComponent } from 'src/app/shared/dialog/delete/dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';



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
  public selectUser: User = new User();
  // Lista de los datos del usuario
  public getUsers: User[] = [];

  public getVoyages: Voyage[] = [];

  // Esta variable permite habilita la edicion en el formulario.
  public disableEdit: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private userService: UserService,
    private voyageService: VoyageService,
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

    // PerfectScroll a body
    new PerfectScrollbar('.az-contact-info-body', {
      suppressScrollX: true
    })

    // Seleccionalos al usuario logeado.
    this.selectUser = this.userService.GetIdentity();
    // Obtenemos el rol del usuario.
    this.roleUser = this.userService.GetIdentity().role;

    // Configuracion AzList
    this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage'];
    this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'VOYAGE_REGISTER');
    this.SettingAzList.isNew = this.roleUser === 'BUQUE' ? true : false;
    this.SettingAzList.isBack = false;
    this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_VOYAGE');
    this.SettingAzList.toolTipBack = ''
    this.SettingAzList.activateDropDown = this.roleUser === 'ADMIN' || this.roleUser === 'SUPPORT' ? true : false;
    this.SettingAzList.placeholderDropdown = this.languageService.GetMessage(this.translateCategory, (this.roleUser === 'ADMIN' || this.roleUser === 'SUPPORT' ? 'SELECT_BUQUE' : ''));
    this.SettingAzList.activateOptionDelete = true;


    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (!!window.navigator.onLine) {

      let voyage: Voyage = new Voyage();
      let user: User = new User();

      // Si el usuario es un buque lo filtramos.
      if (this.selectUser.role === 'BUQUE') {
        voyage.userId = this.selectUser.id;
        user.id = this.selectUser.id;
      } else {
      }

      // Ejecuto todas las consultas para cargar datos segundarios
      forkJoin(
        [
          // Traigo a todos los User y lo instancio en el obj.
          this.GetUsers(user),
          // Traigo a todos los User y lo instancio en el obj.
          this.GetVoyagesDetail(voyage)
        ]
      ).pipe(
        mergeMap(
          (result: boolean[]) => {
            if (result) {
              // Obtengo resultados de las funciones
              let resulGetUsers: boolean = result[0];
              let resulGetVoyages: boolean = result[1];

              // Evaluo posibles errores en las ejecuciones
              if (!resulGetUsers) throw 'ERROR_GET_USERS';
              if (!resulGetVoyages) throw 'ERROR_GET_VOYAGES';

              // Sincronizamos todos los datos que falten sincronizar.
              return this.databaseService.Sync(); // Revisar.
            } else {
              // Algo fallo al ejecutar los observables
              throw this.languageService.GetMessage(this.translateCategory, 'ERROR_RESULT_GET');
            }
          }
        ), mergeMap(
          (result: boolean) => {

            // Revisamos si el result es el esperado.
            if (!result) throw 'ERROR_SYNC_INDEXEDDB_IN_ONLINE';

            // Hacemos Clear a la Tabla Users
            return this.databaseService.ClearUsersIndexedDB();
          }
        ), mergeMap(
          (result: boolean) => {
            // Revisamos si el result es el esperado.
            if (!result) throw 'ERROR_CLEAR_INDEXEDDB';

            // Agregamos los usuarios al indexedDB
            return this.databaseService.addUsersIndexedDB(this.getUsers);
          }
        ), mergeMap(
          (result: boolean) => {

            // Revisamos si el result es el esperado.
            if (!result) throw 'ERROR_ADD_USER_INDEXEDDB';

            // Hacemos Clear a la Tabla Users
            return this.databaseService.ClearVoyagesIndexedDB();
          }
        ), mergeMap(
          (result: boolean) => {
            // Revisamos si el result es el esperado.
            if (!result) throw 'ERROR_CLEAR_INDEXEDDB';

            // Agregamos los usuarios al indexedDB
            return this.databaseService.addVoyagesIndexedDB(this.getVoyages);
          }
        )
      ).subscribe(
        (result: boolean) => {

          // Revisamos si el result es el esperado.
          if (!result) throw 'ERROR_UPDATE_INDEXEDDB_IN_ONLINE';

          this.loadDataIndexedDB();

        },
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
  public SelectVoyage(event: AzList): void {
    console.log('SelectVoyage(event: AzList)');
  }

  public ClickSelectUser(userId: number): void {
    console.log('SelectUser(event: AzList)');
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

    let newVoyage = new Voyage();

    newVoyage.userId = this.selectUser.id;
    if (this.getVoyages && this.getVoyages.length > 0) { newVoyage.voyageNumber = this.getVoyages[0].voyageNumber + 1; }
    else { newVoyage.voyageNumber = 1; };
    newVoyage.year = Number(getYear());
    newVoyage.status = true;

    this.CreateVoyageOnlineOffline(newVoyage);

  }

  public ClickDeleteVoyage(event: AzList) {
    console.log('ClickDeleteVoyage(event: AzList)');

  }

  public ClickDelete(event: AzList) {
    console.log('ClickDelete(event: AzList)');


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
        new AzList(voyage.id, 'Voyage' + voyage.year + '-' + voyage.voyageNumber, '', '')
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

        this.disableEdit = true;

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
        (resultUserIndexedDB: Voyage) => {

          newVoyage = resultUserIndexedDB;

          // armamos el obj Azlist
          let azList = new AzList(voyage.id, 'Voyage' + voyage.year + '-' + voyage.voyageNumber, '', '');

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
  // Funciones para inicializar datos //
  //////////////////////////////////////
  // InitializeUser() : Iniziliza el objeto SailingAnality.
  private Initialize(): void {
    console.log('InitializeUser()');

    // Inicializo su valor.
    this.disableEdit = true;

    // limpiamos las validaciones,
    // deshabilitamos el formulario
    // Seteamos el formulario con los datos de this.user.
    // this.ReactiveForm(false, true, true, false, false, true, false); // REVISAR

    // actualizo el valor del InitializeSailingAnality.
    // this.initialUser = this.CollectUser();  // REVISAR
  }
}
