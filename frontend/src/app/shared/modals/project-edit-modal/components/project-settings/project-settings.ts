import { Component, inject, Input } from '@angular/core';
import { ProjectDto } from '@shared/dto/project.dto';
import { MatAnchor } from '@angular/material/button';
import { ConfirmDialogComponent } from '@shared/modals/confirm-dialog-component/confirm-dialog-component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '@shared/services/api/project.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ProjectEditModal } from '../../project-edit-modal';

@Component({
  selector: 'app-project-settings',
  imports: [MatAnchor],
  templateUrl: './project-settings.html',
  styleUrl: './project-settings.scss',
})
export class ProjectSettings {
  @Input() project: ProjectDto | null = null;
  private dialogRef = inject(MatDialogRef<ProjectEditModal>);

  readonly dialog = inject(MatDialog);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private toast = inject(NgToastService);

  deleteProject() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      //panelClass: 'custom-dialog-container',
      data: {
        title: 'Delete project',
        message: 'Do you want really want to delete project: ' + this.project?.name + '?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.project != null)
          this.projectService.deleteProject(this.project.id).subscribe({
            next: (response) => {
              this.dialogRef.close();
              this.toast.danger('Project deleted succesfuly!');
              this.router.navigate(['/projects']);
            },
            error: (err) => {},
          });
      }
    });
  }
}
