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
          let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, err || 'ERROR_ON_LOAD'));

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

  // Funciones para inicializar datos //
  //////////////////////////////////////
  // InitializeUser() : Iniziliza el objeto SailingAnality.
  private InitializeUser(): void {
    console.log('InitializeUser()');

    // Inicializo su valor.
    this.disableEdit = true;

    // actualizo el valor del InitializeSailingAnality.
    this.initialUser = this.CollectUser();
  }

  // CollectUser() : Arma un objeto User con los datos correspondiente a la pantalla.
  private CollectUser(): User {
    console.log('CollectUser()');

    let User: User = this.user;

    // Retorno el objeto
    return JSON.parse(JSON.stringify(User));
  }

  // ModifiedUser() : Verifica si el usuario a sido modificado.
  private ModifiedUser(): boolean {
    // Armo objeto para pasarle al servicio
    let userToSave: User = this.CollectUser();
    // Comparo los objetos antes y despues
    return !(JSON.stringify(userToSave) === JSON.stringify(this.initialUser));
  }

  // ================[ FIN ] ================
  // ==============  Comun Formulario ====================
  public SelectUser(event: AzList): void {
    console.log('SelectUser(event: AzList)');

    // abrimos el formulario solo para modal.
    this.aSideService.OpenClose('open-formulario');

    // Buscamos en el arreglo el objeto al cual le dimos click.
    this.user = this.getUsers.find(
      (user: User) => {
        return user.id == event.id;
      }
    );

    // para no afectar a original. Valores por referencias.
    this.user = JSON.parse(JSON.stringify(this.user));

    // Inicializa los valores del User.
    this.InitializeUser();
  }

  // click new
  public ClickNew(): boolean {
    console.log('ClickNew()');

    // Creamos un nuevo usuario.
    this.user = new User(null, '', '', '', '', '', true, null);

    // Inicializamos los datos user.
    this.InitializeUser();

    // Habilitamos el formulario.
    this.disableEdit = false;

    return false
  }

  // habilitar el formulario.
  public ClickEnableFrm(): boolean {
    console.log('ChangeDisableFrm()');

    this.disableEdit = false;

    return false;
  }



  // DiscardUser(): Descarta el formulario.
  public ClickDiscardUser(): boolean {
    console.log('ClickDiscardUser()');

    // Valido si algun elemento se cambio
    if (this.ModifiedUser()) {

      var opcion = confirm(this.languageService.GetMessage(this.translateCategory, 'CHANGES_WITHOUT_SAVING'));
      if (opcion == true) {
        // Reset user
        if (this.user.id) {
          this.user = this.initialUser;
        } else {
          // Limpiamos el obj User
          this.user = new User();
        }

        // bloqueamos el formulario
        this.disableEdit = true;
      } else {
        // sigues en la pagina.
      }
    } else {
      // Reset user
      if (this.user.id) {
        this.user = this.initialUser;
      } else {
        // Limpiamos el obj User
        this.user = new User();
      }
      // Si no hubo cambios solo navego

      this.disableEdit = true;
    }

    // Devuelvo false
    return false;
  }

  // SaveUser(): Crea o actualiza un user.
  public ClickSaveUser(): boolean {
    console.log('SaveUser()');

    // Armo objeto para pasarle al servicio
    let userToSave: User = this.CollectUser();

    // Habilito el spinner de loading
    this.loadingService.Open();


    // Verifico si es para actualizar
    if (this.user.id) {
      this.UpdateUserOnelineOffline(userToSave);
    } else {
      this.CreateUserOnlineOffline(userToSave);
    }

    // Devuelvo false
    return false;
  }

  private UpdateUserOnelineOffline(userToSave: User) {

    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (!!window.navigator.onLine) {

      // Guardo el objeto obtenido
      this.userService.SaveUser(userToSave).subscribe(
        (result: User) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_USER_SAVE'));

          // Filtro y actualizo luego lo agrego al arreglo.
          this.getUsers = this.getUsers.map(
            (user: User) => {
              // Buscamos el id para cambiar el valor de result.
              if (user.id === result.id) {
                // Actualizamos el valor con el resultado
                user = result;
              }

              return user;
            }
          );
          this.databaseService.updateUserIndexedDB(result);

          // Actualizamos la lista del azlist
          this.azLists = this.azLists.map(
            (azList: AzList) => {

              // Buscamos el id para cambiar el valor de result.
              if (azList.id === result.id) {
                // Actualizamos el valor con el resultado
                azList = new AzList(result.id, result.name, result.role, '')
              }

              return azList;
            }
          )

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Si no hubo cambios solo navego
          this.InitializeUser();
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_UPDATE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    } else {
      // Le agregamos un stado Sync
      this.user.syncStatus = 'updated';

      this.databaseService.updateUserIndexedDB(this.user).then(
        result => {

          // Muestro notificación
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_USER_SAVE_LOCAL'));

          // Filtro y actualizo luego lo agrego al arreglo.
          this.getUsers = this.getUsers.map(
            (user: User) => {
              // Buscamos el id para cambiar el valor de result.
              if (user.id === result.id) {
                // Actualizamos el valor con el resultado
                user = result;
              }

              return user;
            }
          );


          // Actualizamos la lista del azlist
          this.azLists = this.azLists.map(
            (azList: AzList) => {

              // Buscamos el id para cambiar el valor de result.
              if (azList.id === result.id) {
                // Actualizamos el valor con el resultado
                azList = new AzList(result.id, result.name, result.role, '')
              }

              return azList;
            }
          )

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Si no hubo cambios solo navego
          this.InitializeUser();
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_UPDATE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        })

    }
  }

  private CreateUserOnlineOffline(userToSave: User) {


    if (!!window.navigator.onLine) {


      // Guardo el objeto obtenido
      this.userService.CreateUser(userToSave).subscribe(
        (result: User) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_USER_CREATE'));

          // Lo agrego al arreglo.
          this.getUsers.push(result);

          this.azLists.push(new AzList(result.id, result.name, result.role, ''));

          this.databaseService.addUserIndexedDB(result);

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // vuelvo a cargar los datos de incio del token.
          this.InitializeUser();
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_CREATE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });


    } else {

      // Le agregamos un stado Sync
      this.user.syncStatus = 'added';
      delete this.user.id;

      this.databaseService.addUserIndexedDB(this.user).then(
        (result: User) => {

          this.user = result;
          // Muestro notificación
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_USER_CREATE_LOCAL'));

          // Lo agrego al arreglo.
          this.getUsers.push(result);

          this.azLists.push(new AzList(result.id, result.name, result.role, ''));

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // vuelvo a cargar los datos de incio del token.
          this.InitializeUser();
        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_CREATE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });

    }
  }
}
