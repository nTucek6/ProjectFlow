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
import { AvatarPhoto } from '../../shared/components/avatar-photo/avatar-photo';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../shared/services/web-socket.service';

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
    AvatarPhoto,
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  private projectService = inject(ProjectService);

  private authService = inject(AuthService);

  private activatedRoute = inject(ActivatedRoute);

  private webSocketService = inject(WebSocketService);

  private subscription!: Subscription;

  @ViewChild('chatBox') private chatBox!: ElementRef<HTMLDivElement>;
  @ViewChild('chatTextArea') private chatTextArea!: ElementRef;

  SCROLL_THRESHOLD = 50;

  lastMessageCount = 0;

  userId = 0;
  userFullName = '';
  projectId = 0;

  hideChat: boolean = true;

  message: string = '';

  chatData: ChatMessageDto[] = [];

  autoScrollEnabled: boolean = true;

  hasOverflow : boolean = false;

  project: ProjectDto | null = null;
  progress: any;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.projectService.getProjectById(parseInt(id)).subscribe((response) => {
        this.project = response;
        this.projectService.setProject(response);
        this.projectId = this.project.id;

        this.webSocketService.connect(this.project.id);

        this.projectService.getChatMessages(this.project.id, 0, 20).subscribe((response) => {
          this.chatData = response;
          this.projectService.setMessages(response);
          console.log(response);
        });
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

    this.subscription = this.projectService.chat$.subscribe((messages) => {
      //console.log('Chat updated:', messages);
      if (messages != null && messages.length > 0) {
        this.chatData = messages;

        const hasNewMessage = messages.length > this.lastMessageCount;
        this.lastMessageCount = messages.length;

        if (hasNewMessage && this.autoScrollEnabled) {
          this.scrollToBottom();
        }
      }
    });
  }

  toggleChat() {
    this.hideChat = !this.hideChat;

    if (!this.hideChat) {
      setTimeout(() => this.scrollToBottom());
    }
  }

  sendMessage() {
    if (this.message.trim().length == 0) {
      return;
    }

    this.message = this.message.trim();

    const chat: ChatMessageDto = {
      sender: this.userId,
      content: this.message,
      type: 'SEND',
      fullName: this.userFullName,
      projectId: this.projectId,
    };
    this.message = '';

    this.webSocketService.send(chat);

    this.resetAutoGrow();
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
    requestAnimationFrame(() => {
      const el = this.chatBox?.nativeElement;
      if (!el) return;

      el.scrollTop = el.scrollHeight;
      this.hasOverflow = el.scrollHeight > el.clientHeight;

      this.autoScrollEnabled = true;
    });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.webSocketService.unsubscribeFromProject(this.projectId);
  }
}
