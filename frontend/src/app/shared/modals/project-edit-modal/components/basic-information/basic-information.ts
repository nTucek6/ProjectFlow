import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ProjectDto } from '../../../../dto/project.dto';
import { MatFormField } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAnchor } from '@angular/material/button';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { UpdateProjectDto } from '../../../../dto/update-project.dto';
import { ProjectService } from '@shared/services/api/project.service';

import { NgToastService } from 'ng-angular-popup';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-basic-information',
  imports: [
    MatFormField,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatAnchor,
    MatTimepickerModule,
  ],
  templateUrl: './basic-information.html',
  styleUrl: './basic-information.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      if (this.startDate != null) {
        this.startDate = new Date(this.project.startDate);
      }

      this.deadline = new Date(this.project.deadline);
    }
  }

  saveChanges() {
    if (this.project != null) {
      const update: UpdateProjectDto = {
        name: this.name,
        description: this.project.description,
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
