import { Component, Input } from '@angular/core';

// Servicio de Loading.
import { LoadingComponent } from './shared/loading/loading.component';
import { LoadingService } from './services/loading.service'

// Moldes
import { User } from './models/user'
// Service
import { AuthService } from './services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Transgas';


  @Input()
  public loggedUser: User;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
  ) {
    console.log('constructor()');


  };


  // Configuracion para las notificaciones
  public notificationOpts = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true
  };


  ngOnInit() {console.log('ngOnInit()');
  
    this.loggedUser = this.authService.GetLoggedUser();
  }
/* 
  ngDoCheck() {console.log('ngDoCheck()');
  
    this.loggedUser = this.authService.GetLoggedUser();
  }
 */
  logout() {console.log('logout()');
  
    this.authService.Logout();
    this.loggedUser = this.authService.GetLoggedUser();
  }

  // OnLoadingLoaded => Funcion que inicia el loading.service.
  public OnLoadingLoaded(loading: LoadingComponent): void {
    console.log('OnLoadingLoaded(loading: LoadingComponent)');


    // Cuando se carga el formulario modal, capturo la referencia y se la envio al servicio
    this.loadingService.Initialize(loading);
  }
}
