import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTotalCountComponent } from './user-total-count.component';

describe('UserTotalCountComponent', () => {
  let component: UserTotalCountComponent;
  let fixture: ComponentFixture<UserTotalCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTotalCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTotalCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
