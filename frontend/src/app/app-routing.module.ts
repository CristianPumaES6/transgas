import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components CRUD
import { LogInComponent } from './components/log-in/log-in.component';

const routes: Routes = [
  { path: '', component: LogInComponent},
  { path: 'application', redirectTo: '/application', pathMatch: 'full' },
  { path: 'application/**', redirectTo: '/application', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
