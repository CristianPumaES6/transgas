import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { GlobalModule } from './global.module';

import { AuthGuardService } from './services/auth-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent
  ],
  imports: [
    GlobalModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
