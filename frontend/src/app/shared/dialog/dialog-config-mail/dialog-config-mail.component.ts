import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'src/app/models/user';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';

export interface IDialogConfigMail {
  user: User,
  mail: string,
  isActiveAutomaticMessageSend: boolean
}



@Component({
  selector: 'app-dialog-config-mail',
  templateUrl: './dialog-config-mail.component.html',
  styleUrls: ['./dialog-config-mail.component.scss']
})
export class DialogConfigMailComponent implements OnInit {

  public translateCategory: string = 'dialog';

  public user: User;
  public emails: string = "";
  public sendAutomatic = false;


  constructor(
    // Dialog referencia es el mismo.
    public dialogRef: MatDialogRef<DialogConfigMailComponent>,
    // Data que se importara.
    @Inject(MAT_DIALOG_DATA) public data: IDialogConfigMail,
    // servicio de lenguaje.
    private languageService: LanguageService,

    private dailyReportService: DailyReportService,
    // Servicios de notificaciones.
    private notificationsService: NotificationsService,
    // Loading service.
    private loadingService: LoadingService
  ) { }


  ngOnInit(): void {
    // Seleccionamos el puerto ID
    this.user = this.data.user;
  }


  public ClickSave() {
    
    this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'NEW_MODULE'), this.languageService.GetMessage(this.translateCategory, 'NEW_MODULE_DESCRIPTION'));
     
  }

  public ClickTest() {
    this.loadingService.Open();

    let error: boolean = false;
    if (!this.emails) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_EMAILS'));
      error = true;
    }

    if (!error) {

      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'NEW_MODULE'), this.languageService.GetMessage(this.translateCategory, 'NEW_MODULE_DESCRIPTION'));
     
      this.loadingService.Close();
 /*      this.dailyReportService.PostSendEmailLastVoyage(this.user.id, this.emails).subscribe(
        (resultSend: boolean) => {
          if (!Boolean(resultSend)) { throw 'ERROR SEND MAIL.' }

          this.loadingService.Close();
          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_TEST_SEND_EMAIL'));

        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });
 */
    } else {
      this.loadingService.Close();
    }
  }
}
