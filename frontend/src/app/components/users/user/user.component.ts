// Angular
import { Component, OnInit } from '@angular/core';
// Router
import { ActivatedRoute, Router } from '@angular/router';

// ============== COMUNES ==============
// Components Shared
import { AzListComponent } from "../../../shared/crud/az-list/az-list.component";
import { LoadingService } from '../../../services/loading.service';
import { LanguageService } from '../../../services/language.service';
import { ASideService } from '../../../services/a-side.service'

// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';

// Librerias
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

// Models
import { SettingAzList, azListDropdown, AzList } from '../../../models/azlist';
import { User } from 'src/app/models/user';

// Services
import { DatabaseService } from '../../../services/database.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // rol del usuario.
  public roleUser: string = '';

  //======== VARIABLES DE TRADUCCION===========
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'user';
  //=================[ FIN ]=====================



  // Datos del user
  public user: User = new User();
  // Lista de los datos del usuario
  public getUsers: User[] = [];
  // Datos para inicializar el objeto User
  private initialUser: User = <User>{};

  //======== Datos para el componente azList ===========

  public SettingAzList: SettingAzList = new SettingAzList(["Application", "Users"], "Users", true, false, "New user", "", false, "", true);
  public azLists: AzList[] = [];

  // =========================================

  // Esta variable permite habilita la edicion en el formulario.
  public disableEdit: boolean = true;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private userService: UserService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private aSideService: ASideService,
  ) {
    console.log('User Constructor()');

  }

  ngOnInit(): void {
    console.log('ngOnInit()');

    // Activamos el loading.
    this.loadingService.Open();

    // si el aSide esta abierto lo cerramos.
    this.aSideService.Close();

    // Obtenemos el rol del usuario.
    this.roleUser = this.userService.GetIdentity().role;



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

              // Generamos el azList
              this.generateAzListBycUsers(this.getUsers);

              // Sincronizamos todos los datos que falten sincronizar.
              return this.databaseService.Sync();
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
        )
      ).subscribe(
        (result: boolean) => {
          // Revisamos si el result es el esperado.
          if (!result) throw 'ERROR_UPDATE_INDEXEDDB_IN_ONLINE';


          // Inicializo el SailingAnality
          this.InitializeUser();

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        },
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
      forkJoin([
        of(true)
      ]).pipe(
        mergeMap(
          (result: boolean[]) => {
            if (result) {

              // Obtengo resultados de las funciones
              let resulGetSailingAnalities: boolean = result[0];
              // Evaluo posibles errores en las ejecuciones
              if (!resulGetSailingAnalities) throw 'ERROR_GET_USERS';


              // Sincronizamos todos los datos que falten sincronizar.
              return this.databaseService.getUsersIndexDB();
            } else {
              throw this.languageService.GetMessage(this.translateCategory, 'ERROR_RESULT_GET');
            }
          }
        ),
        mergeMap(
          (users: User[]) => {
            if (users.length > 0) {

              this.getUsers = users;
              // Generar lista por usuarios.
              this.generateAzListBycUsers(this.getUsers);

              return of(true);
            } else {
              throw this.languageService.GetMessage(this.translateCategory, 'ERROR_GET_USERS_INDEXEDDB');
            }
          }
        )
      ).subscribe(
        (result: boolean) => {


          // Inicializo el SailingAnality
          this.InitializeUser();

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        },
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


  // Funciones para inicializar datos //
  //////////////////////////////////////
  // InitializeUser() : Iniziliza el objeto SailingAnality.
  private InitializeUser(): void {
    console.log('InitializeUser()');

    // Inicializo su valor.
    this.disableEdit = true;
    // actualizo el valor del InitializeSailingAnality.
    this.user = this.CollectUser();
  }

  // CollectUser() : Arma un objeto User con los datos correspondiente a la pantalla.
  private CollectUser(): User {
    console.log(' CollectUser()');

    let newUser: User = this.user;

    // Retorno el objeto
    return newUser;
  }
  // ================[ FIN ] ================


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

  // Azlist
  private generateAzListBycUsers(users: User[]) {
    console.log('generateAzListBycUsers(users: User[])');

    // vaciamos el objeto
    this.azLists = [];

    // Armo un obj azList.
    users.forEach((user: User) => {
      this.azLists.push(
        new AzList(user.id, user.name, user.role, '')
      );
    });
  }
}
