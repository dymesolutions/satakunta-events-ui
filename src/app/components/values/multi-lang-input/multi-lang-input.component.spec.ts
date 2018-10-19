import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLangInputComponent } from '@app/components/values/multi-lang-input/multi-lang-input.component';

describe('MultiLangInputComponent', () => {
  let component: MultiLangInputComponent;
  let fixture: ComponentFixture<MultiLangInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiLangInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLangInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
