import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoLineInfoCard } from './two-line-info-card';

describe('TwoLineInfoCard', () => {
  let component: TwoLineInfoCard;
  let fixture: ComponentFixture<TwoLineInfoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoLineInfoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoLineInfoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
