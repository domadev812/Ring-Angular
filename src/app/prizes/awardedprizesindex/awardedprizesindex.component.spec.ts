import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardedPrizesIndexComponent } from './awardedprizesindex.component';

describe('AwardedPrizesIndexComponent', () => {
  let component: AwardedPrizesIndexComponent;
  let fixture: ComponentFixture<AwardedPrizesIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AwardedPrizesIndexComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardedPrizesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
