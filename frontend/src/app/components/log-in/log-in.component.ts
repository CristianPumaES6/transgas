import { Component, OnInit } from '@angular/core';

// ============== COMUNES ==============

// Router
import { ActivatedRoute, Router } from '@angular/router';

// Components Shared
import { LoadingService } from '../../services/loading.service';
import { LanguageService } from '../../services/language.service';

// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';

// Librerias
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
// =====================================


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'logIn';


  constructor(
    private loadingService: LoadingService,
    private languageService: LanguageService
  ) {
    console.log("constructor()")

  }

  ngOnInit(): void {
    console.log('ngOnInit()');
    alert(this.languageService.GetMessage(this.translateCategory, 'LOG_IN'))
  }

}
