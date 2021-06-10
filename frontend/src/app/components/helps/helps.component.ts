import { Component, OnInit } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.scss']
})
export class HelpsComponent implements OnInit {

  // Variable que contiene todas las url de imagenes.
  public arrImgHome: string[] = [
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

  public title_home = "Transgas"
  public sub_title_home = "SAILING ANALYSIS";
  public description_home = "Get Voyage Analysis In Just One Click!"
  public description_home_ext = "The voyage analysis platform allows to obtain the performance of the machine, speed, consumption. Thanks to the daily report sent by the captain."


  // Segundo cuadro manual de usuario
  public title_manual: string = ''
  public arrModules: any[] = [
    {
      icono: 'icon-menu-dashboard',
      title_icono: 'Dashboard',
      text: 'Module in charge of monitor the main indicators of the vessel.',
      list_option: [
        'Daily consumption',
        'Consumption per machine',
        'Consumption by activity'
      ],
      text_ref: 'Read more',
      href: ''
    },

    {
      icono: 'icon-menu-port',
      title_icono: 'Voyage',
      text: 'Module in charge of storing voyage information.',
      list_option: [
        'Voyage logs',
        'Port logs',
        'Daily report'
      ],
      text_ref: 'Read more',
      href: ''
    },

    {
      icono: 'icon-menu-user',
      title_icono: 'User',
      text: 'Module in charge of registering vessel, owner and admin.',
      list_option: [
        'Vessel registration',
        'Owner registration',
        'Administrators Registration'
      ],
      text_ref: 'Read more',
      href: ''
    },

  ]
  constructor() { }

  ngOnInit(): void {

    // Le agregamos el PerfectScroll
    new PerfectScrollbar('.body-full-container', {
      suppressScrollX: true
    });
  }

  CLICK(el: HTMLElement) {
    el.scrollIntoView();
  }
}
