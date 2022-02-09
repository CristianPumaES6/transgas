import { Component, OnInit } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';
import { EnvConfig } from 'src/app/config/env.config';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.scss']
})
export class HelpsComponent implements OnInit {

  public url: string = EnvConfig.API;
public roleUser: string= '';

  // Variable que contiene todas las url de imagenes.
  public arrImgHome: string[] = [
    this.url+"/img/1Home.png",
    this.url+"//img/2Voyage.png",
    this.url+"//img/4Report.png",
    this.url+"//img/5Dashboard.png",
    this.url+"//img/6Dashboard2.png",
    this.url+"//img/7Dashboard3.png",
    this.url+"//img/8Users.png",
    this.url+"//img/9Users2.png",
    this.url+"//img/1Home.png"
  ];

  public title_home = "Transgas";
  public sub_title_home = "ANALYSIS OF CONSUMPTION";
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


  ];


  // 
  public onlineAndOffline = {
    text : 'Allows you to work online and offline.',
    listIMG : [
      {
        title:'ss',
        description:'ss s s s s s s ss s'
      },
      {
        title:'ss',
        description:'ss s s s s s s ss s'
      }
    ]
  }




  
  // Titulo de la lista de videos
  public title_list_videos: string ='Demo videos';
  public h1_title_videos: string = 'Choose a module';
  public description_title_videos:string = 'The following videos explain the application modules.';

  // Lista de videos.
  public list_video:any[] = [
    {
      iframe_video :'Dashboard',
      title:'Dashboard Module',
      description:'Module in charge of monitor the main indicators of the vessel.'
    },{
      iframe_video :'Voyage',
      title:'Voyage Module',
      description:'Module in charge of storing voyage information.'
    }
  ]

  
  constructor(
    private userService: UserService
    ) { }

  ngOnInit(): void {

    // Le agregamos el PerfectScroll
    new PerfectScrollbar('.body-full-container', {
      suppressScrollX: true
    });

            // Rol del usurio logeado.
            this.roleUser = this.userService.GetIdentity().role;

            if(this.roleUser === 'ADMIN' || this.roleUser === 'SUPPORT'){
             
              this.list_video.push(
                {
                  iframe_video :'User',
                  title:'User Module',
                  description:'Module in charge of registering vessel, owner and admin.'
                }
              );
              this.arrModules.push(

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
    }
              )
            }

  }

  CLICK(el: HTMLElement) {
    el.scrollIntoView();
  }

  ClickSelectModule(el): boolean {
    //alert(module)
    el.scrollIntoView();
    return false;
  }
}
