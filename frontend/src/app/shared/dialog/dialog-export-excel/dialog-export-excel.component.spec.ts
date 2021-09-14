import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExportExcelComponent } from './dialog-export-excel.component';

describe('DialogExportExcelComponent', () => {
  let component: DialogExportExcelComponent;
  let fixture: ComponentFixture<DialogExportExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExportExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
