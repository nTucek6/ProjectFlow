import { Component, effect, inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectDto } from '../../../shared/dto/project.dto';
import { Title } from '@angular/platform-browser';
import { TaskDto } from '../../../shared/dto/task.dto';
import { MatButtonModule } from '@angular/material/button';
import { TaskStatus } from '../../../shared/enums/task-status.enum';
import { MatIconModule } from '@angular/material/icon';
import { KanbanList } from '../../../shared/components/kanban-list/kanban-list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from '@shared/services/api/task.service';
import { ProjectService } from '@shared/services/api/project.service';
import { KanbanService } from '@shared/services/kanban.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectItemEditModal } from '@shared/modals/project-item-edit-modal/project-item-edit-modal';
import { HasPermissionDirective } from "app/core/directives/permission.directive";
import { Action } from '@shared/enums/action.enum';

@Component({
  selector: 'app-board',
  imports: [DragDropModule, MatButtonModule, MatIconModule, KanbanList, HasPermissionDirective],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private tabTitle = inject(Title);
  private kanbanService = inject(KanbanService);

  readonly dialog = inject(MatDialog);
  readonly Action = Action;

  taskStatus = TaskStatus;

  projectId = 0;

  isDragging = false;

  todo: TaskDto[] = [];
  progress: TaskDto[] = [];
  done: TaskDto[] = [];

  project = toSignal<ProjectDto | null>(this.projectService.project$);

  logData = effect(() => {
    this.getProjectTasks();
  });

  getProjectTasks() {
    const p = this.project();
    if (p) {
      this.tabTitle.setTitle(p.name + ' - Board');
      this.projectId = p.id;
      this.taskService.getAllProjectTasks(p.id).subscribe((response) => {
        this.todo = response.filter((f) => f.status === 'TODO');
        this.progress = response.filter((f) => f.status === 'IN_PROGRESS');
        this.done = response.filter((f) => f.status === 'DONE');
      });
    }
  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    this.kanbanService.drop(event, this.todo, this.progress, this.done, this.project()?.id);
  }

  openItemEditDialog() {
    const dialogRef = this.dialog.open(ProjectItemEditModal, {
      panelClass: 'custom-dialog-container',
      data: { projectId: this.project()?.id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getProjectTasks();
      }
    });
  }
}
