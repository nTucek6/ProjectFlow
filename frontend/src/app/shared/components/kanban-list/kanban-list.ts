import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskDto } from '../../dto/task.dto';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TaskStatus } from '../../enums/task-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { ProjectItemEditModal } from '@shared/modals/project-item-edit-modal/project-item-edit-modal';

@Component({
  selector: 'app-kanban-list',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './kanban-list.html',
  styleUrl: './kanban-list.scss',
})
export class KanbanList {
  @Input() listId!: string;
  @Input() isDragging: boolean = false;
  @Input() list: TaskDto[] = [];
  @Input() connectedTo: CdkDropList[] = [];
  @Input() projectId!: number;
  @Output() onDrop = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();

  readonly dialog = inject(MatDialog);

  taskStatus = TaskStatus;

  drop(event: any) {
    this.onDrop.emit(event);
  }

  editItem(task: TaskDto) {
    console.log(task);
    const dialogRef = this.dialog.open(ProjectItemEditModal, {
      panelClass: 'custom-dialog-container',
      data: { projectId: this.projectId, task: task },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.onUpdate.emit(true);
      }
    });
  }
}
