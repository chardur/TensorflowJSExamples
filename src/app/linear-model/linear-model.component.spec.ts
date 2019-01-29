import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearModelComponent } from './linear-model.component';

describe('LinearModelComponent', () => {
  let component: LinearModelComponent;
  let fixture: ComponentFixture<LinearModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinearModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
