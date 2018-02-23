import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorsComponent } from './counselors.component';

describe('CounselorsComponent', () => {
  let component: CounselorsComponent;
  let fixture: ComponentFixture<CounselorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounselorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounselorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
