import { Component, inject, Input } from '@angular/core';
import { ProjectDto } from '../../../../dto/project.dto';
import { MatFormField } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAnchor } from '@angular/material/button';
import { UpdateProjectDto } from '../../../../dto/update-project.dto';
import { ProjectService } from '../../../../services/project.service';

import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-basic-information',
  imports: [MatFormField, FormsModule, MatInputModule, MatDatepickerModule, MatAnchor],
  templateUrl: './basic-information.html',
  styleUrl: './basic-information.scss',
})
export class BasicInformation {
  @Input() project: ProjectDto | null = null;

  private projectService = inject(ProjectService);
  private toast = inject(NgToastService);

  name: string = '';
  startDate: any = null;
  deadline: any = null;

  ngOnInit() {
    if (this.project != null) {
      this.name = this.project.name;
      this.startDate = this.project.startDate;
      this.deadline = this.project.deadline;
    }
  }

  saveChanges() {
    if (this.project != null) {
      const update: UpdateProjectDto = {
        name: this.name,
        deadline: this.deadline,
        startDate: this.startDate,
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
