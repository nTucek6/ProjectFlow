import { Component, inject, Input } from '@angular/core';
import { MatFormField } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';
import { ProjectMemberService } from '@shared/services/api/project-member.service';
import { Select } from '@shared/model/select';
import { ProjectMemberDto } from '@shared/dto/project-member.dto';
import { MatAutocompleteModule, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TaskService } from '@shared/services/api/task.service';
import { CreateTaskDto } from '@shared/dto/create-task.dto';

import { NgToastService } from 'ng-angular-popup';
import { TaskDto } from '@shared/dto/task.dto';
import { AuthService } from '@shared/services/api/auth.service';
import { UserActivityDto } from '@shared/dto/user-activity.dto';

@Component({
  selector: 'app-project-item-edit-modal',
  imports: [
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogActions,
    MatDialogModule,
    MatButtonModule,
    MatOption,
    AsyncPipe,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './project-item-edit-modal.html',
  styleUrl: './project-item-edit-modal.scss',
})
export class ProjectItemEditModal {
  taskId: number = 0;
  title: string = '';
  description: string = '';
  //@Input() projectId: number = 0;

  taskExist = false;

  private dialogRef = inject(MatDialogRef<ProjectItemEditModal>);
  public data = inject(MAT_DIALOG_DATA);

  private toast = inject(NgToastService);

  private projectMemberService = inject(ProjectMemberService);
  private taskService = inject(TaskService);

  options!: Observable<Select[]>;
  myControl = new FormControl('');

  selectedUsers: Select[] = [];

  ngOnInit() {
    const task = this.data.task;
    if (task != null) {
      this.taskId = task.id;
      this.title = task.title;
      this.description = task.description;
      this.selectedUsers = task.assignees;
      this.taskExist = true;
    }

    this.options = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((value: any) => value && value.length > 0),
      switchMap((value) =>
        this.projectMemberService
          .searchProjectMembers(this.data.projectId, value || '')
          .pipe(
            map((users) =>
              users.filter((u) => !this.selectedUsers.some((m) => m.value === u.value))
            )
          )
      )
    );
  }

  addTaskMember(user: Select) {
    if (!this.selectedUsers.some((m) => m.label === user.label)) {
      this.selectedUsers.push(user);
      this.myControl.setValue('');
    }
  }

  submit() {

    if(this.title.trim().length == 0){
      return;
    }

    if (this.taskId == 0) {
      const newTask: CreateTaskDto = {
        projectId: this.data.projectId,
        title: this.title,
        description: this.description,
        assignees: this.selectedUsers,
        projectMilestoneId: 0,
      };

      this.taskService.saveTask(newTask).subscribe((response) => {
        this.dialogRef.close(true);
        this.toast.success('Task added: ' + response.title);
      });
    } else {
      const task: TaskDto = this.data.task;
      console.log(this.selectedUsers);
      const updateTask: TaskDto = {
        id: this.taskId,
        title: this.title,
        description: this.description,
        assignees: this.selectedUsers,
        createdAt: task.createdAt,
        status: task.status,
        statusText: task.statusText,
        order: task.order,
      };

      this.taskService.updateTask(updateTask).subscribe((response) => {
        this.dialogRef.close(true);
        this.toast.success('Task updated: ' + response.title);
      });
    }
  }
  deleteTask() {
    this.taskService.deleteTask(this.taskId).subscribe(() => {
      this.dialogRef.close(true);
      this.toast.danger('Task removed: ' + this.title);
    });
  }

}
