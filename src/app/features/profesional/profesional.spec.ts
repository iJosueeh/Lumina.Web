import { TestBed } from '@angular/core/testing';

import { Profesional } from './profesional';

describe('Profesional', () => {
  let service: Profesional;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Profesional);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
