import { HostListener, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DetecteInactiveUserService {
  renderer: Renderer2;
  lastInteraction: Date = new Date();
  definedInactivityPeriod = 10000;

  constructor(
    private rendererFactory2: RendererFactory2,  
    private  router: Router){
 
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
      return interval(3000)
        .pipe(
          tap(() => console.log('here', new Date().getTime() - this.lastInteraction.getTime())),
          takeWhile(() => {
            if (
              (new Date().getTime() - this.lastInteraction.getTime()) > this.definedInactivityPeriod) {
                console.log('----------------------------')
                console.log('----------------------------')
                console.log('---------------PASO EL TIMEPO-------------')
                console.log('----------------------------')
                console.log('----------------------------')
                console.log('----------------------------')
            }
            return (new Date().getTime() - this.lastInteraction.getTime()) < this.definedInactivityPeriod;
          })
        );
     }


 
}
