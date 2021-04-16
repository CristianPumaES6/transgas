import { TestBed } from '@angular/core/testing';

import { IsBuqueGuard } from './is-buque.guard';

describe('IsBuqueGuard', () => {
  let guard: IsBuqueGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsBuqueGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
