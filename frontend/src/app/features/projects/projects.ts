import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectService } from '../../shared/services/project.service';
import { debounceTime, distinctUntilChanged, map, Subject, switchMap } from 'rxjs';
import { ProjectFilterParams } from '../../shared/model/project-filter-params';
import { SearchProjectDto } from '../../shared/dto/search-project.dto';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { NewProjectModal } from '../../shared/modals/new-project-modal/new-project-modal';

@Component({
  selector: 'app-projects',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    DatePipe,
    MatIcon,
    MatIconButton,
    MatAnchor,
    RouterLink,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private projectService = inject(ProjectService);

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['index', 'name', 'owner', 'deadline'];
  dataSource = new MatTableDataSource<SearchProjectDto>([]);

  searchData = '';

  page: number = 0;
  size: number = 5;
  length: number = 0;
  ascending: boolean = false;

  selectedDateFrom?: Date;
  selectedDateTo?: Date;

  private searchSubject = new Subject<ProjectFilterParams>();

  readonly projectPosts$ = this.searchSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((filterParams) =>
      this.projectService.fetchProjects(this.page, this.size, filterParams, this.ascending)
    )
  );
  searchProjects() {
    const projectFilterParams: ProjectFilterParams = {
      title: this.searchData,
      startDateTimeFrom: this.selectedDateFrom,
      startDateTimeTo: this.selectedDateTo,
    };

    this.searchSubject.next(projectFilterParams);
  }

  ngOnInit() {
    this.projectPosts$.subscribe((projects) => {
      this.dataSource.data = projects;
    });

    this.searchProjects();
  }

  clearSearch() {
    this.searchData = '';
    this.searchProjects();
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewProjectModal, { panelClass: 'custom-dialog-container' });
    /*dialogRef.afterClosed().subscribe((result) => {
      //console.log(`Dialog result: ${result}`);
    }); */
  }
}
