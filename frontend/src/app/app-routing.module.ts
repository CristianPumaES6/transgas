import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components CRUD
import { SingUpComponent } from './components/sing-up/sing-up.component';

const routes: Routes = [
  { path: '', component: SingUpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
