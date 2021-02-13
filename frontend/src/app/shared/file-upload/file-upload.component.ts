import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { catchError, last, map, tap } from 'rxjs/operators';
import { FileUploadModel } from '../../models/fileUploadedModel';
import { UserService } from '../../services/user.service';
// Componentes Dependencias
import { NotificationsService } from 'angular2-notifications';
import { LanguageService } from '../../services/language.service';
import { OnlineOfflineService } from 'src/app/services/online-offline.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})

export class FileUploadComponent implements OnInit {
  @Input() id: number = 0;
  @Input() filename: string = '';
  @Input() role: string = '';

  @Input() text = 'Upload';
  @Input() param = 'image';

  // tipos de archivos.
  @Input() accept = 'image/jpg, image/jpeg, image/png, image/gif';
  // Permite agregar multiples archivos
  @Input() multiple = false;
  // tslint:disable-next-line:no-output-native
  @Output() complete = new EventEmitter<string>();
  fileInformation: any;

  public files: Array<FileUploadModel> = [];

  public fileUpload: HTMLInputElement;
  public isOnline: boolean = true;

  //======== VARIABLES DE TRADUCCION=============
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'fileUpload';
  //=================[ FIN ]=====================

  // tslint:disable-next-line:variable-name
  constructor(
    private userService: UserService,
    private notificationsService: NotificationsService,
    private languageService: LanguageService,
    readonly onlineOfflineService: OnlineOfflineService,
  ) {


    // subscribe receives the value. sirve para recibir algun emit
    this.onlineOfflineService.emitterIsOnline.subscribe(
      (isOnline: boolean) => {
        this.isOnline = isOnline;
      }
    );
  }


  ngOnInit() {
    
    // Verificamos si esta online.
    this.isOnline = !!window.navigator.onLine;

    this.fileUpload = document.getElementById('fileUpload') as HTMLInputElement;

    if (this.multiple) {
      this.fileUpload.setAttribute('multiple', 'true');
    }

  }

  onClick() {
    this.fileUpload.onchange = () => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < this.fileUpload.files.length; index++) {
        const file = this.fileUpload.files[index];
        this.files.push({
          data: file,
          state: 'in',
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true
        });
      }

      this.uploadFiles();
    };

    this.fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();

    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);

    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {


    file.inProgress = true;
    file.sub = this.userService.UploadPerfil(this.id, file).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      tap(message => { }),
      last(),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        file.canRetry = true;
        this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), this.languageService.GetMessage(this.translateCategory, 'ERROR_UPLOAD_IMAGE'))
        return `${file.data.name} upload failed.`;
      })
    ).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {
          this.notificationsService.success(this.languageService.GetMessage(this.translateCategory, 'SUCCESS'), this.languageService.GetMessage(this.translateCategory, 'SUCCESS_UPLOAD_IMAGE'))
          this.removeFileFromArray(file);
          this.complete.emit(event.body);
        }
      }
    );
  }

  // Carga de multiples archivos.
  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  // Remover archivo
  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);

    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
}
