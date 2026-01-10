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
  merge,
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
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-members-modal',
  imports: [
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
    MatChipsModule,
    MatIconModule,
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

  selectedUsers: Select[] = [];

  roles = [
    { value: 'MEMBER', label: 'MEMEBER' },
    { value: 'VIEWER', label: 'VIEWER' },
  ];

  private searchSubject = new Subject<string>();
  private refreshSubject = new Subject<void>();

  /*readonly membersPosts$ = this.searchSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((search) =>
      this.projectMemberService.fetchProjectMembers(this.data.projectId, search)
    )
  ); */

  readonly membersPosts$ = merge(
    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((search) =>
        this.projectMemberService.fetchProjectMembers(this.data.projectId, search)
      )
    ),
    this.refreshSubject.pipe(
      switchMap(() => this.projectMemberService.fetchProjectMembers(this.data.projectId, ''))
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
                  !this.projectMembers.some((m) => m.userId === u.value)
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
    if (!this.selectedUsers.some((m) => m.value === user.value)) {
      this.selectedUsers.push(user);
      this.myControl.setValue('');
    }
  }

  refreshMembers() {
    this.refreshSubject.next(); // Bypasses debounce
  }

  inviteNewMembers() {
    this.projectMemberService
      .addNewMembers(this.data.projectId, this.selectedUsers)
      .subscribe(() => {
        this.toast.success('Members added successfully!');
        this.toggleAddNewMembers();
        this.refreshMembers();
      });
  }

  removeMember(userId: number) {
    this.search = '';
    this.projectMemberService.removeMember(this.data.projectId, userId).subscribe(() => {
      this.toast.success('Member removed successfully!');
      this.refreshMembers();
    });
  }
}
