import { inject, Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage, Message, Stomp, StompSubscription } from '@stomp/stompjs';
//import { ChatMessageDto } from '../dto/chat-message.dto';
import { ChatMessageDto } from '@shared/dto/chat-message.dto';
//import { ProjectService } from './project.service';
import { ProjectService } from '@shared/services/api/project.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private projectService = inject(ProjectService);

  private connected = false;

  private stompClient!: Client;

  private projectSubscriptions: Map<number, StompSubscription> = new Map();

  connect(projectId: number) {
    const socket = new SockJS('http://localhost:8080/chat');

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      //debug: (str) => console.log(str),
    });

    this.stompClient.onConnect = () => {
      this.connected = true;
      console.log('STOMP connected');

      const subscription = this.stompClient.subscribe(
        `/project/${projectId}`,
        (message: IMessage) => {
          // console.log('Message received', message.body);
          this.projectService.recivedMessage(JSON.parse(message.body));
        }
      );
      this.projectSubscriptions.set(projectId, subscription);
    };

    this.stompClient.activate();
  }

  send(message: ChatMessageDto) {
    if (!this.connected) {
      console.warn('STOMP not connected yet');
      return;
    }
    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
    });
  }

  unsubscribeFromProject(projectId: number) {
    const subscription = this.projectSubscriptions.get(projectId);
    if (subscription != undefined) {
      subscription.unsubscribe();
      this.projectSubscriptions.delete(projectId);
      console.log(`Unsubscribed from project ${projectId}`);
    }

    if (this.projectSubscriptions.size === 0) {
      if (this.stompClient.active) {
        this.stompClient.deactivate();
        console.log('Disconnected - no active projects');
      }
    }
    // this.stompClient.deactivate();
  }
}
