import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordListComponent } from '@app/views/keywords/keyword-list/keyword-list.component';

describe('KeywordListComponent', () => {
  let component: KeywordListComponent;
  let fixture: ComponentFixture<KeywordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
