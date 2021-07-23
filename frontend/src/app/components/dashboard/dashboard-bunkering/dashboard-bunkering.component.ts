import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';


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

  constructor() { }

  ngOnInit(): void {
  }



}
