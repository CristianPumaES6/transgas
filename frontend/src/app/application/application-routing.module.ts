import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { ApplicationComponent } from '../application/application.component'

import { DashboardComponent } from '../components/dashboard/dashboard.component'
import { VoyageComponent } from '../components/voyages/voyage/voyage.component'
import { UserComponent } from '../components/users/user/user.component';
import { LoginGuard } from '../guard/login.guard';
import { IsBuqueGuard } from '../guard/is-buque.guard';
import { ListOfConnectedUsersComponent } from '../shared/list-of-connected-users/list-of-connected-users.component';
import { HelpsComponent } from '../components/helps/helps.component';
import { IsUpdateServerGuard } from '../guard/is-update-server.guard';
import { SpeedAnalysisComponent } from '../components/dashboard/speed-analysis/speed-analysis.component';

const routes: Routes = [
  {
    path: 'application', component: ApplicationComponent, canActivate: [IsUpdateServerGuard, LoginGuard],
    children: [
      // se esta agregando el canActive para saber si es un buque y redireccione a voyages.
      { path: '', component: DashboardComponent, canActivate: [IsBuqueGuard] },
      // Dashboard de la pagina
      { path: 'dashboard/consumer_analysis', component: DashboardComponent },
      { path: 'dashboard/speed_analysis', component: SpeedAnalysisComponent },
      // Modulo de viaje
      { path: 'voyages', component: VoyageComponent },
      // Modulo de Usuario
      { path: 'users', component: UserComponent },
      // Modulo de ayuda
      { path: 'helps', component: HelpsComponent },

      // Modulo para detectar los usuarios conectados.
      { path: 'users/who-are-connected', component: ListOfConnectedUsersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule {

}
