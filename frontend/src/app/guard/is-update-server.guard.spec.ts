import { TestBed } from '@angular/core/testing';

import { IsUpdateServerGuard } from './is-update-server.guard';

describe('IsUpdateServerGuard', () => {
  let guard: IsUpdateServerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsUpdateServerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
