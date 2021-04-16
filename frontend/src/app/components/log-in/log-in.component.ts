import { Component, OnInit } from '@angular/core';

// ============== COMUNES ==============
// Router
import { ActivatedRoute, Router } from '@angular/router';

// Components Shared
import { LoadingService } from '../../services/loading.service';
import { LanguageService } from '../../services/language.service';

// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';

// Librerias
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
// =====================================
// Models
import { Login } from '../../models/user'

//Service
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'logIn';


  // Armo modelo Login
  public login: Login = new Login();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
  ) {
    console.log("constructor()");

  }

  ngOnInit(): void {
    console.log('ngOnInit()');

  }


  // Cambiar lenguaje
  public ChangeLanguage(language: string) {
    console.log("ChangeLanguage(language: string)");

    // Usamos un servicio de language ya creado.
    this.languageService.SetCurrentLanguage(language);
    location.reload();

  }

  public Login(): boolean {
    console.log('Login()');

    this.loadingService.Open();

    // Mando a hacer el login
    this.authService.Login(this.login)
      .subscribe(
        result => {
          // Verifico si el login fue exitoso
          if (result) {
            // Muestro notificación
            this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_LOGIN').replace('{{NAME}}', result.name));
            // Al logearse un buque te redirecciona al modulo de voyages
            if (result.role === 'BUQUE') {
              this.router.navigate(['./application/voyages'], { relativeTo: this.activatedRoute });
            } else {

              // Todo OK, navego al home
              this.router.navigate(['./application'], { relativeTo: this.activatedRoute });
            }
          } else {
            // Algo fallo, muestro mensaje de error
            throw 'LOGIN_FAILED';
          }

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        },
        error => {
          // Mensaje de error generico
          let errMsg: string = this.languageService.GetMessage(this.translateCategory, 'ERROR_CONNECTION');
          // Verifico si hubo error de conexion HTTP y muestro mensaje
          if (error.status === 0)
            this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), errMsg);
          else if (error.status > 0)
            this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), errMsg); // Quite estas opciones error.error && error.error.error ||  =>
          // Deshabilito flag de processing
          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    // Devuelvo false para anular la acción del botón
    return false;
  }

}
