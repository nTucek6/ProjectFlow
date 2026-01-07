import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ProjectFilterParams } from '../../shared/model/project-filter-params';
import { SearchProjectDto } from '../../shared/dto/search-project.dto';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { MatDialog } from '@angular/material/dialog';
import { NewProjectModal } from '../../shared/modals/new-project-modal/new-project-modal';
import { CustomSearchInput } from '../../shared/components/custom-search-input/custom-search-input';
import { ProjectService } from '@shared/services/api/project.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '@shared/services/api/auth.service';

@Component({
  selector: 'app-projects',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    DatePipe,
    MatIcon,
    MatAnchor,
    RouterLink,
    MatDatepickerModule,
    CustomSearchInput,
    MatPaginatorModule,
  ],
  templateUrl: './projects.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './projects.scss',
})
export class Projects {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['index', 'name', 'owner', 'deadline'];
  dataSource = new MatTableDataSource<SearchProjectDto>([]);

  searchData = '';

  startDate = '';
  endDate = '';

  showFilter = false;

  page: number = 0;
  size: number = 5;
  length: number = 0;
  ascending: boolean = false;

  private searchSubject = new Subject<ProjectFilterParams>();

  readonly projectPosts$ = this.searchSubject.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    switchMap((filterParams) =>
      this.projectService.fetchProjects(this.page, this.size, filterParams, this.ascending)
    )
  );

  setSearch(search: string) {
    this.searchData = search;
    this.searchProjects();
  }

  searchProjects() {
    const userId = this.authService.getUserId();
    if(userId != undefined){
  const projectFilterParams: ProjectFilterParams = {
      title: this.searchData,
      startDateTimeFrom: this.startDate,
      startDateTimeTo: this.endDate,
      userId: userId
    };

    //if(this.searchData != null ||)

    if (this.showFilter) {
      this.page = 0;
    }

    this.searchSubject.next(projectFilterParams);
    }
  
  }

  ngOnInit() {
    this.projectPosts$.subscribe((projects) => {
      this.dataSource.data = projects;
      if (projects.length > 0) {
        this.length = projects[0].length;
      } else {
        this.length = 0;
      }
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

  toggleFilter() {
    this.showFilter = !this.showFilter;
    if (!this.showFilter) {
      this.startDate = '';
      this.endDate = '';
      this.searchProjects();
    }
  }

  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex;
    if (event.pageSize != this.size) {
      this.size = event.pageSize;
      this.page = 0;
    }

    this.searchProjects();
  }
}
