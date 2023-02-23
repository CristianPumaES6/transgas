import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { GlobalModule } from './global.module';

import { AuthGuardService } from './services/auth-guard.service';
import { ApplicationModule } from './application/application.module';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent
  ],
  imports: [
    GlobalModule,
    BrowserModule,
    AppRoutingModule,
    ApplicationModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
