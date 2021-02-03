import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Module
import { SimpleNotificationsModule } from 'angular2-notifications';

// ServiWorker
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Components Shared
import { LoadingComponent } from './shared/loading/loading.component';

// ANGULAR
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { LoadingService } from './services/loading.service';

// Pipes
import { TranslateMessagePipe } from './pipes/language.pipe';


// Este modulo permite compartir declaraciones con otro modulo.
@NgModule({
    declarations: [
        // Components
        LoadingComponent,
        // Pipe
        TranslateMessagePipe
    ],
    imports: [
        CommonModule,
        // PWA
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        // Module
        SimpleNotificationsModule.forRoot(),
        // ANGULAR MATERIAL  
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
    ],
    exports: [
        // Module
        SimpleNotificationsModule,
        // Components
        LoadingComponent,
        // Pipe
        TranslateMessagePipe,
        // ANGULAR MATERIAL  
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
    ],
    providers: [LoadingService]
})
export class GlobalModule { }
