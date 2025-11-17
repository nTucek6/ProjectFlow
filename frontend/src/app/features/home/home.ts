import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TwoLineInfoCard } from "../../shared/components/two-line-info-card/two-line-info-card";
import { ProjectOverviewCard } from "../../shared/components/project-overview-card/project-overview-card";

@Component({
  selector: 'app-home',
  imports: [TwoLineInfoCard, ProjectOverviewCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private authService = inject(AuthService);

  user_name = '';

  ngOnInit(): void {
    const name = this.authService.getUserFirstName();
    if (name != null) this.user_name = name;
  }
}
