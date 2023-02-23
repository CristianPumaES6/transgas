import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components CRUD
import { LogInComponent } from './components/log-in/log-in.component';
import { IsLoginGuard } from './guard/is-login.guard';

import { IsUpdateServerGuard } from './guard/is-update-server.guard';

// Guard


const routes: Routes = [
  { path: '', component: LogInComponent, canActivate: [IsUpdateServerGuard,IsLoginGuard]},
  { path: 'application', redirectTo: '/application', pathMatch: 'full' },
  { path: 'application/**', redirectTo: '/application', pathMatch: 'full' },
];
export class AppRoutingModule { }
