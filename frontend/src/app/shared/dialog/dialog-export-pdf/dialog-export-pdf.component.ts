import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Port } from '../../../models/port';
import { User } from '../../../models/user';
import { Voyage } from '../../../models/voyage';
import { LanguageService } from '../../../services/language.service';
import { DialogListReportComponent } from '../dialog-list-report/dialog-list-report.component';

// Interface de los input del componente.
export interface IDialogExportPdf {
  voyages: Voyage[],
  selectUser: User,
  selectVoyageId: number,
}

@Component({
  selector: 'app-dialog-export-pdf',
  templateUrl: './dialog-export-pdf.component.html',
  styleUrls: ['./dialog-export-pdf.component.scss']
})
export class DialogExportPdfComponent implements OnInit {

  // Constructores para setear valores al componente.
  constructor(
    // Dialog referencia es el mismo.
    public dialogRef: MatDialogRef<DialogExportPdfComponent>,
    // Data que se importara.
    @Inject(MAT_DIALOG_DATA) public data: IDialogExportPdf,
    // servicio de lenguaje.
    private languageService: LanguageService,
  ) { }

  // Traducciones
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dialog';

  // Usuario seleccionado
  public selectUser:User=new User();

  // Varibles del formulario
  public selectVoyageId:number = 0;
  public selectPortId:number = 0;
  public selectTypeExport:string = '';

  // Viajes y puertos.
  public voyages:Voyage[] = [];
  public ports:Port[]=[];

  ngOnInit(): void {
    // seleccionar usuario.
    this.selectUser = this.data.selectUser;

    // Viajes
    this.voyages = this.data.voyages;
    this.selectVoyageId = this.data.selectVoyageId;

    // SI existe un viaje seleccioando lo buscamos.
    if(this.selectVoyageId){
      // Buscamos el viaje.
      let voyageSelect = this.voyages.find(voyage => voyage.id === this.selectVoyageId);
      // agregamos los puertos del viaje.
      this.ports = voyageSelect.ports;
    }
    
    // Seleccionamos el tipo de exportacion.
    this.selectTypeExport = 'VESSEL_PERFORMANCE';
  }

  // Se ejecuta cada vez que se cambia de viaje.
  public ClickSelectVoyage() {
    // Verificamos si se selecciono un viaje.
    if(this.selectVoyageId){
      let voyage = this.voyages.find(voyage=> voyage.id===this.selectVoyageId);
      this.ports = voyage.ports;

    }
  }

  public ClickSelectPort() {

  }

}
