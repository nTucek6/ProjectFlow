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
import { UserActivityService } from '../../../shared/services/user-activity.service';
import { UserActivityDto } from '../../../shared/dto/user-activity.dto';
import { AuthService } from '../../../shared/services/auth.service';
import { TaskStatusLabel } from '../../../shared/enums/labels/task-status-label';

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
  private userActivityService = inject(UserActivityService);
  private authService = inject(AuthService);

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

    const previousStatus = draggedItem.statusText;

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
      draggedItem.statusText = this.getStatusLabel(parseInt(toList));
      draggedItem.order = currentIndex;

      console.log(toList)

      this.taskService.updateTask(draggedItem).subscribe((response) => {
        const oldLastIndex = this.findKanbanList(fromList);

        this.changeOrder(fromList, prevIndex, oldLastIndex);

        const lastIndex = this.findKanbanList(toList);

        if (lastIndex != currentIndex) {
          this.changeOrder(toList, lastIndex + 1, currentIndex);
        } else {
          this.changeOrder(toList, lastIndex, currentIndex);
        }

        this.logBoardChangeTask(draggedItem, previousStatus);
        

      });
    } else {
      this.changeOrder(toList, prevIndex, currentIndex);
    }
  }

  changeOrder(toList: string, prevIndex: number, currentIndex: number) {
    switch (toList) {
      case TaskStatus.TODO.toString():
        this.calculateOrder(prevIndex, currentIndex, this.todo);
        break;
      case TaskStatus.IN_PROGRESS.toString():
        this.calculateOrder(prevIndex, currentIndex, this.progress);
        break;
      case TaskStatus.DONE.toString():
        this.calculateOrder(prevIndex, currentIndex, this.done);
        break;
    }
  }

  calculateOrder(prevIndex: number, currentIndex: number, filterList: TaskDto[]) {
    let start = Math.min(prevIndex, currentIndex);
    const end = Math.max(prevIndex, currentIndex);

    const list = filterList.filter((f) => f.order >= start && f.order <= end);

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
    return lastIndex;
  }

  editItem(task: TaskDto) {
    console.log(task);
  }

  logBoardChangeTask(task: TaskDto, previousStatus: string){

    console.log(task.statusText, previousStatus)

    const userId = this.authService.getUserId();
    const userFullName = this.authService.getUserFullName();

    const projectId = this.project()?.id;

    if(userId != undefined && projectId != undefined){
    const log: UserActivityDto = {
      userId: userId,
      projectId: projectId,
      action: userFullName + " updated task status " + task.title,
      description: userFullName + " changed task status: " + previousStatus + " to: " + task.statusText,
      userFullName:'',
      id:0,
      projectName:'',
      createdAt: new Date()
    }

    this.userActivityService.logUserActivity(log).subscribe((response) =>{
      console.log(response);
    });
    }


  }

    getStatusLabel(status: TaskStatus): string {
    return TaskStatusLabel[status];
  }


}
