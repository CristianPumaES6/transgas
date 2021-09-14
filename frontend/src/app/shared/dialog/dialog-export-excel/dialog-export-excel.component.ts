import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { User } from 'src/app/models/user';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';

// Interface de los input del componente.
export interface IDialogExportExcel {
  selectUser: User,
  dateStart: Date,
  dateEnd: Date
}

@Component({
  selector: 'app-dialog-export-excel',
  templateUrl: './dialog-export-excel.component.html',
  styleUrls: ['./dialog-export-excel.component.scss']
})
export class DialogExportExcelComponent implements OnInit {

  // el primer paso esta completado, si es asi el segundo paso se habilita.
  public isFirstCompleted: boolean = false;
  
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
  ) { }

  ngOnInit(): void {
  }

}
