import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
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
export class ListOfConnectedUsersComponent implements OnInit{

  @ViewChild('myDivContent') htmlMyDivContent: ElementRef;
  
  //======== VARIABLES DE TRADUCCION=============
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'users';
  //=================[ FIN ]=====================

  // Usuarios logeados
  public getLoggedUsers:LoggedUser[]=[];

  // zomm actual
  public zoom = 12;
  public center;
  public options: {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };

  // Configuracion Maker 
  public marker = {
    position: {
      lat: 0,
      lng: 0,
    },
    label: {
      color: '',
      text: '',
    },
    title: '',
    options: { animation: null }//{ animation: google.maps.Animation.BOUNCE },
  };

  constructor(
    private readonly authService: AuthService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private _renderer2: Renderer2, 
    ) { }

  ngOnInit(): void {
  
    console.log('ngOnInit()');

    let script = this._renderer2.createElement('script');
    script.type = 'application/javascript';
    script.src = 'https://maps.google.com/maps/api/js?sensor=false';

    // this.htmlMyDivContent.nativeElement.innerHTML = "Hello Angular 10!";
    // this._renderer2.appendChild(this.htmlMyDivContent, script);

    // Activamos el loading.
    this.loadingService.Open();

    // Verifico si estamos conexion a internet, si es asi descargo los usuarios.
    if (!!window.navigator.onLine) {

      Promise.resolve(true).then(
        result => {
          // Traigo a todos los User y lo instancio en el obj.
          return this.EmitConnect().pipe().toPromise();
        }
      ).then(
        result => {
          
          setTimeout( () => {

              // Traigo a todos los User y lo instancio en el obj.
              this.GetLoggedUsers().pipe().toPromise();
              // Activamos el loading.
              this.loadingService.Close();

            }, 5000 );

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

  public SelectUser(index){

    console.log('SelectUser(index)');
    console.log(this.getLoggedUsers);
    console.log(index);
    console.log(this.getLoggedUsers[index].lat);
    console.log(this.getLoggedUsers[index].lng);

    this.center = {
      lat: this.getLoggedUsers[index].lat,
      lng: this.getLoggedUsers[index].lng,
    }

    this.marker = {
      position: {
        lat: this.getLoggedUsers[index].lat,
        lng: this.getLoggedUsers[index].lng,
      },
      label: {
        color: 'red',
        text: 'Marker label ',
      },
      title: 'Marker title ',
      options: {
         animation: google.maps.Animation.BOUNCE 
      },
    };

  }

  // GetUsers: Cargo todos los Users para el listado de Users.
  private EmitConnect(): Observable<boolean> {
    console.log('EmitConnect()');

    // Consulto la lista de paises para cargar combo
    return this.authService.EmitConnect().pipe(map(
      (resultEmitConnect: boolean) => {


        // Segun el resultado retornamos la respuesta.
        return resultEmitConnect;
      }
    ));
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


  public zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++
  }

  public zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--
  }

}
