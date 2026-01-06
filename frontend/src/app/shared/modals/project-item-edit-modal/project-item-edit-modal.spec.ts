import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectItemEditModal } from './project-item-edit-modal';

describe('ProjectItemEditModal', () => {
  let component: ProjectItemEditModal;
  let fixture: ComponentFixture<ProjectItemEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectItemEditModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectItemEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
