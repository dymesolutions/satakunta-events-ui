import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAddImageDialogComponent } from '@app/views/events/event-add-image-dialog/event-add-image-dialog.component';

describe('EventAddImageDialogComponent', () => {
  let component: EventAddImageDialogComponent;
  let fixture: ComponentFixture<EventAddImageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAddImageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAddImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
