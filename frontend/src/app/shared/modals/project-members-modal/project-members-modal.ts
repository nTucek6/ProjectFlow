import { Component, inject } from '@angular/core';
import { MatFormField } from '@angular/material/input';
import { FormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AvatarPhoto } from '../../components/avatar-photo/avatar-photo';
import { MatSelectModule } from '@angular/material/select';

import { ProjectMemberService } from '@shared/services/api/project-member.service';
import { ProjectMemberDto } from '@shared/dto/project-member.dto';
import { ProjectRole } from '@shared/enums/project-role.enum';
import { CustomSearchInput } from '../../components/custom-search-input/custom-search-input';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { UserService } from '@shared/services/api/user-service';
import { Select } from '@shared/model/select';
import { AuthService } from '@shared/services/api/auth.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-project-members-modal',
  imports: [
    // MatFormField,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAnchor,
    MatIcon,
    MatButtonModule,
    MatDialogModule,
    AvatarPhoto,
    MatSelectModule,
    CustomSearchInput,
    MatAutocomplete,
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './project-members-modal.html',
  styleUrl: './project-members-modal.scss',
})
export class ProjectMembersModal {
  private dialogRef = inject(MatDialogRef<ProjectMembersModal>);
  public data = inject(MAT_DIALOG_DATA);

  private projectMemberService = inject(ProjectMemberService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  private toast = inject(NgToastService);

  projectMembers: ProjectMemberDto[] = [];

  search: string = '';

  addNewMembers: boolean = false;

  myControl = new FormControl('');
  options!: Observable<Select[]>;


  roles = [
    { value: 'MEMBER', label: 'MEMEBER' },
    { value: 'VIEWER', label: 'VIEWER' },
  ];

  private searchSubject = new Subject<string>();

  readonly membersPosts$ = this.searchSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((search) =>
      this.projectMemberService.fetchProjectMembers(this.data.projectId, search)
    )
  );

  ngOnInit() {
    this.membersPosts$.subscribe((members) => {
      this.projectMembers = members;
    });
    this.searchMembers();

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
                  //!this.selectedUsers.some((m) => m.value === u.value)
                  !this.projectMembers.some((m)=> m.userId === u.value)
              )
            )
          )
      )
    );
  }

  toggleAddNewMembers() {
    this.addNewMembers = !this.addNewMembers;
  }

  onRoleChange(role: ProjectRole, id: number) {
    this.projectMemberService
      .updateUserRole(id, role)
      .subscribe(() => this.toast.success('User role updated!'));
  }

  searchMembers() {
    this.searchSubject.next(this.search);
  }

  setSearch(search: string) {
    this.search = search;
    this.searchMembers();
  }
  clearSearch() {
    this.search = '';
    this.searchMembers();
  }

  addMember(user: any) {
    console.log(user);
   /* if (!this.selectedUsers.some((m) => m.value === user.value)) {
      this.selectedUsers.push(user);
      this.myControl.setValue('');
    } */
  }
}
