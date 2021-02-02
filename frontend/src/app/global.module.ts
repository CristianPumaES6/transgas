import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Este modulo permite compartir declaraciones con otro modulo.
@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),    
        BrowserAnimationsModule,
    ],
    exports: [    
        BrowserAnimationsModule,

    ]
})
export class GlobalModule { }
