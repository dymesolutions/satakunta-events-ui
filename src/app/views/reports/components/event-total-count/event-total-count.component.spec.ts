import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTotalCountComponent } from './event-total-count.component';

describe('EventTotalCountComponent', () => {
  let component: EventTotalCountComponent;
  let fixture: ComponentFixture<EventTotalCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventTotalCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTotalCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
