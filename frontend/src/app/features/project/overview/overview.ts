import { Component, effect, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectDto } from '../../../shared/dto/project.dto';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatProgressBar } from '@angular/material/progress-bar';

import { TaskDto } from '../../../shared/dto/task.dto';
//import { AuthService } from '@shared/services/api/auth.service';
import { AuthService } from '@shared/services/api/auth.service';
import { ProjectService } from '@shared/services/api/project.service';
import { TaskService } from '@shared/services/api/task.service';
import { UserActivityService } from '@shared/services/api/user-activity.service';
import { UserActivityDto } from '@shared/dto/user-activity.dto';
import { ActivityCard } from "@shared/components/activity-card/activity-card";

@Component({
  selector: 'app-overview',
  imports: [DatePipe, MatProgressBar, ActivityCard],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private tabTitle = inject(Title);
  private userActivityService = inject(UserActivityService);

  project = toSignal<ProjectDto | null>(this.projectService.project$);
  recentProjectActivity: UserActivityDto[] = [];

  tasks: TaskDto[] = [];

  logProjectNameEffect = effect(() => {
    const p = this.project();
    if (p) {
      this.tabTitle.setTitle(p.name + ' - Overview');
    }
  });

  lastFetchedProjectId = 0;

  tasksEffect = effect(() => {
    const currentProject = this.project();
    const userId = this.authService.getUserId();

    if (currentProject && currentProject.id !== this.lastFetchedProjectId && userId != undefined) {
      this.lastFetchedProjectId = currentProject.id; // prevent duplicate calls

      this.taskService.fetchUserTop3Tasks(currentProject.id, userId).subscribe({
        next: (data) => {
          //console.log('API data:', data);
          this.tasks = data;
          // handle the data as needed
        },
        error: (err) => {
          console.error('API error:', err);
        },
      });
      this.userActivityService.fetchProjectRecentActivities(currentProject.id).subscribe((response) => {
        this.recentProjectActivity = response;
      });
    }
  });
}
