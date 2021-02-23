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
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { DialogData, DialogDeleteComponent } from '../../../shared/dialog/delete/dialog-delete.component';

// Librerias
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

// Models
import { SettingAzList, azListDropdown, AzList } from '../../../models/azlist';
import { User } from '../../../models/user';

// Services
import { DatabaseService } from '../../../services/database.service';
import { UserService } from '../../../services/user.service';
import { OnlineOfflineService } from '../../../services/online-offline.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // rol del usuario.
  public roleUser: string = '';

  //======== VARIABLES DE TRADUCCION=============
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
  public SettingAzList: SettingAzList = new SettingAzList(["Application", "Users"], "Users", true, false, 
  this.languageService.GetMessage(this.translateCategory, 'NEW_USER'), "", false, "", true,
  this.languageService.GetMessage(this.translateCategory, 'TOOLTIP_DELETE_USER'));
  public azLists: AzList[] = [];

  // ===================================================
  // Esta variable permite habilita la edicion en el formulario.
  public disableEdit: boolean = true;

  // Variable del grupo de formulario.
  public formUser: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private onlineOfflineService: OnlineOfflineService,
    private userService: UserService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private aSideService: ASideService,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    console.log('User Constructor()');
    // subscribe receives the value. sirve para recibir algun emit
    this.onlineOfflineService.emitterReloadData.subscribe(
      (isOnline: boolean) => {
        this.loadDataIndexedDB();
        console.log('Hacer reloadd______________');
      }
    );
  }

  ngOnInit(): void {
    console.log('ngOnInit()');

    // Activamos el loading.
    this.loadingService.Open();

    // si el aSide esta abierto lo cerramos.
    this.aSideService.Close();

    // Obtenemos el rol del usuario.
    this.roleUser = this.userService.GetIdentity().role;

    // Inicializamos y bloqueamos el formulario.
    this.ReactiveForm(true, false, true);

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


          new PerfectScrollbar('.az-contact-info-body', {
            suppressScrollX: true
          })

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

    } else {
      this.loadDataIndexedDB();

    }

  }


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
          this.generateAzListBycUsers(this.getUsers);

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
        this.InitializeUser();

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

  // Azlist
  private generateAzListBycUsers(users: User[]) {
    console.log('generateAzListBycUsers(users: User[])');

    // vaciamos el objeto
    this.azLists = [];

    // Armo un obj azList.
    users.forEach((user: User) => {
      this.azLists.push(
        new AzList(user.id, user.name, user.role, user.filename)
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

    // limpiamos las validaciones,
    // deshabilitamos el formulario
    // Seteamos el formulario con los datos de this.user.
    this.ReactiveForm(false, true, true, false, false, true, false);

    // actualizo el valor del InitializeSailingAnality.
    this.initialUser = this.CollectUser();
  }

  // CollectUser() : Arma un objeto User con los datos correspondiente a la pantalla.
  private CollectUser(): User {
    console.log('CollectUser()');

    // Obtenemos los datos del formulario
    this.ReactiveForm(false, false, false, false, true, false, false)

    // El objeto user lo seteamos.
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

  /* Reactive form */
  private ReactiveForm(initialize?: boolean, clearValidate?: boolean, disableForm?: boolean, enableForm?: boolean, getForm?: boolean, setForm?: boolean, validate?: boolean): boolean {
    console.log('ReactiveForm()');

    // Inicializamos el formUser, si lo hacemos 2 proboca error, creao que deberia ser con un update
    if (initialize) {
      this.formUser = this.fb.group({
        name: ['', [Validators.required]],
        nick: ['', [Validators.required]],
        password: ['', [Validators.required]],
        role: ['', [Validators.required]],
      });
    }

    // reseteamos la configuracion
    if (clearValidate) {
      this.formUser.reset({ onlySelf: true });
    }

    // deshabilitamos el formulario
    if (disableForm) {
      this.formUser.disable();
    }

    // Habilitamos el formulario
    if (enableForm) {
      this.formUser.enable();
    }

    // Obtenemos los valores del formulario
    if (getForm) {
      this.user.name = this.formUser.controls['name'].value;
      this.user.nick = this.formUser.controls['nick'].value;
      this.user.password = this.formUser.controls['password'].value;
      this.user.role = this.formUser.controls['role'].value;
    }

    // Seteamos los valores del formulario con los datos del user.
    if (setForm) {
      this.formUser.controls['name'].setValue(this.user.name);
      this.formUser.controls['nick'].setValue(this.user.nick);
      this.formUser.controls['password'].setValue(this.user.password);
      this.formUser.controls['role'].setValue(this.user.role);
    }

    // Validamos si el stado del formulario es VALID
    if (validate) {
      this.formUser.markAllAsTouched();
      return this.formUser.status == 'VALID';
    }

    return true;
  }

  /* Handle form errors in Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.formUser.controls[control].hasError(error);
  }
  // ================[ FIN ] ================
  // ==============  Funciones  AZLIST ====================
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
    this.user = new User();
    this.user.status = true;

    // abrimos el formulario solo para modal.
    this.aSideService.OpenClose('open-formulario');

    // Inicializamos los datos user.
    this.InitializeUser();
    // Habilitamos el formulario.
    this.disableEdit = false;

    // Solo habilitamos el formurio.
    this.ReactiveForm(false, false, false, true);

    return false
  }

  public ClickDeleteUser(event: AzList) {
    console.log('ClickDeleteUser(event: AzList)');

    // Buscamos el usuario que se desea eliminar.
    let userDelete: User = this.user = this.getUsers.find(
      (user: User) => {
        return user.id == event.id;
      }
    );

    let dialogData: DialogData = {
      color: "warning",
      icon: "icon-delete",
      title: this.languageService.GetMessage(this.translateCategory, 'COMFIMR_DELETE_TITLE_REPLACE').replace('[NAME]', userDelete.name),
      mensage: this.languageService.GetMessage(this.translateCategory, 'COMFIRM_DELETE_DESCRIPTION'),
    };

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(
      (result: Boolean) => {

        if (result) {
          this.DeleteUserOnlineOffline(userDelete);
        }
      });

  }
  // ======================================================


  // habilitar el formulario.
  public ClickEnableFrm(): boolean {
    console.log('ChangeDisableFrm()');

    this.disableEdit = false;
    // Habilitamos el formuario.
    this.ReactiveForm(false, false, false, true);

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

        // Inicializamos el user para que detecte la diferencia.
        this.InitializeUser();
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
      // Inicializamos el user para que detecte la diferencia.

      this.InitializeUser();
    }

    // Devuelvo false
    return false;
  }

  public ClickCheckMGO(): boolean {

    if (this.user.isConsumptionMGO) {
      this.user.isMEMGO = true;
      this.user.isAEMGO = true;
      this.user.isBoilerMGO = true;
      this.user.isIGMGO = true;
      this.user.isPowerPMGO = true;
      this.user.isOtherMGO = true;
    } else {
      this.user.isMEMGO = false;
      this.user.isAEMGO = false;
      this.user.isBoilerMGO = false;
      this.user.isIGMGO = false;
      this.user.isPowerPMGO = false;
      this.user.isOtherMGO = false;
      this.user.maxMGOConsumption = 0;
    }

    return true;
  }

  public ClickCheckIFO(): boolean {

    if (this.user.isConsumptionIFO) {
      // desactivo el otro tipo de gas
      this.user.isConsumptionLSFO = false;

      this.user.isMEIFO = true;
      this.user.isAEIFO = true;
      this.user.isBoilerIFO = true;
      this.user.isOtherIFO = true;

    } else {
      this.user.isMEIFO = false;
      this.user.isAEIFO = false;
      this.user.isBoilerIFO = false;
      this.user.isOtherIFO = false;
      this.user.maxIFOConsumption = 0;

    }

    return true;
  }

  public ClickCheckLSFO(): boolean {
    if (this.user.isConsumptionLSFO) {
      // desactivo el otro tipo de gas
      this.user.isConsumptionIFO = false;

      this.user.isMEIFO = true;
      this.user.isAEIFO = true;
      this.user.isBoilerIFO = true;
      this.user.isOtherIFO = true;
    } else {
      this.user.isMEIFO = false;
      this.user.isAEIFO = false;
      this.user.isBoilerIFO = false;
      this.user.isOtherIFO = false;
      this.user.maxIFOConsumption = 0;

    }
    return true;
  }
  // SaveUser(): Crea o actualiza un user.
  public ClickSaveUser(): boolean {
    console.log('SaveUser()');

    // Armo objeto para pasarle al servicio
    let userToSave: User = this.CollectUser();

    // Habilito el spinner de loading
    this.loadingService.Open();
    // Setemos los datos ademas hacemos una validacion y es correcto los campos del formualrio.
    if (this.ReactiveForm(false, false, false, false, false, false, true)) {
      // Verifico si es para actualizar
      if (this.user.id) {
        this.UpdateUserOnelineOffline(userToSave);
      } else {
        this.CreateUserOnlineOffline(userToSave);
      }
    } else {
      this.loadingService.Close();
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
                azList = new AzList(result.id, result.name, result.role, result.filename)
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

      Promise.resolve(true).then(
        () => {
          // Consultamos al userIndexDB para saber el estado del sync.
          return this.databaseService.getUserIndexDB(userToSave.id);
        }
      ).then(
        (userIndexedDB: User) => {
          // Verificamos el estado si es add que continue, caso contrario delete.
          if (userIndexedDB.syncStatus !== 'added') {
            userToSave.syncStatus = 'updated';
          } else {
            userToSave.syncStatus = 'added';
            // Corregir todo con then
          }

          // Actualizo el usuario
          return this.databaseService.updateUserIndexedDB(userToSave)
        }
      ).then(
        (resultUpdate: User) => {
          // Filtro y actualizo luego lo agrego al arreglo.
          this.getUsers = this.getUsers.map(
            (user: User) => {
              // Buscamos el id para cambiar el valor de result.
              if (user.id === resultUpdate.id) {
                // Actualizamos el valor con el resultado
                user = resultUpdate;
              }

              return user;
            }
          );

          // Actualizamos la lista del azlist
          this.azLists = this.azLists.map(
            (azList: AzList) => {

              // Buscamos el id para cambiar el valor de result.
              if (azList.id === resultUpdate.id) {
                // Actualizamos el valor con el resultado
                azList = new AzList(resultUpdate.id, resultUpdate.name, resultUpdate.role, resultUpdate.filename)
              }
              return azList;

            }
          )

          // Si no hubo cambios solo navego
          this.InitializeUser();
          // Deshabilito el spinner de loading
          this.loadingService.Close();
          // Muestro notificación
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_USER_SAVE_LOCAL'));

        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_DELETE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

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
          this.getUsers.unshift(result);

          this.azLists.unshift(new AzList(result.id, result.name, result.role, result.filename));

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
      userToSave.syncStatus = 'added';
      delete userToSave.id;

      Promise.resolve(true).then(
        () => {
          // Agregamos el usuario al indexedDB.
          return this.databaseService.addUserIndexedDB(userToSave)
        }
      ).then(
        (resultUserIndexedDB: User) => {

          // Lo agrego al arreglo.
          this.getUsers.unshift(resultUserIndexedDB);

          this.azLists.unshift(new AzList(resultUserIndexedDB.id, resultUserIndexedDB.name, resultUserIndexedDB.role, resultUserIndexedDB.filename));

          // vuelvo a cargar los datos de incio del token.
          this.InitializeUser();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Muestro notificación
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_USER_CREATE_LOCAL'));

        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_CREATE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );
    }

  }

  private DeleteUserOnlineOffline(userDelete: User) {

    if (!!window.navigator.onLine) {

      // Guardo el objeto obtenido
      this.userService.DeleteUser(userDelete).subscribe(
        (result: User) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_USER_DELETE'));

          // La siguiente linea de codigo eliminara un objeto del array.
          this.getUsers = this.getUsers.filter(
            (user: User) => {
              if (user.id === result.id) {
                return false;
              }
              return true;
            }
          )
          this.azLists = this.azLists.filter(
            azList => {
              if (azList.id === result.id) {
                return false;
              }
              return true;
            }
          );

          // Revisar como llega el usuario y si viaja en false.
          this.databaseService.updateUserIndexedDB(result);

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // vuelvo a cargar los datos de incio del token.
          this.InitializeUser();
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_DELETE');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });

    } else {

      Promise.resolve(true).then(
        () => {
          // Consultamos al userIndexDB para saber el estado del sync.
          return this.databaseService.getUserIndexDB(userDelete.id);
        }
      ).then(
        (userIndexedDB: User) => {
          // Verificamos el estado si es add que continue, caso contrario delete.
          if (userIndexedDB.syncStatus === 'added' || userIndexedDB.syncStatus === 'updated') {
            //userDelete.syncStatus = 'deleted';
          } else {
            userDelete.syncStatus = 'deleted';
            // Corregir todo con then
          }

          // le seteo el password por defecto y el estado a false.
          userDelete.status = false;

          // Actualizo el usuario con el estado en False.
          return this.databaseService.updateUserIndexedDB(userDelete);
        }
      ).then(
        (resultUpdate: User) => {

          // Elimino el usuario del arreglo.
          this.getUsers = this.getUsers.filter(
            (user: User) => {
              if (user.id === resultUpdate.id) {
                return false;
              }
              return true;
            }
          );
          this.azLists = this.azLists.filter(
            azList => {
              if (azList.id === resultUpdate.id) {
                return false;
              }
              return true;
            }
          )
          // Inicializo los datos.
          this.InitializeUser();

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          // Muestro notificación
          this.notificationsService.warn(this.languageService.GetMessage(this.translateCategory, 'WARNING'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_USER_DELETE_LOCAL'));

        }
      ).catch(
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_DELETE_LOCAL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    }

  }



  public onFileComplete(resultComplete: any) {

    const userToSave: User = this.user;
    userToSave.filename = resultComplete.data;

    Promise.resolve(true).then(
      () => {
        // Consultamos al userIndexDB para saber el estado del sync.
        return this.databaseService.updateUserIndexedDB(userToSave);
      }
    ).then(
      (resultUpdate: User) => {
        // Filtro y actualizo luego lo agrego al arreglo.
        this.getUsers = this.getUsers.map(
          (user: User) => {
            // Buscamos el id para cambiar el valor de result.
            if (user.id === resultUpdate.id) {
              // Actualizamos el valor con el resultado
              user = resultUpdate;
            }

            return user;
          }
        );

        // Actualizamos la lista del azlist
        this.azLists = this.azLists.map(
          (azList: AzList) => {

            // Buscamos el id para cambiar el valor de result.
            if (azList.id === resultUpdate.id) {
              // Actualizamos el valor con el resultado
              azList = new AzList(resultUpdate.id, resultUpdate.name, resultUpdate.role, resultUpdate.filename)
            }
            return azList;

          }
        )
        this.user.filename = resultUpdate.filename;

        // Si no hubo cambios solo navego
        this.InitializeUser();
        // Deshabilito el spinner de loading
        this.loadingService.Close();
      }
    ).catch(
      error => {
        // Valido si viene un mensaje de error
        let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_USER_IMAGE_SAVE');

        // Muestro notificación
        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

        // Deshabilito el spinner de loading
        this.loadingService.Close();
      }
    );

  }
}

