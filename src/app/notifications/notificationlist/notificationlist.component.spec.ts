import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationlistComponent } from './notificationlist.component';

describe('NotificationlistComponent', () => {
  let component: NotificationlistComponent;
  let fixture: ComponentFixture<NotificationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
