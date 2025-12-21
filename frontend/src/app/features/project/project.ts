import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { ActivatedRoute, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { ProjectDto } from '../../shared/dto/project.dto';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule } from '@angular/forms';
import { ChatMessageDto } from '../../shared/dto/chat-message.dto';
import { AuthService } from '../../shared/services/auth.service';
import { AvatarPhoto } from "../../shared/components/avatar-photo/avatar-photo";

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
    AvatarPhoto
],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  private projectService = inject(ProjectService);

  private authService = inject(AuthService);

  private activatedRoute = inject(ActivatedRoute);

  @ViewChild('chatBox') private chatBox!: ElementRef;
  @ViewChild('chatTextArea') private chatTextArea!: ElementRef;

  SCROLL_THRESHOLD = 100;

  userId = 0;

  hideChat: boolean = true;

  message: string = '';

  chatData: ChatMessageDto[] = [];

  autoScrollEnabled: boolean = true;

  project: ProjectDto | null = null;
  progress: any;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.projectService.getProjectById(parseInt(id)).subscribe((response) => {
        this.project = response;
        this.projectService.setProject(response);
      });
    }

    const userId = this.authService.getUserId();
    if (userId != undefined) {
      this.userId = userId;
    }
  }

  toggleChat() {
    this.hideChat = !this.hideChat;
  }

  sendMessage() {
    if (this.message.trim().length == 0) {
      return;
    }

    this.message = this.message.trim();

    const chat: ChatMessageDto = {
      userId: this.userId,
      message: this.message,
    };
    this.chatData.push(chat);
    this.message = '';

    this.resetAutoGrow();

    if (this.autoScrollEnabled) {
      this.scrollToBottom();
    }
  }

  currentUser(userId: number): boolean {
    if (userId == this.userId) {
      return true;
    }
    return false;
  }

  onScroll() {
    const el = this.chatBox.nativeElement;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    this.autoScrollEnabled = distanceFromBottom < this.SCROLL_THRESHOLD;
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = this.chatBox.nativeElement;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }

  onEnter(event: any) {
    if (event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (!this.message?.trim()) return;

    this.sendMessage();
  }

  autoGrow(el: any) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  resetAutoGrow() {
    setTimeout(() => {
      const el = this.chatTextArea.nativeElement;
      el.style.height = 'auto';
      el.scrollTop = 0;
    }, 0);
  }
}
