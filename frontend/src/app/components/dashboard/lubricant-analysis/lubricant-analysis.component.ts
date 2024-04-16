import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lubricant-analysis',
  templateUrl: './lubricant-analysis.component.html',
  styleUrls: ['./lubricant-analysis.component.scss']
})
export class LubricantAnalysisComponent {
  @ViewChild('myIframe') iframe: ElementRef;

  public selectUserId = 25;

  
  public iframeUrl = 'https://transgas.outsystemscloud.com/Transgas_UI/Dashboard?';
  constructor(private route: ActivatedRoute) { }

  ngAfterViewInit(): void {
      this.route.queryParams.subscribe(params => {
      // Accede a los parámetros y sus valores aquí
      const buqueId = params['BuqueId'];
      const equipmentId = params['EquipmentId'];
      const date = params['Date'];

      let ultimosCuatro='';
      let dosPrimeros ='';
      if(date) {
        // Obtener los últimos 4 caracteres
        ultimosCuatro = date.substring(date.length - 4);
        dosPrimeros = date.substring(0, 2);
        }
        console.log(ultimosCuatro+"-"+dosPrimeros)
        this.reloadIframe(buqueId,equipmentId,ultimosCuatro+"-"+dosPrimeros);
      });
  }

  reloadIframe(buqueId,equipmentId,date) {
    const iframeElement = this.iframe?.nativeElement;
    if (iframeElement) {
      
      iframeElement.src = this.iframeUrl +"BuqueId="+ buqueId +"&EquipmentId="+equipmentId+"&Date="+date;
    } else {
      console.error('Iframe element not found');
    }
  }

}
