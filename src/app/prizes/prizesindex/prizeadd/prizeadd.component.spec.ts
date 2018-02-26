import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeAddComponent } from './prizeadd.component';

describe('PrizeAddComponent', () => {
  let component: PrizeAddComponent;
  let fixture: ComponentFixture<PrizeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrizeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrizeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
