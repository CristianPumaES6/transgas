import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { User } from '../../../models/user';
import { ExcelFormatDNVV2Service } from '../../../services/excel/excel-format-dnv-v2.service';
import { ExcelFormatVesselDataRegisterService } from '../../../services/excel/excel-format-vessel-data-register.service';
import { ExcelService } from '../../../services/excel/excel.service';
import { LanguageService } from '../../../services/language.service';
import { LoadingService } from '../../../services/loading.service';
import { FormatDateUTCToDateHour } from '../../../../assets/moment/moment.assets';
import { ExcelFormatDNVService } from 'src/app/services/excel/excel-format-dnv.service';

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
  public userLanguage: string;
  public translateCategory: string = 'dialog';
  public selectTypeExportExcel: string = '';

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
    private excelFormatDNVService: ExcelFormatDNVService,
    private excelFormatVesselDataRegisterService: ExcelFormatVesselDataRegisterService,
  ) {
    this.userLanguage = this.languageService.GetCurrentLanguage();
  }

  ngOnInit(): void {
  }


  public ClickDownloading() {
    console.log('ClickDownloading FORMATO ' + this.selectTypeExportExcel);

    return Promise.resolve(true)
      .then(
        result => {

          this.loadingService.Open();


          // Fecha de inicio.
          let dateStart = this.data.dateStartUTC;
          let dateEnd = this.data.dateEndUTC;
          let selectUser: User = this.data.selectUser;


          if (this.selectTypeExportExcel == 'FORMAT_GENERIC') {
            return this.excelService.ExportExcel(this.data.selectUser.id, dateStart, dateEnd, selectUser);
          } else if (this.selectTypeExportExcel == 'DNV_FORMAT') {
            return this.excelFormatDNVService.ExportReporteEntryForUser(this.data.selectUser.id, dateStart, dateEnd, selectUser);
          } else if (this.selectTypeExportExcel == 'EXPORT_VESSEL_DATA') {
            return this.excelFormatVesselDataRegisterService.ExportExcel(selectUser.id, dateStart, dateEnd, selectUser);
          }


        }
      ).then(
        result => {
          if (!result) {
            throw 'ERROR AL GENERAR DOCUMENTO';
          }

          this.loadingService.Close();
        }
      )


  }
}
