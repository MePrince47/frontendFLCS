import { TestBed } from '@angular/core/testing';

import { Bulletin } from './bulletin';

describe('Bulletin', () => {
  let service: Bulletin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bulletin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
