import { TestBed, inject } from '@angular/core/testing';

import { PaginatorService } from '@app/services/paginator.service';

describe('PaginatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginatorService]
    });
  });

  it('should be created', inject([PaginatorService], (service: PaginatorService) => {
    expect(service).toBeTruthy();
  }));
});
