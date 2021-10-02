import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'src/app/models/user';
import { ExcelService } from 'src/app/services/excel.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FormatDateUTCToDateHour } from 'src/assets/moment/moment.assets';

// Interface de los input del componente.
export interface IDialogExportExcel {
  selectUser: User,
  dateStartUTC: string,
  dateEndUTC: string
}

@Component({
  selector: 'app-dialog-export-excel',
  templateUrl: './dialog-export-excel.component.html',
  styleUrls: ['./dialog-export-excel.component.scss']
})
export class DialogExportExcelComponent implements OnInit {

  // el primer paso esta completado, si es asi el segundo paso se habilita.
  public isFirstCompleted: boolean = false;

  // Traducciones
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dialog';

  constructor(
    // Dialog referencia es el mismo.
    public dialogRef: MatDialogRef<DialogExportExcelComponent>,
    // Data que se importara.
    @Inject(MAT_DIALOG_DATA) public data: IDialogExportExcel,
    // servicio de lenguaje.
    private languageService: LanguageService,
    // Servicios de notificaciones.
    private notificationsService: NotificationsService,
    // Loading service.
    private loadingService: LoadingService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
  }


  public ClickDownloading() {
    console.log('cLick');

    return Promise.resolve(true)
      .then(
        result => {

          this.loadingService.Open();


          // Fecha de inicio.
          let dateStart = this.data.dateStartUTC;
          let dateEnd = this.data.dateEndUTC;
      
          let selectUser: User = this.data.selectUser;
      
          return this.excelService.ExportExcel(this.data.selectUser.id, dateStart, dateEnd, selectUser);
        }
      ).then(
        result => {
          this.loadingService.Close();
        }
      )

    
  }
}
