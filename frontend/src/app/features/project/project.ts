import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { ProjectDto } from '../../shared/dto/project.dto';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule } from '@angular/forms';
//import { ChatMessageDto } from '../../shared/dto/chat-message.dto';
//import { AuthService } from '@shared/services/api/auth.service'; from '@shared/services/api/auth.service'; from '../../shared/services/auth.service';
import { AuthService } from '@shared/services/api/auth.service';
//import { AvatarPhoto } from '../../shared/components/avatar-photo/avatar-photo';
//import { Subscription } from 'rxjs';
//import { WebSocketService } from '../../shared/services/web-socket.service';
import { ChatBox } from '../../shared/components/chat-box/chat-box';
import { MatDialog } from '@angular/material/dialog';
import { ProjectEditModal } from '../../shared/modals/project-edit-modal/project-edit-modal';
import { ProjectMembersModal } from '../../shared/modals/project-members-modal/project-members-modal';
import { ProjectMemberService } from '../../shared/services/api/project-member.service';
import { filter, Subject } from 'rxjs';
import { ProjectService } from '@shared/services/api/project.service';
import { UserActivityService } from '@shared/services/api/user-activity.service';
import { UserActivityDto } from '@shared/dto/user-activity.dto';
import { ConfirmDialogComponent } from '@shared/modals/confirm-dialog-component/confirm-dialog-component';
import { GeneratePDFService } from '@shared/services/generate-pdf.service';
import { PermissionsService } from '@shared/services/permission.service';
import { HasPermissionDirective } from 'app/core/directives/permission.directive';
import { Action } from '@shared/enums/action.enum';
import { ProjectRole } from '@shared/enums/project-role.enum';
@Component({
  selector: 'app-project',
  imports: [
    MatIcon,
    TranslatePipe,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    DatePipe,
    MatProgressBar,
    MatProgressSpinnerModule,
    FormsModule,
    ChatBox,
    HasPermissionDirective,
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  private destroy$ = new Subject<void>();
  private projectService = inject(ProjectService);

  private projectMemberService = inject(ProjectMemberService);

  private authService = inject(AuthService);

  private pdfService = inject(GeneratePDFService);

  private activatedRoute = inject(ActivatedRoute);

  readonly permission = inject(PermissionsService);

  readonly dialog = inject(MatDialog);

  readonly Action = Action;

  userId = 0;
  userFullName = '';
  projectId = 0;

  projectName = '';

  startChat: boolean = false;

  project: ProjectDto | null = null;
  progress: any;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.projectService.getProjectById(parseInt(id)).subscribe((response) => {
        this.projectService.setProject(response);
        this.projectId = response.id;
        this.startChat = true;
        this.permission.reset();
        this.setPermission(response.role);
      });
      this.projectService.project$.pipe(filter(Boolean)).subscribe((project) => {
        this.project = project!;
        this.projectId = project!.id;
        this.projectName = project!.name;
        this.permission.reset();
        this.setPermission(project.role);
      });
    }
    const userId = this.authService.getUserId();
    if (userId != undefined) {
      this.userId = userId;
    }
    const fullname = this.authService.getUserFullName();
    if (fullname != null && fullname.length > 0) {
      this.userFullName = fullname;
    }

    if (id != null && this.userId > 0) {
      this.projectMemberService.updateUserLastAccessed(this.userId, parseInt(id)).subscribe();
    }
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(ProjectEditModal, {
      panelClass: 'edit-project-dialog-container',
      data: { project: this.project },
    });
    /*dialogRef.afterClosed().subscribe((result) => {
        //console.log(`Dialog result: ${result}`);
      }); */
  }

  openMembersDialog() {
    const dialogRef = this.dialog.open(ProjectMembersModal, {
      panelClass: 'custom-dialog-container',
      data: { projectId: this.projectId },
    });
    /*dialogRef.afterClosed().subscribe((result) => {
        //console.log(`Dialog result: ${result}`);
      }); */
  }

  generateProjectPdf() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      //panelClass: 'custom-dialog-container',
      data: {
        title: 'Generate PDF',
        message: 'Do you want to generate project PDF?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.project != null) this.pdfService.generateProjectPdf(this.project);
      }
    });
  }

  setPermission(role: ProjectRole | undefined) {
    if (role != undefined) {
      this.permission.setProjectRole(role);
    }
  }

  ngOnDestroy() {
    this.projectService.setProject(null);
    this.permission.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
