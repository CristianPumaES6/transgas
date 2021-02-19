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
  // Lista de los datos del usuario
  public user: User = new User();
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

    // Obtenemos el rol del usuario.
    this.roleUser = this.userService.GetIdentity().role;

    // Configuracion AzList
    this.SettingAzList.azListBreadcrumbs = ['Application', 'Voyage'];
    this.SettingAzList.titleAzLists = this.languageService.GetMessage(this.translateCategory, 'VOYAGE_REGISTER');
    this.SettingAzList.isNew = true;
    this.SettingAzList.isBack = false;
    this.SettingAzList.toolTipNew = this.languageService.GetMessage(this.translateCategory, 'NEW_VOYAGE');
    this.SettingAzList.toolTipBack = ''
    this.SettingAzList.activateDropDown = this.roleUser === 'ADMIN' || this.roleUser === 'SUPPORT' ? true : false;
    this.SettingAzList.placeholderDropdown = this.languageService.GetMessage(this.translateCategory, (this.roleUser === 'ADMIN' || this.roleUser === 'SUPPORT' ? 'SELECT_BUQUE' : ''));
    this.SettingAzList.activateOptionDelete = true;


    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (!!window.navigator.onLine) {

      // Instanciamos el obj que usaremos.
      let user: User = new User();
      let voyage: Voyage = new Voyage();

      // UserID
      voyage.userId = this.userService.userIdentity.id;

      // Ejecuto todas las consultas para cargar datos segundarios
      forkJoin(
        [
          // Traigo a todos los User y lo instancio en el obj.
          this.GetUsers(user),
          // Traigo a todos los User y lo instancio en el obj.
          this.GetVoyages(voyage)
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

    }
  }

  // ==============  Funciones  AZLIST ====================
  public SelectVoyage(event: AzList): void {
    console.log('SelectVoyage(event: AzList)');
  }

  public ClickNew() {
    console.log('ClickNew(event: AzList)');
  }


  public ClickDeleteVoyage(event: AzList) {
    console.log('ClickDeleteVoyage(event: AzList)');

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

    Promise.resolve(true).then(
      () => {
        // Obtenemos los datos del usuario.
        return this.databaseService.getUsersIndexDB();
      }
    ).then(
      (users: User[]) => {
        if (users.length > 0) {

          this.getUsers = users;
          // Generar lista por usuarios.
          this.generateAzListDropdownsByUsers(this.getUsers);

          return true;
        } else {
          throw this.languageService.GetMessage(this.translateCategory, 'ERROR_GET_USERS_INDEXEDDB');
        }
      }
    ).then(
      () => {
        // Obtenemos los datos del usuario.
        return this.databaseService.getVoyagesIndexDB(); // Revisar
      }
    ).then(
      (voyages: Voyage[]) => {
        if (voyages.length > 0) {

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
        this.user = new User();
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

  private GetVoyages(voyage: Voyage): Observable<boolean> {
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
