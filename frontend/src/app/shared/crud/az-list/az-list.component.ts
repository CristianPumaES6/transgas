import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { LanguageService } from '../../../services/language.service';

// modelo
import { SettingAzList, azListDropdown, AzList } from '../../../models/azlist';

@Component({
  selector: 'app-az-list',
  templateUrl: './az-list.html',
  styleUrls: ['./az-list.scss']
})
export class AzListComponent implements OnInit {

  public translateCategory: string = 'azList';
  public userLanguage: string = this.languageService.GetCurrentLanguage();

  // Arreglo de item breadcrumb.
  @Input()
  public settingAzList: SettingAzList = new SettingAzList();
  // Lista de Dropdowns.
  @Input()
  public azListDropdowns: azListDropdown[] = [];

  // Arreglo de item para el listado.
  @Input()
  public azLists: AzList[] = [];
  // Esta variable servira para almacenar el item seleccionado.
  public selectAzList: AzList = new AzList();

  // opcion para agregar un nuevo item
  @Output()
  public eSelectNew = new EventEmitter();
  // Opcion para retroceder 
  @Output()
  public eSelectBack = new EventEmitter();
  // Emit al seleccionar un Dropdown
  @Output()
  public eSelectDropdown = new EventEmitter<number>();
  public selectAzSelectDropdown: number = 0;
  // Emit al seleccionar un item de la lista.
  @Output()
  public eSelectAzList = new EventEmitter<AzList>();
  // Emit al seleccionar el boton eliminar.
  @Output()
  public eSelectDelete = new EventEmitter<AzList>();


  constructor(
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
  }

  // Emitimos una accion.
  public OnSelectNew(): boolean {
    console.log('OnSelectNew()');

    this.eSelectNew.emit
    return false;
  }
  // Emitimos una accion.
  public OnSelectBack(): boolean {
    console.log('OnSelectBack()');

    this.eSelectBack.emit
    return false;
  }
  public OnSelectDropdown(): boolean {
    console.log('OnSelectDropdown()');

    this.eSelectDropdown.emit(this.selectAzSelectDropdown)
    return false;
  }
  public OnSelectAzList(azList: AzList): boolean {
    console.log('OnSelectAzList(azList: AzList)');

    // Guardamos el objeto seleccionado.
    this.selectAzList = azList;

    this.eSelectAzList.emit(this.selectAzList);
    return false;
  }
  public OnSelectDelete(azList: AzList): boolean {
    console.log('OnSelectDelete(azList: AzList)');

    // Guardamos el objeto seleccionado.
    this.selectAzList = azList;

    this.eSelectDelete.emit(azList);

    return false;
  }
}
