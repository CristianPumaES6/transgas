import { Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'src/app/models/user';
import { ExcelService } from 'src/app/services/excel.service';
import { LoadingService } from 'src/app/services/loading.service';

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
    ) { }

  ngOnInit(): void {
  }

  public ClickExportExcel(){
    alert('SE EXPORTO.')
    this.ClickDownloading();
  }

  public ClickDownloading() {
    
    return Promise.resolve(true)
      .then(
        result => {

          this.loadingService.Open();


      
          return this.excelService.ExportReporteEntryForUser(this.selectUser);
        }
      ).then(
        result => {
          this.loadingService.Close();
        }
      )

    
  }

}
