import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TwoLineInfoCard } from "../../shared/components/two-line-info-card/two-line-info-card";
import { ProjectOverviewCard } from "../../shared/components/project-overview-card/project-overview-card";
import { AvatarPhoto } from "../../shared/components/avatar-photo/avatar-photo";
import { ActivityCard } from "../../shared/components/activity-card/activity-card";

@Component({
  selector: 'app-home',
  imports: [TwoLineInfoCard, ProjectOverviewCard, ActivityCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private authService = inject(AuthService);

  user_name = '';
  
  ngOnInit(): void {
    const name = this.authService.getUserFirstName();
    if (name != undefined) this.user_name = name;
  }
}
