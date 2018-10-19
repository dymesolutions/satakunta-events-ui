import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreatedComponent } from '@app/views/events/event-created/event-created.component';

describe('EventCreatedComponent', () => {
  let component: EventCreatedComponent;
  let fixture: ComponentFixture<EventCreatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCreatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
