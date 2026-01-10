import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { BasicInformation } from "./components/basic-information/basic-information";
import { ProjectDto } from '../../dto/project.dto';
import { ProjectService } from '@shared/services/api/project.service';
import { ProjectDescription } from "./components/project-description/project-description";
import { ProjectSettings } from "./components/project-settings/project-settings";


@Component({
  selector: 'app-project-edit-modal',
  imports: [MatButtonModule, MatIcon, MatDialogModule, BasicInformation, ProjectDescription, ProjectSettings],
  templateUrl: './project-edit-modal.html',
  styleUrl: './project-edit-modal.scss',
})
export class ProjectEditModal {
 private dialogRef = inject(MatDialogRef<ProjectEditModal>);
  public data = inject(MAT_DIALOG_DATA);

  activeTab: string = 'basic'; 

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
