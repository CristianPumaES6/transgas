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
import { ConsumptionAnalysisComponent } from '../components/dashboard/consumption-analysis/consumption-analysis.component';
import { OverviewComponent } from '../components/dashboard/overview/overview.component';
import { LubricantAnalysisComponent } from '../components/dashboard/lubricant-analysis/lubricant-analysis.component';

import { MigrationComponent } from '../components/migration/migration.component';

const routes: Routes = [
  {
    path: 'application', component: ApplicationComponent, canActivate: [IsUpdateServerGuard, LoginGuard],
    children: [
      { path: 'migration', component: MigrationComponent },

      // se esta agregando el canActive para saber si es un buque y redireccione a voyages.
      { path: '', component: DashboardComponent, canActivate: [IsBuqueGuard] },
      // Dashboard de la pagina
      { path: 'dashboard/overview', component: OverviewComponent },
      { path: 'dashboard/general_analysis', component: DashboardComponent },
      { path: 'dashboard/speed_analysis', component: SpeedAnalysisComponent },
      { path: 'dashboard/consumer_analysis', component: ConsumptionAnalysisComponent },
      { path: 'dashboard/oil_lubricant_analysis', component: LubricantAnalysisComponent },
      // Modulo de viaje
      { path: 'voyages', component: VoyageComponent },
      // Modulo de Usuario
      { path: 'users', component: UserComponent },
      // Modulo de ayuda
      { path: 'helps', component: HelpsComponent },

      // Modulo para detectar los usuarios conectados.
      { path: 'users/who-are-connected', component: ListOfConnectedUsersComponent },
      { path: '**', component: DashboardComponent, canActivate: [IsBuqueGuard] },
    ],

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule {

}
