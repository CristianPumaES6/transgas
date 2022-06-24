import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { LanguageService } from '../../../services/language.service';
import { LoadingService } from '../../../services/loading.service';


export interface IDialogConfigDashboard {
  cantDecimal: number
}

@Component({
  selector: 'app-dialog-config-dashboard',
  templateUrl: './dialog-config-dashboard.component.html',
  styleUrls: ['./dialog-config-dashboard.component.scss']
})
export class DialogConfigDashboardComponent implements OnInit {

  public translateCategory: string = 'dialog';
  public decimalQuantity: number = 0;

  constructor(
    // Dialog referencia es el mismo.
    public dialogRef: MatDialogRef<DialogConfigDashboardComponent>,
    // Data que se importara.
    @Inject(MAT_DIALOG_DATA) public data: IDialogConfigDashboard,
    // servicio de lenguaje.
    private languageService: LanguageService,
    // Servicios de notificaciones.
    private notificationsService: NotificationsService,
    // Loading service.
    private loadingService: LoadingService
  ) { }


  ngOnInit(): void {
    // Seleccionamos el puerto ID
    this.decimalQuantity = this.data.cantDecimal;
  }

  // guardar cambios.
  public ClickSaveChanges() {
    // Cerramos el componente.
    this.dialogRef.close(this.decimalQuantity);

  }

}
