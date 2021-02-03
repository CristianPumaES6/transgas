import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { ApplicationComponent } from '../application/application.component'

import { DashboardComponent } from '../components/dashboard/dashboard.component'

const routes: Routes = [
  {
    path: 'application', component: ApplicationComponent,
    children: [
      { path: '', component: DashboardComponent },
      // Dashboard de la pagina
      { path: 'dashboard', component: DashboardComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
