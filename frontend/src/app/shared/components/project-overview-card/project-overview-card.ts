import { Component, inject, Input } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatAnchor } from "@angular/material/button";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-overview-card',
  imports: [MatProgressBarModule, MatAnchor, CommonModule],
  templateUrl: './project-overview-card.html',
  styleUrl: './project-overview-card.scss',
})
export class ProjectOverviewCard {

  private router = inject(Router);

  @Input() project_id = 0;
  @Input() project_name : string = '';
  @Input() mentor : string = '';
  @Input() deadline : Date = new Date();
  @Input() status : string = '';
  @Input() progress : Number = 0;

  navigateToProject(){
    this.router.navigate(['/']);
  }

}
