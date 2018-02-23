import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedUserComponent } from './appliedusers.component';

describe('AppliedUserComponent', () => {
  let component: AppliedUserComponent;
  let fixture: ComponentFixture<AppliedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppliedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppliedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
