import { Component, effect, inject } from '@angular/core';
import { ProjectService } from '../../../shared/services/project.service';

import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectDto } from '../../../shared/dto/project.dto';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
  selector: 'app-overview',
  imports: [DatePipe, MatProgressBar],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  
  private projectService = inject(ProjectService);
  private tabTitle = inject(Title);

  project = toSignal<ProjectDto | null>(this.projectService.project$);

  logProjectNameEffect = effect(() => {
    const p = this.project();
    if (p) {
      this.tabTitle.setTitle(p.name + " - Overview")
    }
  });
}
