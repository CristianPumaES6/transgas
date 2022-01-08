import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { LanguageService } from '../../../services/language.service';
 

// Interface de los input del componente.
export interface IDialogUpdateServer {
  versionActual:string,
  versionServer:string
}

@Component({
  selector: 'app-dialog-update-server',
  templateUrl: './dialog-update-server.component.html',
  styleUrls: ['./dialog-update-server.component.scss']
})
export class DialogUpdateServerComponent implements OnInit {

 

  // Constructores para setear valores al componente.
  constructor(
    // Dialog referencia es el mismo.
    public dialogRef: MatDialogRef<DialogUpdateServerComponent>,
    // Data que se importara.
    @Inject(MAT_DIALOG_DATA) public data: IDialogUpdateServer,
    // servicio de lenguaje.
    private languageService: LanguageService,
  ) { }

  // Traducciones
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dialog';
  public iDialogUpdateServer : IDialogUpdateServer = <IDialogUpdateServer>{
    versionActual : '',
    versionServer:'',
  };
 

  ngOnInit(): void {
    this.iDialogUpdateServer = this.data || <IDialogUpdateServer>{
      versionActual : '',
      versionServer:'',
    };
  }
}

