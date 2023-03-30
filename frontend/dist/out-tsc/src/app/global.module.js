import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// Module
import { SimpleNotificationsModule } from 'angular2-notifications';
// ServiWorker
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// Components Shared
import { LoadingComponent } from './shared/loading/loading.component';
// ANGULAR
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer'; // <-- Import PdfJsViewerModule module
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// Services
import { LoadingService } from './services/loading.service';
// Pipes
import { TranslateMessagePipe } from './pipes/language.pipe';
// Este modulo permite compartir declaraciones con otro modulo.
let GlobalModule = class GlobalModule {
};
GlobalModule = __decorate([
    NgModule({
        declarations: [
            // Components
            LoadingComponent,
            // Pipe
            TranslateMessagePipe
        ],
        imports: [
            CommonModule, HttpClientModule,
            // PWA
            ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
            // Module
            SimpleNotificationsModule.forRoot(),
            ReactiveFormsModule,
            // ANGULAR MATERIAL  
            BrowserAnimationsModule,
            MatFormFieldModule, MatInputModule, MatIconModule,
            MatProgressSpinnerModule, MatSnackBarModule, MatSidenavModule,
            MatListModule, MatSelectModule, MatDatepickerModule,
            MatNativeDateModule, MatTableModule, MatTooltipModule,
            MatButtonToggleModule, MatSlideToggleModule, MatCheckboxModule,
            MatButtonModule, FormsModule, ReactiveFormsModule,
            MatDialogModule, MatProgressBarModule, MatStepperModule,
            PdfJsViewerModule, MatRadioModule, MatAutocompleteModule
        ],
        exports: [
            HttpClientModule,
            // Module
            SimpleNotificationsModule,
            ReactiveFormsModule,
            // Components
            LoadingComponent,
            // Pipe
            TranslateMessagePipe,
            // ANGULAR MATERIAL  
            BrowserAnimationsModule,
            MatFormFieldModule, MatInputModule, MatIconModule,
            MatProgressSpinnerModule, MatSnackBarModule, MatSidenavModule,
            MatListModule, MatSelectModule, MatDatepickerModule,
            MatNativeDateModule, MatTableModule, MatTooltipModule,
            MatButtonToggleModule, MatSlideToggleModule, MatCheckboxModule,
            MatButtonModule, FormsModule, ReactiveFormsModule,
            MatDialogModule, MatProgressBarModule, MatStepperModule,
            PdfJsViewerModule, MatRadioModule, MatAutocompleteModule
        ],
        providers: [LoadingService]
    })
], GlobalModule);
export { GlobalModule };
//# sourceMappingURL=global.module.js.map