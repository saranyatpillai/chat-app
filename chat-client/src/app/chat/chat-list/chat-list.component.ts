import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  userName = null;
  constructor(public chatService: ChatService,
              private router: Router,
              public webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('currentUser');
    this.webSocketService.emit('activeUsers', { username: localStorage.getItem('currentUser'), isActive: true });
    this.webSocketService.listen('activeUsers').subscribe((data) => this.updateActiveUsers(data));
    this.chatService.setCurrentUserAccount(localStorage.getItem('currentUser'));
  }

  updateActiveUsers(data): void {
    this.chatService.activeUsers = data.data;
    this.chatService.setActiveUsers(data.data);
  }

  setReceiver(receiver: string): void {
    this.clearContacts();
    this.chatService.receiver = receiver;
    this.chatService.keyName = receiver;
    if (!Object.keys(this.chatService.outputChats).includes(receiver)) {
      this.chatService.outputChats[receiver] = [];
    }
  }

  setgrpchat(grp): void {
    this.clearContacts();
    this.chatService.grp = grp;
    this.chatService.room = grp.room;
    this.chatService.keyName = this.chatService.room;
  }

  clearContacts(): void {
    this.chatService.grp = null;
    this.chatService.receiver = null;
    this.chatService.room = null;
    this.chatService.keyName = null;
  }

  logout(): void {
    this.webSocketService.emit('activeUsers', { username: localStorage.getItem('currentUser'), isActive: false });
    this.chatService.sender = null;
    this.router.navigate(['login']);
    localStorage.clear();
  }

}
