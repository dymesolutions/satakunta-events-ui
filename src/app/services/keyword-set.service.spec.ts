import { TestBed, inject } from '@angular/core/testing';

import { KeywordSetService } from '@app/services/keyword-set.service';

describe('KeywordSetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeywordSetService]
    });
  });

  it('should be created', inject([KeywordSetService], (service: KeywordSetService) => {
    expect(service).toBeTruthy();
  }));
});
