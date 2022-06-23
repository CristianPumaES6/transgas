import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfigDashboardComponent } from './dialog-config-dashboard.component';

describe('DialogConfigDashboardComponent', () => {
  let component: DialogConfigDashboardComponent;
  let fixture: ComponentFixture<DialogConfigDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfigDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfigDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
