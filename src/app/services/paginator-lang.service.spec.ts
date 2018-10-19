import { TestBed, inject } from '@angular/core/testing';

import { PaginatorLangService } from '@app/services/paginator-lang.service';

describe('PaginatorLangService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginatorLangService]
    });
  });

  it('should be created', inject([PaginatorLangService], (service: PaginatorLangService) => {
    expect(service).toBeTruthy();
  }));
});
