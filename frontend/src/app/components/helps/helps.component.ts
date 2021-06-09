import { Component, OnInit } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.scss']
})
export class HelpsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

      // Le agregamos el PerfectScroll
      new PerfectScrollbar('.body-full-container', {
        suppressScrollX: true
      });
  }

}
