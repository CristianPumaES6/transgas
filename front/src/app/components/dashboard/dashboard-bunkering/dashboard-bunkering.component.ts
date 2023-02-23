import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { mathRound } from '../../../../assets/math/math.assets';


export class DashboardBunkering {
  constructor(
    public rob?: number,
    public typeFuel?: string,
    public startRob?: number,
    public startDate?: string,
    public comsumption?: number,
    public bunkering?: number,
    public endRob?: number,
    public endDate?: string,
  ) {
    this.rob = rob || 0;
    this.typeFuel = typeFuel || '';
    this.startRob = startRob || 0;
    this.startDate = startDate || '';
    this.comsumption = comsumption || 0;
    this.bunkering = bunkering || 0;
    this.endRob = endRob || 0;
    this.endDate = endDate || '';
  }
}

@Component({
  selector: 'app-dashboard-bunkering',
  templateUrl: './dashboard-bunkering.component.html',
  styleUrls: ['./dashboard-bunkering.component.scss']
})
export class DashboardBunkeringComponent implements OnInit {



  @Input()
  public listInfoFuel: DashboardBunkering[] = [];
  @Input()
  public cantDecimal:number = 2;

  constructor() { }

  ngOnInit(): void {  
  }

  public MathRoundOneDecimal(valor, cantDecimales: number) {

    if (!valor) { return 0; }

    let result = mathRound(valor, cantDecimales)

    return result;
  }



}
