import { TestBed } from '@angular/core/testing';

import { ImportujExcelService } from './importuj-excel.service';

describe('ImportujExcelService', () => {
  let service: ImportujExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportujExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
