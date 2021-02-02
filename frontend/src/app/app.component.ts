import { Component } from '@angular/core';

// Servicio de Loading.
import { LoadingComponent } from './shared/loading/loading.component';
import { LoadingService } from './services/loading.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';


  constructor(
    private loadingService: LoadingService
  ) {
    console.log('constructor()');


  };



  // OnLoadingLoaded => Funcion que inicia el loading.service.
  public OnLoadingLoaded(loading: LoadingComponent): void {
    console.log('OnLoadingLoaded(loading: LoadingComponent)');


    // Cuando se carga el formulario modal, capturo la referencia y se la envio al servicio
    this.loadingService.Initialize(loading);
  }
}
