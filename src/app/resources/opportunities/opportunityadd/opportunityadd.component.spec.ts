import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityAddComponent } from './opportunityadd.component';

describe('OpportunityAddComponent', () => {
  let component: OpportunityAddComponent;
  let fixture: ComponentFixture<OpportunityAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
