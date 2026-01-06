import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanList } from './kanban-list';

describe('KanbanList', () => {
  let component: KanbanList;
  let fixture: ComponentFixture<KanbanList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
