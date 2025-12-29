import { Component, inject, Input } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-project-overview-card',
  imports: [MatProgressBarModule, CommonModule, MatIcon],
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
  @Input() members : Number = 0;

  navigateToProject(){
    this.router.navigate(['/project/'+ this.project_id]);
  }

}
