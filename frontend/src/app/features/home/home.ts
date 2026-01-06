import { Component, inject } from '@angular/core';
//import { AuthService } from '@shared/services/api/auth.service'; from '@shared/services/api/auth.service'; from '../../shared/services/auth.service';
import { AuthService } from '@shared/services/api/auth.service';
import { TwoLineInfoCard } from '../../shared/components/two-line-info-card/two-line-info-card';
import { ProjectOverviewCard } from '../../shared/components/project-overview-card/project-overview-card';
import { AvatarPhoto } from '../../shared/components/avatar-photo/avatar-photo';
import { ActivityCard } from '../../shared/components/activity-card/activity-card';

import { DashboardSummaryDto } from '../../shared/dto/dashboard-summary.dto';
import { ProjectMemberService } from '../../shared/services/api/project-member.service';
import { ProjectDto } from '../../shared/dto/project.dto';
import { UserActivityService } from '@shared/services/api/user-activity.service';
import { UserActivityDto } from '../../shared/dto/user-activity.dto';
import { ProjectService } from '@shared/services/api/project.service';

@Component({
  selector: 'app-home',
  imports: [TwoLineInfoCard, ProjectOverviewCard, ActivityCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private authService = inject(AuthService);

  private projectService = inject(ProjectService);

  private projectMemberService = inject(ProjectMemberService);

  private userActivityService = inject(UserActivityService);

  user_name = '';

  userSummary: DashboardSummaryDto | null = null;

  recentProjects: ProjectDto[] = [];
  recentActivities: UserActivityDto[] = [];

  ngOnInit(): void {
    const name = this.authService.getUserFirstName();
    if (name != undefined) {
      this.user_name = name;
    }
    const id = this.authService.getUserId();
    if (id != undefined) {
      this.getUserSummary(id);
      this.getRecentProjects(id);
      this.getRecentActivities(id);
    }
  }

  getUserSummary(userId: number) {
    this.projectService.getUserSummary(userId).subscribe((response) => {
      this.userSummary = response;
    });
  }

  getRecentProjects(userId: number) {
    this.projectMemberService.getRecentUserProjects(userId).subscribe((response) => {
      this.recentProjects = response;
    });
  }

   getRecentActivities(userId: number) {
    this.userActivityService.fetchRecentActivities(userId).subscribe((response) => {
      this.recentActivities = response;
    });
  }

}
