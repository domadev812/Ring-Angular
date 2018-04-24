import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycardindexComponent } from './keycardindex.component';

describe('KeycardindexComponent', () => {
  let component: KeycardindexComponent;
  let fixture: ComponentFixture<KeycardindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeycardindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeycardindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
