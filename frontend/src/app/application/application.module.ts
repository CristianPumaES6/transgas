import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

// Components
import { ApplicationComponent } from './application.component';
import { ASideComponent } from '../shared/a-side/a-side.component';
import { UserComponent } from '../components/users/user/user.component';
import { AzListComponent } from '../shared/crud/az-list/az-list.component';

// Modules
import { GlobalModule } from '../global.module';

// Services
import { ASideService } from '../services/a-side.service';
import { DatabaseService } from '../services/database.service';

@NgModule({
  declarations: [
    ApplicationComponent,
    DashboardComponent,
    ASideComponent,
    AzListComponent,
    UserComponent
  ],
  imports: [
    GlobalModule,
    CommonModule,
    ApplicationRoutingModule,
  ],
  providers: [ASideService,DatabaseService],
  bootstrap: [ApplicationComponent]
})
export class ApplicationModule { }
