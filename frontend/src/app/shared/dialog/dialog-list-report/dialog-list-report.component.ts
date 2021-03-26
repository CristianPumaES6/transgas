import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Interface de la clase del componente
export interface IDialogListReport {
  reporte: string,
}


@Component({
  selector: 'app-dialog-list-report',
  templateUrl: './dialog-list-report.component.html',
  styleUrls: ['./dialog-list-report.component.scss']
})
export class DialogListReportComponent implements OnInit {

  // Constructores para setear valores al componente.
  constructor(
    public dialogRef: MatDialogRef<DialogListReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogListReport
  ) { }

  // Inicializamos el componente
  ngOnInit() {
    console.log('ngOnInit() ');
  }

  // Evento no click.
  onNoClick(): void {
    this.dialogRef.close();
  }

}
