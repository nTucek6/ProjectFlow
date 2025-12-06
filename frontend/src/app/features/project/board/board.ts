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

@Component({
  selector: 'app-board',
  imports: [CdkDrag, CdkDropList, MatButtonModule],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private tabTitle = inject(Title);

  taskStatus = TaskStatus;

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
      this.taskService.updateTask(draggedItem).subscribe((response) => {
        const oldListSize = this.findNewList(fromList);
        console.log(oldListSize);
        this.changeOrder(fromList, prevIndex, oldListSize);

        prevIndex = currentIndex;
        currentIndex = this.findNewList(toList);

        console.log()

        this.changeOrder(toList, prevIndex, currentIndex);
      });
    } else {
      this.changeOrder(toList, prevIndex, currentIndex);
    }
  }

  changeOrder(toList: string, prevIndex: number, currentIndex: number) {
    switch (toList) {
      case TaskStatus.TODO.toString():
        this.calculateOrder(prevIndex, currentIndex, this.todo);
        console.log('Todo');
        break;
      case TaskStatus.IN_PROGRESS.toString():
        this.calculateOrder(prevIndex, currentIndex, this.progress);
        console.log('In progress');
        break;
      case TaskStatus.DONE.toString():
        this.calculateOrder(prevIndex, currentIndex, this.done);
        console.log('Done');
        break;
    }
  }

  calculateOrder(prevIndex: number, currentIndex: number, filterList: TaskDto[]) {
    let start = Math.min(prevIndex, currentIndex);
    const end = Math.max(prevIndex, currentIndex);

    const list = filterList.filter((f) => f.order >= start && f.order <= end);
    for (let i = 0; i < list.length; i++) {
      if (i == 0) {
        list[i].order = start;
      } /*else if (i == list.length - 1) {
        list[i].order = end;
      }*/ else {
        list[i].order = start;
      }
      start++;
    }

    this.taskService.reorderTask(list).subscribe((response) => {
      //console.log(response);
    });
  }

  findNewList(toList: String): number {
    let size = 0;
    switch (toList) {
      case TaskStatus.TODO.toString():
        size = this.todo.length;
        console.log('TO do');
        break;
      case TaskStatus.IN_PROGRESS.toString():
        size = this.progress.length;
        console.log('In progress');
        break;
      case TaskStatus.DONE.toString():
        size = this.done.length;
        console.log('Done');
        break;
    }
    return size;
  }
}
