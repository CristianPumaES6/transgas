import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedAnalysisComponent } from './speed-analysis.component';

describe('SpeedAnalysisComponent', () => {
  let component: SpeedAnalysisComponent;
  let fixture: ComponentFixture<SpeedAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
