import { inject, Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskDto } from '@shared/dto/task.dto';
import { UserActivityDto } from '@shared/dto/user-activity.dto';
import { TaskService } from '@shared/services/api/task.service';
import { AuthService } from '@shared/services/api/auth.service';
import { TaskStatus } from '@shared/enums/task-status.enum';
import { TaskStatusLabel } from '@shared/enums/labels/task-status-label';
import { UserActivityService } from '@shared/services/api/user-activity.service';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private userActivityService = inject(UserActivityService);
  taskStatus = TaskStatus;

  drop(event: CdkDragDrop<TaskDto[]>, todo: TaskDto[], progress: TaskDto[], done: TaskDto[], projectId:any) {
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

      this.taskService.updateTask(draggedItem).subscribe((response) => {
        const oldLastIndex = this.findKanbanList(fromList, todo, progress, done);

        this.changeOrder(fromList, prevIndex, oldLastIndex, todo, progress, done);

        const lastIndex = this.findKanbanList(toList, todo, progress, done);

        if (lastIndex != currentIndex) {
          this.changeOrder(toList, lastIndex + 1, currentIndex, todo, progress, done);
        } else {
          this.changeOrder(toList, lastIndex, currentIndex, todo, progress, done);
        }

       // this.logBoardChangeTask(draggedItem, previousStatus, projectId);
      });
    } else {
      this.changeOrder(toList, prevIndex, currentIndex, todo, progress, done);
    }
  }

  changeOrder(
    toList: string,
    prevIndex: number,
    currentIndex: number,
    todo: TaskDto[],
    progress: TaskDto[],
    done: TaskDto[]
  ) {
    switch (toList) {
      case TaskStatus.TODO.toString():
        this.calculateOrder(prevIndex, currentIndex, todo);
        break;
      case TaskStatus.IN_PROGRESS.toString():
        this.calculateOrder(prevIndex, currentIndex, progress);
        break;
      case TaskStatus.DONE.toString():
        this.calculateOrder(prevIndex, currentIndex, done);
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
      });
    }
  }

  findKanbanList(toList: String, todo: TaskDto[], progress: TaskDto[], done: TaskDto[]): number {
    let lastIndex = 0;
    let size = 0;
    switch (toList) {
      case TaskStatus.TODO.toString():
        size = todo.length;
        if (size > 0) {
          size = size > 0 ? size - 1 : 0;
          lastIndex = todo[size].order;
        }
        break;
      case TaskStatus.IN_PROGRESS.toString():
        size = progress.length;
        if (size > 0) {
          size = size > 0 ? size - 1 : 0;
          lastIndex = progress[size].order;
        }
        break;
      case TaskStatus.DONE.toString():
        size = done.length;
        if (size > 0) {
          size = size > 0 ? size - 1 : 0;
          lastIndex = done[size].order;
        }
        break;
    }
    return lastIndex;
  }

  editItem(task: TaskDto) {
    console.log(task);
  }

  /*
  logBoardChangeTask(task: TaskDto, previousStatus: string, projectId: number) {
    console.log(task.statusText, previousStatus);

    const userId = this.authService.getUserId();
    const userFullName = this.authService.getUserFullName();

    //const projectId = this.project()?.id;

    if (userId != undefined && projectId != undefined) {
      const log: UserActivityDto = {
        userId: userId,
        projectId: projectId,
        action: userFullName + ' updated task status ' + task.title,
        description:
          userFullName + ' changed task status: ' + previousStatus + ' to: ' + task.statusText,
        userFullName: '',
        id: 0,
        projectName: '',
        createdAt: new Date(),
      };

      this.userActivityService.logUserActivity(log).subscribe((response) => {
        //console.log(response);
      });
    }
  }*/

  getStatusLabel(status: TaskStatus): string {
    return TaskStatusLabel[status];
  }
}
