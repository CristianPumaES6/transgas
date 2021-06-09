import { Component, OnInit } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.scss']
})
export class HelpsComponent implements OnInit {

  // Variable que contiene todas las url de imagenes.
  public arrImgHome:string[] = [
    "http://localhost:3000/img/1Home.png",
    "http://localhost:3000/img/2Voyage.png",
    "http://localhost:3000/img/4Report.png",
    "http://localhost:3000/img/5Dashboard.png",
    "http://localhost:3000/img/6Dashboard2.png",
    "http://localhost:3000/img/7Dashboard3.png",
    "http://localhost:3000/img/8Users.png",
    "http://localhost:3000/img/9Users2.png",
    "http://localhost:3000/img/1Home.png"
  ];

  constructor() { }

  ngOnInit(): void {

      // Le agregamos el PerfectScroll
      new PerfectScrollbar('.body-full-container', {
        suppressScrollX: true
      });
  }

}
