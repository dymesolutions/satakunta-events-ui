import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTodayCountComponent } from './event-today-count.component';

describe('EventTodayCountComponent', () => {
  let component: EventTodayCountComponent;
  let fixture: ComponentFixture<EventTodayCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventTodayCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTodayCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
