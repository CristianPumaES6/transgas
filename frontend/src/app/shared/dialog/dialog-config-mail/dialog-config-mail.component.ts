import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { SendMessageEntity } from 'src/app/models/send-message';
import { User } from 'src/app/models/user';
import { DailyReportService } from 'src/app/services/daily-report.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SendMailService } from 'src/app/services/send-mail.sevice';

import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
export interface IDialogConfigMail {
  userId: number,
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
  public sendMailConfigInitial: SendMessageEntity = new SendMessageEntity();
  public formSendMailConfigInitial: SendMessageEntity = new SendMessageEntity();
  // Esto habilita para que se bloque el botun de test
  public unlockButtonTest = true;


  public nameProduct: string = '';
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
    private loadingService: LoadingService,

    private sendMailService: SendMailService
  ) { }


  ngOnInit(): void {

    this.nameProduct = this.data.user.name;
    // Seleccionamos el puerto ID
    this.formSendMailConfigInitial.userId = this.data.userId;

    forkJoin(
      [
        // Traigo a todos los Voyages.
        this.GetConfigSendMail(this.data.userId)
      ]
    ).pipe(
      mergeMap(
        (result: boolean[]) => {

          if (result) {

            // Separo los resultados de las funciones.
            let resulGetConfig: boolean = result[0];;

            // Evaluo errores en las ejecuciones
            if (!resulGetConfig) throw 'ERROR_GET_CONFIG';

            // Todo OK, salto al siguiente paso
            return of(true);
          } else {
            // Algo fallo al ejecutar los observables
            throw this.languageService.GetMessage(this.translateCategory, 'ERROR_GET_LOAD');
          }
        }
      )
    ).subscribe(
      (result: boolean) => {
        // No validamos el resultado por que damos como entendido que el result es true.

        this.InitializeSendMail();
        // Deshabilito el spinner de loading
        this.loadingService.Close();
      },
      err => {
        // Manejo el error
        let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, 'ERROR_ON_LOAD'));

        console.error(msg);
        console.dir(err);

        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
        // Deshabilito el spinner de loading
        this.loadingService.Close();
      }
    );

  }
  public ClickSave() {
    this.formSendMailConfigInitial.userId = this.data.user.id;
    this.formSendMailConfigInitial.status = true;
    this.SaveConfigMail();
  }

  public ClickTestSendMail() {

    // lo desabilitamos
    this.formSendMailConfigInitial.userId = this.data.user.id;
    this.unlockButtonTest = false;

    this.loadingService.Open();

    let error: boolean = false;
    if (!this.formSendMailConfigInitial.emails) {
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'INFO'), this.languageService.GetMessage(this.translateCategory, 'CHECK_EMAILS'));
      error = true;
    }

    // Iniciamos la promesa
    Promise.resolve(true).then(
      () => {

        this.loadingService.Close();
        // ENviamos el mail de prueba
        return this.dailyReportService.PostSendEmailLastVoyage(this.formSendMailConfigInitial.id, this.formSendMailConfigInitial.emails).subscribe(
          (resultSend: boolean) => {
            if (!Boolean(resultSend)) { throw 'ERROR SEND MAIL.' }

            console.log('Se envio el correo correctamente')
            // Muestro notificación
            this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_TEST_SEND_EMAIL'));
            // habilitamos el button
            this.unlockButtonTest = true;
            this.loadingService.Close();
            return true;
          },
          error => {
            // Valido si viene un mensaje de error
            let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR');

            // Muestro notificación
            this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

            console.log('ERROR AL ENVIAR EL CORREO')
            // Deshabilito el spinner de loading
            this.loadingService.Close();
            this.unlockButtonTest = true;
            return false;
          });

      }
    ).then(
      result => {

        this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SOON_YOU_CONFIRMATION'));
        this.loadingService.Close();
      }
    ).catch(
      result => {
        this.loadingService.Close();
      }
    )


  }


  // GetUsers: Cargo todos los Users para el listado de Users.
  private GetConfigSendMail(userId: number): Observable<boolean> {
    // Cada vez que se use getUsers la consola nos avisara.
    console.log('GetUsers(user: User)');

    // Obtenemos todos los usuarios
    return this.sendMailService.GetConfigSendMail(userId).pipe(map(
      (resultUser: SendMessageEntity) => {

        this.sendMailConfigInitial = resultUser;

        this.formSendMailConfigInitial = resultUser;

        // Segun el resultado retornamos la respuesta.
        return (resultUser !== null);
      }
    ));

  }
  // CollectVoyageData() : Arma un objeto User con los datos correspondiente a la pantalla.
  private CollectConfigMail(): SendMessageEntity {

    // Se teamos estos datos para darle segimiento
    console.log("CollectConfigMail()");

    let newSendMailService: SendMessageEntity = this.formSendMailConfigInitial;

    // Retorno el objeto
    return JSON.parse(JSON.stringify(newSendMailService));
  }


  //SendMessageEntityModified() : Verifica si el token a sido modificado.
  private SendMessageEntityModified(): boolean {

    // Se teamos estos datos para darle segimiento
    console.log("SendMessageEntityModified()");

    // Armo objeto para compararlo con el obj initialVoyage.
    let sendMailConfigToSave: SendMessageEntity = this.CollectConfigMail();

    // Comparo los objetos antes y despues
    return !(JSON.stringify(sendMailConfigToSave) === JSON.stringify(this.sendMailConfigInitial));
  }

  public SaveConfigMail(): boolean {

    // Se teamos estos datos para darle segimiento
    console.log("SaveVoyage()");

    // Armo objeto para pasarle al servicio
    let sendMessageEntityToSave: SendMessageEntity = this.CollectConfigMail();

    // Habilito el spinner de loading
    this.loadingService.Open();

    // Verifico si es para actualizar
    if (sendMessageEntityToSave.emails) {
      // Guardo el objeto obtenido
      this.sendMailService.SaveConfigMail(sendMessageEntityToSave).subscribe(
        (result: SendMessageEntity) => {

          // Muestro notificación
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_SEND_MAIL_SAVE'));

          // Deshabilito el spinner de loading
          this.loadingService.Close();

          this.InitializeSendMail();
        },
        error => {
          // Valido si viene un mensaje de error
          let msg = this.languageService.GetMessage(this.translateCategory, error || 'ERROR_SAVE_CONFIG_SENDMAIL');

          // Muestro notificación
          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);

          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

    } else {

      // Muestro notificación
      this.notificationsService.info(this.languageService.GetMessage(this.translateCategory, 'ERROR'), this.languageService.GetMessage(this.translateCategory, 'ERROR_EMAIL_CLEAR'));

    }

    // Devuelvo false
    return false;
  }


  // InitializeVoyage() : Iniziliza el objeto Voyaje.
  public InitializeSendMail(): void {

    // Se teamos estos datos para darle segimiento
    console.log("InitializeSendMail(voyage?: Voyage, voyageDetails?: VoyageDetail[])");


    // actualizo el valor del InitializeVoyage.
    this.sendMailConfigInitial = this.CollectConfigMail();

  }
}
