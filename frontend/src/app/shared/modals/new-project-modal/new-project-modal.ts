import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

import { MatDialogRef } from '@angular/material/dialog';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { UserService } from '../../services/user-service';
import { Select } from '../../model/select';

import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NewProjectMilestoneDto } from '../../dto/new-project-milestone.dto';
import { NewProjectDto } from '../../dto/new-project.dto';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-new-project-modal',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
  ],
  templateUrl: './new-project-modal.html',
  styleUrl: './new-project-modal.scss',
})
export class NewProjectModal {
  private dialogRef = inject(MatDialogRef<NewProjectModal>);

  private userService = inject(UserService);

  private authService = inject(AuthService);

  private projectService = inject(ProjectService);

  name: string = '';

  deadline = '';

  myControl = new FormControl('');

  options!: Observable<Select[]>;

  selectedUsers: Select[] = [];

  showCustomMilestones: boolean = false;

  customMilestone: NewProjectMilestoneDto[] = [];

  milestoneName = '';
  milestoneDescription = '';
  milestoneColor = '';

  ngOnInit() {
    this.options = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((value: any) => value && value.length > 0),
      switchMap((value) =>
        this.userService
          .searchUsers(value || '')
          .pipe(
            map((users) =>
              users.filter(
                (u) =>
                  u.value !== this.authService.getUserId() &&
                  !this.selectedUsers.some((m) => m.value === u.value)
              )
            )
          )
      )
    );
  }

  addMember(user: any) {
    console.log(user);
    if (!this.selectedUsers.some((m) => m.value === user.value)) {
      this.selectedUsers.push(user);
      this.myControl.setValue('');
    }
  }

  addCustomMilestone() {
    this.customMilestone.push({
      name: this.milestoneName,
      description: this.milestoneDescription,
      color: this.milestoneColor,
    });
    this.milestoneName = '';
    this.milestoneDescription = '';
    this.milestoneColor = '';
  }

  submit() {
    let milesones: NewProjectMilestoneDto[] = [];
    let membersId: number[] = [];

    if (this.showCustomMilestones && this.customMilestone.length > 0) {
      milesones = this.customMilestone;
    }

    if (this.selectedUsers.length > 0) {
      membersId = this.selectedUsers.map((f) => f.value);
    }

    let owner = this.authService.getUserId();
    if (owner != undefined) {

      const newProject: NewProjectDto = {
        name: this.name,
        membersId: membersId,
        customMilestones: milesones,
        deadline: this.deadline,
        ownerId: owner,
      };

      console.log(newProject);

      this.projectService.createNewProject(newProject).subscribe((response) => {
        console.log(response);
        this.dialogRef.close('done');
        alert('Project added, ' + response.name);
      });
    }
  }
}
