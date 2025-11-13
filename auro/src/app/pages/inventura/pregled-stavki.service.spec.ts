import { TestBed } from '@angular/core/testing';

import { PregledStavkiService } from './pregled-stavki.service';

describe('PregledStavkiService', () => {
  let service: PregledStavkiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PregledStavkiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
