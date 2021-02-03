import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

// Components
import { ApplicationComponent } from './application.component';
import { ASideComponent } from '../shared/a-side/a-side.component';



@NgModule({
  declarations: [DashboardComponent, ApplicationComponent, ASideComponent],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
  ]
})
export class ApplicationModule { }
