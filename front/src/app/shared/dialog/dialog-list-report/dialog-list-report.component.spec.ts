import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListReportComponent } from './dialog-list-report.component';

describe('DialogListReportComponent', () => {
  let component: DialogListReportComponent;
  let fixture: ComponentFixture<DialogListReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogListReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
