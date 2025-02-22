import { TestBed } from '@angular/core/testing';

import { Data.Service.TsService } from './data.service.ts.service';

describe('Data.Service.TsService', () => {
  let service: Data.Service.TsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Data.Service.TsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
