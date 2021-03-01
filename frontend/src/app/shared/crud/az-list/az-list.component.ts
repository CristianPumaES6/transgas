import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { LanguageService } from '../../../services/language.service';

// modelo
import { SettingAzList, azListDropdown, AzList } from '../../../models/azlist';
import PerfectScrollbar from 'perfect-scrollbar';

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

  @Input()
  public selectAzSelectDropdown: number = 0;
  // Emit al seleccionar un item de la lista.
  @Output()
  public eSelectAzList = new EventEmitter<AzList>();
  // Emit al seleccionar el boton eliminar.
  @Output()
  public eSelectDelete = new EventEmitter<AzList>();
  // Emit al seletxxionar item 1
  @Output()
  public eSelectItemEmit2 = new EventEmitter<AzList>();

  @Output()
  public eSelectItemEmit3 = new EventEmitter<AzList>();

  constructor(
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      new PerfectScrollbar('#azContactList', {
        suppressScrollX: true
      });
    }, 500)
  }

  // Emitimos una accion.
  public OnSelectNew(): boolean {
    console.log('OnSelectNew()');

    this.eSelectNew.emit();
    return false;
  }

  // Emitimos una accion.
  public OnSelectBack(): boolean {
    console.log('OnSelectBack()');

    this.eSelectBack.emit();
    return false;
  }

  // Emitimas al seleccionar una opcion de Dropdown
  public OnSelectDropdown(): boolean {
    console.log('OnSelectDropdown()');

    this.eSelectDropdown.emit(this.selectAzSelectDropdown)
    return false;
  }

  // Emitimos al seleccionarun item de la lista
  public OnSelectAzList(azList: AzList): boolean {
    console.log('OnSelectAzList(azList: AzList)');

    // Guardamos el objeto seleccionado.
    this.selectAzList = azList;

    this.eSelectAzList.emit(this.selectAzList);
    return false;
  }

  // Esta funcion sirve para agregarun reporte
  public OnSelectItemEmit2(azList: AzList): boolean {
    console.log('OnSelectItemEmit2(azList: AzList)');

    // Guardamos el objeto seleccionado.
    this.selectAzList = azList;

    // Emitimos el valor al componente padre.
    this.eSelectItemEmit2.emit(this.selectAzList);

    return false;
  }

  // Esta funcion sirve para agregarun reporte
  public OnSelectItemEmit3(azList: AzList): boolean {
    console.log('OnSelectItemEmit3(azList: AzList)');


    // Guardamos el objeto seleccionado.
    this.selectAzList = azList;

    // Emitimos el valor al componente padre.
    this.eSelectItemEmit3.emit(this.selectAzList);

    return false;
  }

  // Emitimos al dar click a la opcion eliminar
  public OnSelectDelete(azList: AzList): boolean {
    console.log('OnSelectDelete(azList: AzList)');

    // Guardamos el objeto seleccionado.
    this.selectAzList = azList;

    this.eSelectDelete.emit(azList);

    return false;
  }

}
