import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricantAnalysisComponent } from './lubricant-analysis.component';

describe('LubricantAnalysisComponent', () => {
  let component: LubricantAnalysisComponent;
  let fixture: ComponentFixture<LubricantAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricantAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LubricantAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
