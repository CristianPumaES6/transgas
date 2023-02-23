import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfigMailComponent } from './dialog-config-mail.component';

describe('DialogConfigMailComponent', () => {
  let component: DialogConfigMailComponent;
  let fixture: ComponentFixture<DialogConfigMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfigMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfigMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
