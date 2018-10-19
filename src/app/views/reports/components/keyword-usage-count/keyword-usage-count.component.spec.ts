import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordUsageCountComponent } from './keyword-usage-count.component';

describe('KeywordUsageCountComponent', () => {
  let component: KeywordUsageCountComponent;
  let fixture: ComponentFixture<KeywordUsageCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordUsageCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordUsageCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
