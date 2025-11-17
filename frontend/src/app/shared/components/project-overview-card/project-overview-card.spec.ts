import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverviewCard } from './project-overview-card';

describe('ProjectOverviewCard', () => {
  let component: ProjectOverviewCard;
  let fixture: ComponentFixture<ProjectOverviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectOverviewCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectOverviewCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
