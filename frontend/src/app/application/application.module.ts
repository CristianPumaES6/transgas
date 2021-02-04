import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

// Components
import { ApplicationComponent } from './application.component';
import { ASideComponent } from '../shared/a-side/a-side.component';

// Modules
import { GlobalModule } from '../global.module';

// Services
import { ASideService } from '../services/a-side.service';

@NgModule({
  declarations: [
    ApplicationComponent,
    DashboardComponent,
    ASideComponent
  ],
  imports: [
    GlobalModule,
    CommonModule,
    ApplicationRoutingModule,
  ],
  providers: [ASideService],
  bootstrap: [ApplicationComponent]
})
export class ApplicationModule { }
