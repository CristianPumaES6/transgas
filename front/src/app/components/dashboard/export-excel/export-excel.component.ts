import { Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { User } from '../../../models/user';
import { ExcelService } from '../../../services/excel/excel.service';
import { ExcelFormatDNVService } from '../../../services/excel/excel-format-dnv.service';
import { LoadingService } from '../../../services/loading.service';
import { ExcelFormatDNVV2Service } from 'src/app/services/excel/excel-format-dnv-v2.service';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss']
})
export class ExportExcelComponent implements OnInit {

  @Input()
  public selectUser: User = new User() ;

  constructor(
    // Servicios de notificaciones.
    private notificationsService: NotificationsService,
    // Loading service.
    private loadingService: LoadingService,
    private excelService: ExcelService,
    private excelFormatDNVService: ExcelFormatDNVService,
    ) { }

  ngOnInit(): void {
  }

  public ClickExportExcel() {
    // alert('SE EXPORTO.')
    this.ClickDownloading();
  }

  public ClickDownloading() {
    
    return Promise.resolve(true)
      .then(
        result => {
          // Loading service
          this.loadingService.Open();

          return this.excelService.ExportReporteEntryForUser(this.selectUser);
        }
      ).then(
        result => {
          this.loadingService.Close();
        }
      );

  }

  // Descarga el formato DNV
  public DownloadingFormatDNV() {
    
    return Promise.resolve(true).then(
      result => {
        this.loadingService.Open();

        alert("Se desabilito esta opcion desde el backend.")

        return true;
        // return this.excelFormatDNVService.ExportReporteEntryForUser(this.selectUser);
      }
    ).then(
      result => {
        this.loadingService.Close();
      }
    );
  }

}
