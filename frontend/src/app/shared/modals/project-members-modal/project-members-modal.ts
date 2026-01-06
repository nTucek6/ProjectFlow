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
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

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
  ],
  templateUrl: './project-members-modal.html',
  styleUrl: './project-members-modal.scss',
})
export class ProjectMembersModal {
  private dialogRef = inject(MatDialogRef<ProjectMembersModal>);
  public data = inject(MAT_DIALOG_DATA);

  private projectMemberService = inject(ProjectMemberService);

  projectMembers: ProjectMemberDto[] = [];

  search: string = '';

  addNewMembers: boolean = false;

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
  }

  toggleAddNewMembers() {
    this.addNewMembers = !this.addNewMembers;
  }

  onRoleChange(role: ProjectRole, id: number) {
    this.projectMemberService
      .updateUserRole(id, role)
      .subscribe((response) => console.log(response));
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
}
