import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmapViewComponent } from '@app/components/gmap/gmap-view/gmap-view.component';

describe('GmapViewComponent', () => {
  let component: GmapViewComponent;
  let fixture: ComponentFixture<GmapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
