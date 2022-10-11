import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'src/app/models/user';
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
  public mail: string = "cristian.puma.es6@gmail.com";
  public sendAutomatic = false;


  constructor(
    // Dialog referencia es el mismo.
    public dialogRef: MatDialogRef<DialogConfigMailComponent>,
    // Data que se importara.
    @Inject(MAT_DIALOG_DATA) public data: IDialogConfigMail,
    // servicio de lenguaje.
    private languageService: LanguageService,
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
    alert(
      "userID :" + this.user + "\n" +
      "mail :" + this.mail + "\n" +
      "sendAutomatic :" + this.sendAutomatic + "\n"
    );
  }
}
