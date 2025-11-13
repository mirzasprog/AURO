import { TestBed } from '@angular/core/testing';

import { ExportVanredniOtpisService } from './export-vanredni-otpis.service';

describe('ExportVanredniOtpisService', () => {
  let service: ExportVanredniOtpisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportVanredniOtpisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
