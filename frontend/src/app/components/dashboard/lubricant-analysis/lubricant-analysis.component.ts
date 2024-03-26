import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-lubricant-analysis',
  templateUrl: './lubricant-analysis.component.html',
  styleUrls: ['./lubricant-analysis.component.scss']
})
export class LubricantAnalysisComponent {
  @ViewChild('myIframe') iframe: ElementRef;

  public selectUserId = 25;
  public iframeUrl = 'https://cpumavilli96.outsystemscloud.com/Transgas_UI/Dashboard?UserId=';

  constructor() {}

  ngAfterViewInit(): void {
    this.reloadIframe();
  }

  reloadIframe() {
    const iframeElement = this.iframe?.nativeElement;
    if (iframeElement) {
      iframeElement.src = this.iframeUrl + this.selectUserId;
    } else {
      console.error('Iframe element not found');
    }
  }

}
