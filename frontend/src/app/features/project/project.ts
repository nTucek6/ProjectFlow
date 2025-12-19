import { Component, inject } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { ActivatedRoute, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { ProjectDto } from '../../shared/dto/project.dto';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-project',
  imports: [
    MatIcon,
    TranslatePipe,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    DatePipe,
    MatProgressBar,
    MatProgressSpinnerModule,
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  private projectService = inject(ProjectService);

  private activatedRoute = inject(ActivatedRoute);

  project: ProjectDto | null = null;
  progress: any;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.projectService.getProjectById(parseInt(id)).subscribe((response) => {
        this.project = response;
        this.projectService.setProject(response);
      });
    }
  }
}
