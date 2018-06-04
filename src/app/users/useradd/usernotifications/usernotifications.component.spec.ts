import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernotificationsComponent } from './usernotifications.component';

describe('UsernotificationsComponent', () => {
  let component: UsernotificationsComponent;
  let fixture: ComponentFixture<UsernotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
