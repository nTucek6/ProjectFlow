import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyLayout } from './verify-layout';

describe('VerifyLayout', () => {
  let component: VerifyLayout;
  let fixture: ComponentFixture<VerifyLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
