import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
    // AvatarPhoto,
    ChatBox,
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  private destroy$ = new Subject<void>();
  private projectService = inject(ProjectService);

  private projectMemberService = inject(ProjectMemberService);

  private authService = inject(AuthService);

  private activatedRoute = inject(ActivatedRoute);

  readonly dialog = inject(MatDialog);

  userId = 0;
  userFullName = '';
  projectId = 0;
  projectName = '';

  project: ProjectDto | null = null;
  progress: any;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.projectService.getProjectById(parseInt(id)).subscribe((response) => {
        //this.project = response;
        this.projectService.setProject(response);
        //this.projectId = this.project.id;
        //this.projectName = this.project.name;
      });
      this.projectService.project$.pipe(filter(Boolean)).subscribe((project) => {
        this.project = project!;
        this.projectId = project!.id;
        this.projectName = project!.name;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
