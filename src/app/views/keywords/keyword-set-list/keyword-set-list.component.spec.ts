import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordSetListComponent } from '@app/views/keywords/keyword-set-list/keyword-set-list.component';

describe('KeywordSetListComponent', () => {
  let component: KeywordSetListComponent;
  let fixture: ComponentFixture<KeywordSetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordSetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
