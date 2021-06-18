import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

// Components
import { ApplicationComponent } from './application.component';
import { ASideComponent } from '../shared/a-side/a-side.component';
import { UserComponent } from '../components/users/user/user.component';
import { AzListComponent } from '../shared/crud/az-list/az-list.component';
import { DialogDeleteComponent } from '../shared/dialog/delete/dialog-delete.component'
import { FileUploadComponent } from '../shared/file-upload/file-upload.component'

// Modules
import { GlobalModule } from '../global.module';

// Services
import { ASideService } from '../services/a-side.service';
import { DatabaseService } from '../services/database.service';
import { VoyageComponent } from '../components/voyages/voyage/voyage.component';
import { DialogListReportComponent } from '../shared/dialog/dialog-list-report/dialog-list-report.component';
import { ListOfConnectedUsersComponent } from '../shared/list-of-connected-users/list-of-connected-users.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DialogExportPdfComponent } from '../shared/dialog/dialog-export-pdf/dialog-export-pdf.component';
import { HelpsComponent } from '../components/helps/helps.component';
import { DashboardBunkeringComponent } from '../components/dashboard/dashboard-bunkering/dashboard-bunkering.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    DashboardComponent,
    ASideComponent,
    AzListComponent,
    UserComponent,
    DialogDeleteComponent,
    FileUploadComponent,
    VoyageComponent,
    DialogListReportComponent,
    ListOfConnectedUsersComponent,
    DialogExportPdfComponent,
    HelpsComponent,
    DashboardBunkeringComponent,
  ],
  imports: [
    GlobalModule,
    CommonModule,
    ApplicationRoutingModule,
    GoogleMapsModule
  ],
  providers: [ASideService, DatabaseService],
  bootstrap: [ApplicationComponent]
})
export class ApplicationModule { }
