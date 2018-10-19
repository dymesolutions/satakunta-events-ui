import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceUsageCountComponent } from './audience-usage-count.component';

describe('AudienceUsageCountComponent', () => {
  let component: AudienceUsageCountComponent;
  let fixture: ComponentFixture<AudienceUsageCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudienceUsageCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceUsageCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
