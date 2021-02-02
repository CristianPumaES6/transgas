import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Components Shared
import { LoadingComponent } from './shared/loading/loading.component';

// ANGULAR
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { LoadingService } from './services/loading.service';

// Este modulo permite compartir declaraciones con otro modulo.
@NgModule({
    declarations: [
        // Components
        LoadingComponent,
    ],
    imports: [
        CommonModule,
        // PWA
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        // ANGULAR MATERIAL  
        BrowserAnimationsModule,
        MatProgressSpinnerModule
    ],
    exports: [
        // ANGULAR MATERIAL  
        BrowserAnimationsModule,
        MatProgressSpinnerModule,

        // Components
        LoadingComponent
    ],
    providers: [LoadingService]
})
export class GlobalModule { }
