import { HostListener, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import { LoadingService } from './loading.service';
import { OnlineOfflineService } from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export class DetecteInactiveUserService {
  renderer: Renderer2;
  lastInteraction: Date = new Date();

  // Tiempo de inactividad de 10 minutos.
  definedInactivityPeriod = 15000 * 1;

  constructor(
    private _LoadingService:LoadingService,
    private rendererFactory2: RendererFactory2,
    private router: Router,
    private _Online_offlineService: OnlineOfflineService,
    private _NotificationsService:NotificationsService,
    private _DatabaseService :DatabaseService) {
      
      
      _DatabaseService.ConsultarCuantosInsertFaltanAgregaroActualizaroEliminarEnElServidor()
      .then(
        result => {
          if(!result) throw 'Report this error to cristian, ERROR LOCAL BD QUERY'
        
          // Si la cantidad de registros locales es mayor o igual a 15 creamos el servicio de escucha para actualizar el server-
          let total = result.voyage + result.port + result.report;
          if(total >= 15){
            this.Inizializate();
          }
        }
      ).catch()
  }

  Inizializate(){
      // ESCUHA ALGUN MOVIMIENTO O TECLA; si escucha algo actualizamos la ultima fecha.
      this.renderer = this.rendererFactory2.createRenderer(null, null);
      this.renderer.listen('document', 'mousemove', (evt) => {
        this.lastInteraction = new Date();
      });
      this.renderer.listen('document', 'mousedown', (evt) => {
        this.lastInteraction = new Date();
      });
      this.renderer.listen('document', 'keypress', (evt) => {
        this.lastInteraction = new Date();
      });
      this.renderer.listen('document', 'DOMMouseScroll', (evt) => {
        this.lastInteraction = new Date();
      });
      this.renderer.listen('document', 'mousewheel', (evt) => {
        this.lastInteraction = new Date();
      });
      this.renderer.listen('document', 'touchmove', (evt) => {
        this.lastInteraction = new Date();
      });
      this.renderer.listen('document', 'MSPointerMove', (evt) => {
        this.lastInteraction = new Date();
      });
      // Subscribing here for demo only
      this.idlePoll().subscribe();
  }

  idlePoll() {
    // a un intervalo de cada 3 segundos
    return interval(5000)
      .pipe( 
        takeWhile(() => {
          if (
            (new Date().getTime() - this.lastInteraction.getTime()) > this.definedInactivityPeriod) {
             

              // Consulta si se encuentra en linea
              if(this._Online_offlineService.GetStatusOnline()){
                 this.EjectSync();
              }else {
                this.lastInteraction = new Date();
              }
             
          }
          return (new Date().getTime() - this.lastInteraction.getTime()) < this.definedInactivityPeriod;
        })
      );
  }

  // Sincroniza el proyecyo
  private async EjectSync(): Promise<boolean>{
    console.log('EjectSync():')
    this._LoadingService.Open();
    return await Promise.resolve(true).then(
      result => {

        // Ejecutamos la funcion con toda la data enviada por el time out
        return this._Online_offlineService.SyncDataForTimeOut();
      }
    ).then(
      result => {
        if(!result) throw 'ERROR SYNC DATA';
        this._LoadingService.Close();
        console.log('FIN EjectSync():');
        return true;
      }
    ).catch(
      err => {

        console.dir(err);

        this._NotificationsService.error('ERROR', err);
        
        this._LoadingService.Close();
        console.log('ERR EjectSync():')
        return false;
      }
    );
  }

}
