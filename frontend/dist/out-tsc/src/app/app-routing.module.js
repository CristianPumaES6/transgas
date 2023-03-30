import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// Components CRUD
import { LogInComponent } from './components/log-in/log-in.component';
import { IsLoginGuard } from './guard/is-login.guard';
import { IsUpdateServerGuard } from './guard/is-update-server.guard';
// Guard
const routes = [
    { path: '', component: LogInComponent, canActivate: [IsUpdateServerGuard, IsLoginGuard] },
    { path: 'application', redirectTo: '/application', pathMatch: 'full' },
    { path: 'application/**', redirectTo: '/application', pathMatch: 'full' },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map