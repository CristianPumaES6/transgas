import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { stringToDate } from '../../../../assets/moment/moment.assets';
import { Voyage } from '../../../models/voyage';
import { DailyReport } from '../../../models/daily-report';
import { mathRound } from '../../../../assets/math/math.assets';

// Interface de la clase del componente
export interface IDialogListReport {
  voyage: Voyage,
  selectPortId: number,
  reportId: number,
  isIFO_MGO_SPEED: string,
  selectUser: User,
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

  public filterVoyage: Voyage = new Voyage();
  public selectPortId: number;
  public selectUser: User = new User();

  // Inicializamos el componente
  ngOnInit() {
    console.log('ngOnInit() ');

    this.selectPortId = this.data.selectPortId;

    this.selectUser = this.data.selectUser;

    this.filterVoyage = this.data.voyage;
    this.filterVoyage.ports = [this.filterVoyage.ports.find(port => port.id === this.selectPortId)];

    console.log(this.filterVoyage);

  }

  // Evento no click.
  onNoClick(): void {
    this.dialogRef.close();
  }

  SelectPort(): void {

  }




  // Mejorar esto
  public FormatDate(fecha: any): string {

    let formatfecha = stringToDate(fecha);
    return formatfecha;
  }



  // Total del consumo IFO
  public TotalIFO(dailyReport: DailyReport): number {
    // Total del consumo MGO
    let total = 0;

    // sumamos el consumo
    total = dailyReport.mplaIfo + dailyReport.auxIfo + dailyReport.boilerIfo + dailyReport.otherIfo;

    // Retornamos el total de cosumo
    return mathRound(total, 2);
  }

  // Total del consumo MGO
  public TotalMGO(dailyReport: DailyReport): number {
    // Total del consumo MGO
    let total = 0;

    // sumamos el consumo
    total = dailyReport.mplaMgo + dailyReport.auxMgo + dailyReport.boilerMgo + dailyReport.ppMgo + dailyReport.giMgo + dailyReport.otherMgo;

    // Retornamos el total de cosumo
    return mathRound(total, 2);
  }

}
