import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { ApplicationComponent } from '../application/application.component'

import { DashboardComponent } from '../components/dashboard/dashboard.component'
import { UserComponent } from '../components/users/user/user.component';

const routes: Routes = [
  {
    path: 'application', component: ApplicationComponent,
    children: [
      { path: '', component: DashboardComponent },
      // Dashboard de la pagina
      { path: 'dashboard', component: DashboardComponent },
      { path: 'voyages', component: DashboardComponent },
      { path: 'users', component: UserComponent },
      { path: 'helps', component: DashboardComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
