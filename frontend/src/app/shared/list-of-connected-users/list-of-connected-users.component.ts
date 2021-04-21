import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggedUser } from 'src/app/models/loggedUser';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-list-of-connected-users',
  templateUrl: './list-of-connected-users.component.html',
  styleUrls: ['./list-of-connected-users.component.scss']
})
export class ListOfConnectedUsersComponent implements OnInit {

  public getLoggedUsers:LoggedUser[]=[];

  //======== VARIABLES DE TRADUCCION=============
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'users';
  //=================[ FIN ]=====================

  constructor(
    private readonly authService: AuthService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService
    ) { }

  ngOnInit(): void {
    console.log('ngOnInit()');

    // Activamos el loading.
    this.loadingService.Open();

    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (!!window.navigator.onLine) {

      Promise.resolve(true).then(
        result => {

          // Traigo a todos los User y lo instancio en el obj.
          return this.GetLoggedUsers().pipe().toPromise();
        }
      ).then(
        result => {
          

          // Activamos el loading.
          this.loadingService.Close();

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

  }



  // GetUsers: Cargo todos los Users para el listado de Users.
  private GetLoggedUsers(): Observable<boolean> {
    console.log('GetUsers(user: User)');

    // Consulto la lista de paises para cargar combo
    return this.authService.GetUserConnection().pipe(map(
      (resultLoggedUser: LoggedUser[]) => {

        // Guardamos el valor en nuestra variable global.
        this.getLoggedUsers = resultLoggedUser || this.getLoggedUsers;

        // Segun el resultado retornamos la respuesta.
        return (this.getLoggedUsers !== null);
      }
    ));
  }


}
