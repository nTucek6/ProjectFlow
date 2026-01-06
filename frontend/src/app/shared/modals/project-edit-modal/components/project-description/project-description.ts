import { Component, inject, Input } from '@angular/core';
import { ProjectDto } from '@shared/dto/project.dto';
import { UpdateProjectDto } from '@shared/dto/update-project.dto';
import { ProjectService } from '@shared/services/api/project.service';

import { NgToastService } from 'ng-angular-popup';
import { MatFormField, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-project-description',
  imports: [MatFormField, MatLabel, FormsModule, MatInputModule, MatButtonModule, TextFieldModule],
  templateUrl: './project-description.html',
  styleUrl: './project-description.scss',
})
export class ProjectDescription {
  @Input() project: ProjectDto | null = null;
  private projectService = inject(ProjectService);
  toast = inject(NgToastService);

  description: string = '';

  ngOnInit() {
    if (this.project != null) {
      this.description = this.project.description;
    }
  }

  saveChanges() {
    if (this.project != null) {
      const update: UpdateProjectDto = {
        name: this.project.name,
        description: this.description,
        deadline: this.project.deadline,
        startDate: this.project.startDate,
        updatedAt: this.project.updatedAt,
      };
      this.projectService.updateProject(this.project.id, update).subscribe((response) => {
        this.projectService.setProject(response);
        this.project = response;
        this.toast.success('Successful update!');
      });
    }
  }
}
