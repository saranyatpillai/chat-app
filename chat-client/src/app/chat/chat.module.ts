import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatContactsComponent } from './chat-contacts/chat-contacts.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SafePipe } from './safe.pipe';

const routes = [
  {
      path: '', component: ChatComponent}
];

@NgModule({
  declarations: [
    ChatComponent,
    ChatBoxComponent,
    ChatListComponent,
    ChatContactsComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    PickerModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  // providers: [
  //             ChatService]
})
export class ChatModule { }
