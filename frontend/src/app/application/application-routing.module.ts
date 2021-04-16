import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { ApplicationComponent } from '../application/application.component'

import { DashboardComponent } from '../components/dashboard/dashboard.component'
import { VoyageComponent } from '../components/voyages/voyage/voyage.component'
import { UserComponent } from '../components/users/user/user.component';
import { LoginGuard } from '../guard/login.guard';
import { IsBuqueGuard } from '../guard/is-buque.guard';

const routes: Routes = [
  {
    path: 'application', component: ApplicationComponent, canActivate: [LoginGuard],
    children: [
      // se esta agregando el canActive para saber si es un buque y redireccione a voyages.
      { path: '', component: DashboardComponent, canActivate: [IsBuqueGuard] },
      // Dashboard de la pagina
      { path: 'dashboard', component: DashboardComponent },
      { path: 'voyages', component: VoyageComponent },
      { path: 'users', component: UserComponent },
      { path: 'helps', component: DashboardComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule {

}
