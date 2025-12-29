import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { ChatMessageDto } from '../../dto/chat-message.dto';
import { ProjectService } from '../../services/project.service';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { AvatarPhoto } from "../avatar-photo/avatar-photo";

@Component({
  selector: 'app-chat-box',
  imports: [MatIcon, FormsModule, AvatarPhoto],
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.scss',
})
export class ChatBox {
  private webSocketService = inject(WebSocketService);

  @Input() projectId = 0;
  @Input() userId = 0;
  @Input() userFullName = '';
  @Input() projectName = '';

  private projectService = inject(ProjectService);

  private subscription!: Subscription;

  @ViewChild('chatBox') private chatBox!: ElementRef<HTMLDivElement>;
  @ViewChild('chatTextArea') private chatTextArea!: ElementRef;

  SCROLL_THRESHOLD = 50;

  lastMessageCount = 0;

  hideChat: boolean = true;

  message: string = '';

  chatData: ChatMessageDto[] = [];

  autoScrollEnabled: boolean = true;

  hasOverflow: boolean = false;

  ngOnInit() {
    this.webSocketService.connect(this.projectId);

    this.projectService.getChatMessages(this.projectId, 0, 20).subscribe((response) => {
      this.chatData = response;
      this.projectService.setMessages(response);
      console.log(response);
    });

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
    console.log("Destroyed");
    this.subscription.unsubscribe();
    this.webSocketService.unsubscribeFromProject(this.projectId);
  }
}
