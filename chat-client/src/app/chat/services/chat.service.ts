import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';

@Injectable()
export class ChatService {

    sender = localStorage.getItem('currentUser');
    receiver = '';
    room = '';
    grp: any = {};
    outputChats: any = {};
    typingList: any = {};
    keyName = null;
    activeUsers: any = [];
    currentUsers: any = [
        { userName: 'saranya', password: 'saranya123', profilePic: 'no_profilepic.png' },
        { userName: 'mahesh', password: 'mahesh123', profilePic: 'prifile_pic_common.jpg' },
        { userName: 'aruna', password: 'aruna123', profilePic: 'no_profilepic.png' }
    ];
    currentGroups: any = [
        {
            grpname: 'grp1',
            id: '12',
            room: 'grp1_12',
            profilePic: 'grp_no_profile.png',
            members: [
                { userName: 'saranya', password: 'saranya123' },
                { userName: 'mahesh', password: 'mahesh123' },
                { userName: 'aruna', password: 'aruna123' }
            ]
        },
        {
            grpname: 'grp2',
            id: '14',
            room: 'grp2-14',
            profilePic: 'grp_no_profile.png',
            members: [
                { userName: 'saranya', password: 'saranya123' },
                { userName: 'mahesh', password: 'mahesh123' },
            ]
        }
    ];
    userList: any = [];
    groups: any = [];

    constructor(private webSocketService: WebSocketService,
                private http: HttpClient) { }

    setCurrentUserAccount(user = this.sender): void {
        this.sender = this.sender ? this.sender : user;
        this.webSocketService.emit('newUser', { username: user });
        this.userList = this.currentUsers.filter((item) => item.userName !== user);
        this.groups =
            this.currentGroups.filter((item) => item.members.find((member) => member.userName === user));
        this.joinGroups();
        this.setActiveUsers();
    }


    joinGroups(): void {
        this.groups.forEach(group => {
            this.webSocketService.emit('joinRoom', { room: group.room });
            this.outputChats[group.room] = [];
        });
    }

    setActiveUsers(activeUsers = this.activeUsers): void {
        if (activeUsers) {
            this.userList.forEach(user => {
                user.isActive = activeUsers.includes(user.userName) ? true : false;
            });
        }
    }

    upload(uploadedFiles): any {
        const formData = new FormData();
        for (const file of uploadedFiles) {
            formData.append('uploads[]', file, file.name);
        }
        this.http.post('/api/upload', formData)
            .subscribe((response) => {
                console.log('response received is ', response);
            });
    }
}
