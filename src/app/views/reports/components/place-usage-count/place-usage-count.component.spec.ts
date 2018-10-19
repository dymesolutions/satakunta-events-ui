import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceUsageCountComponent } from './place-usage-count.component';

describe('PlaceUsageCountComponent', () => {
  let component: PlaceUsageCountComponent;
  let fixture: ComponentFixture<PlaceUsageCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceUsageCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceUsageCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
