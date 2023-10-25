import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDocComponent } from './new-doc.component';

describe('NewDocComponent', () => {
  let component: NewDocComponent;
  let fixture: ComponentFixture<NewDocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDocComponent]
    });
    fixture = TestBed.createComponent(NewDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
