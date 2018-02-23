import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipAddComponent } from './internshipadd.component';

describe('InternshipAddComponent', () => {
  let component: InternshipAddComponent;
  let fixture: ComponentFixture<InternshipAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternshipAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternshipAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
