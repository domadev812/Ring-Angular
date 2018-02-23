import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationaddComponent } from './notificationadd.component';

describe('NotificationaddComponent', () => {
  let component: NotificationaddComponent;
  let fixture: ComponentFixture<NotificationaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
