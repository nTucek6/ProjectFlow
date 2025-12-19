import { Component, effect, inject } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../../shared/services/task.service';
import { ProjectService } from '../../../shared/services/project.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectDto } from '../../../shared/dto/project.dto';
import { Title } from '@angular/platform-browser';
import { TaskDto } from '../../../shared/dto/task.dto';
import { MatButtonModule } from '@angular/material/button';
import { TaskStatus } from '../../../shared/enums/task-status.enum';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-board',
  imports: [CdkDrag, CdkDropList, MatButtonModule, MatIconModule],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private tabTitle = inject(Title);

  taskStatus = TaskStatus;

  isDragging = false;

  todo: TaskDto[] = [];
  progress: TaskDto[] = [];
  done: TaskDto[] = [];

  project = toSignal<ProjectDto | null>(this.projectService.project$);

  logData = effect(() => {
    const p = this.project();
    if (p) {
      this.tabTitle.setTitle(p.name + ' - Board');

      this.taskService.getAllProjectTasks(p.id).subscribe((response) => {
        //console.log(response);
        this.todo = response.filter((f) => f.status === 'TODO');
        this.progress = response.filter((f) => f.status === 'IN_PROGRESS');
        this.done = response.filter((f) => f.status === 'DONE');
      });
    }
  });

  drop(event: CdkDragDrop<TaskDto[]>) {
    const draggedItem: TaskDto = event.item.data; // <-- cdkDragData here
    const fromList = event.previousContainer.id;
    const toList = event.container.id;

    //console.log(draggedItem);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    let prevIndex = event.previousIndex;
    let currentIndex = event.currentIndex;

    if (fromList !== toList) {
      draggedItem.status = toList;
      draggedItem.order = currentIndex;

      this.taskService.updateTask(draggedItem).subscribe((response) => {
        const oldLastIndex = this.findKanbanList(fromList);

        this.changeOrder(fromList, prevIndex, oldLastIndex);

        const lastIndex = this.findKanbanList(toList);

        if (lastIndex != currentIndex) {
          this.changeOrder(toList, lastIndex + 1, currentIndex);
        } else {
          this.changeOrder(toList, lastIndex, currentIndex);
        }
      });
    } else {
      this.changeOrder(toList, prevIndex, currentIndex);
    }
  }

  changeOrder(toList: string, prevIndex: number, currentIndex: number) {
    switch (toList) {
      case TaskStatus.TODO.toString():
        console.log('Todo');
        this.calculateOrder(prevIndex, currentIndex, this.todo);
        console.log(this.todo);
        break;
      case TaskStatus.IN_PROGRESS.toString():
        console.log('In progress');
        this.calculateOrder(prevIndex, currentIndex, this.progress);
        console.log(this.progress);
        break;
      case TaskStatus.DONE.toString():
        console.log('Done');
        this.calculateOrder(prevIndex, currentIndex, this.done);
        console.log(this.done);
        break;
    }
  }

  calculateOrder(prevIndex: number, currentIndex: number, filterList: TaskDto[]) {
    let start = Math.min(prevIndex, currentIndex);
    const end = Math.max(prevIndex, currentIndex);

    console.log('Start: ' + start + ' End: ' + end);

    const list = filterList.filter((f) => f.order >= start && f.order <= end);
    console.log(list);
    for (let i = 0; i < list.length; i++) {
      list[i].order = start;
      start++;
    }
    if (list.length > 0) {
      this.taskService.reorderTask(list).subscribe((response) => {
        //console.log(response);
      });
    }
  }

  findKanbanList(toList: String): number {
    let lastIndex = 0;
    let size = 0;
    switch (toList) {
      case TaskStatus.TODO.toString():
        size = this.todo.length;
        if (size > 0) {
          size = size > 0 ? size - 1 : 0;
          lastIndex = this.todo[size].order;
        }
        break;
      case TaskStatus.IN_PROGRESS.toString():
        size = this.progress.length;
        if (size > 0) {
          size = size > 0 ? size - 1 : 0;
          lastIndex = this.progress[size].order;
        }
        break;
      case TaskStatus.DONE.toString():
        size = this.done.length;
        if (size > 0) {
          size = size > 0 ? size - 1 : 0;
          lastIndex = this.done[size].order;
        }
        break;
    }
    console.log('Index: ' + lastIndex);
    return lastIndex;
  }

  editItem(task: TaskDto) {
    console.log(task);
  }
}
