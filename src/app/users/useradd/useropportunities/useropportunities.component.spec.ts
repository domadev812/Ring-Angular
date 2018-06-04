import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseropportunitiesComponent } from './useropportunities.component';

describe('UseropportunitiesComponent', () => {
  let component: UseropportunitiesComponent;
  let fixture: ComponentFixture<UseropportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseropportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseropportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
