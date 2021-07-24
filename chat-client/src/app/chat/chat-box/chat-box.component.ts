import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

    chat: any = {
        message: null,
        sender: null,
        receiver: null,
        group: null,
        images: [],
        files: []
    };
    userName: string;
    output: any[] = [];
    feedback: any = {};
    public isEmojiPickerVisible: boolean;
    fileToUpload = null;
    docFile = null;
    fileType = null;
    uploadedFiles: any = [];

    constructor(private webSocketService: WebSocketService,
                public chatService: ChatService) { }

    ngOnInit(): void {
        this.userName = localStorage.getItem('currentUser');
        this.webSocketService.listen('typing').subscribe((data) => this.updateFeedback(data));
        this.webSocketService.listen('chat').subscribe((data) => this.updateMessage(data));
    }

    public addEmoji(event): void {
        this.chat.message = this.chat.message ? this.chat.message + event.emoji.native : event.emoji.native;
    }

    resetChat(): void {
        this.chat = {
            message: null,
            sender: null,
            receiver: null,
            group: null,
            images: [],
            files: []
        };
    }

    messageTyping(event): void {
        this.isEmojiPickerVisible = false;
        this.chat.room = this.chatService.room ? this.chatService.room : null;
        this.chat.grpId = this.chatService.room ? this.chatService.grp.id : null,
            this.chat.sender = this.userName;
        this.chat.receiver = this.chatService.receiver;
        if (event.target.value || this.chat.files.length || this.chat.images.length) {
            this.webSocketService.emit('typing', this.chat);
        } else {
            this.chat.clear = true;
            this.webSocketService.emit('typing', this.chat);
        }
    }

    sendMessage(): void {
        if (this.chat.message || this.chat.files.length || this.chat.images.length) {
            this.isEmojiPickerVisible = false;
            this.chat.room = this.chatService.room ? this.chatService.room : null;
            this.chat.grpId = this.chatService.room ? this.chatService.grp.id : null,
                this.chat.sender = this.userName;
            this.chat.receiver = this.chatService.receiver;
            this.webSocketService.emit('chat', this.chat);
            this.chat.clear = true;
            this.webSocketService.emit('typing', this.chat);
            this.resetChat();
        }
    }

    updateMessage(data: any): any {
        this.feedback = null;
        if (!!!data) {
            return;
        }
        if (data.room) {
            this.chatService.outputChats[data.room].push(data);
            this.chatService.keyName =
                data.room === this.chatService.room ? data.room : this.chatService.keyName;
            // this.chatService.typingList[data.grpId] = [];
        } else {
            if (this.chatService.sender !== data.sender) {
                // this.chatService.typingList[data.receiver] = [];
                this.chatService.keyName = !this.chatService.sender ? data.sender : this.chatService.keyName;
                this.chatService.outputChats[data.sender] = !this.chatService.outputChats[data.sender] ?
                    [] : this.chatService.outputChats[data.sender];
                this.chatService.outputChats[data.sender].push(data);
            } else {
                this.chatService.keyName = data.receiver;
                this.chatService.outputChats[data.receiver] = !this.chatService.outputChats[data.receiver] ?
                    [] : this.chatService.outputChats[data.receiver];
                this.chatService.outputChats[data.receiver].push(data);
            }
        }
        console.log(this.chatService.outputChats);
    }

    updateFeedback(data: any): any {
        this.feedback = data;
        if (data.room) {
            if (data.clear) {
                delete this.chatService.typingList[data.grpId];
            } else {
               // this.chatService.typingList[data.grpId] = [];
                this.chatService.typingList[data.grpId] = data;
            }
        } else {
            if (data.clear) {
                delete this.chatService.typingList[data.sender];
            } else {
              //  this.chatService.typingList[data.sender] = [];
                this.chatService.typingList[data.sender] = data;
            }
        }
    }

    handleFileInput(event: any): void {
        const FILES: any = event.target.files ? event.target.files : null;
        this.uploadedFiles = FILES;
     //   this.chatService.upload(this.uploadedFiles);
        if (FILES) {
            for (const file of FILES) {
                const reader = new FileReader();
                reader.onload = () => {
                    const FILE_OBJECT: any = {};
                    FILE_OBJECT.file = reader.result;
                    FILE_OBJECT.fileName = file.name;
                    FILE_OBJECT.contentType = file.type;
                    FILE_OBJECT.isVideo = this.checkVideo(file.name);
                    this.fileType === 'IMAGE' ? this.chat.images.push(FILE_OBJECT) : this.chat.files.push(FILE_OBJECT);
                };
                reader.readAsDataURL(file);
            }

        }
    }


    checkVideo(filename): boolean {
        return ['m4v', 'avi', 'mpg', 'mp4'].includes((this.getFileExtension(filename)).toLowerCase()) ? true : false;
    }

    getFileExtension(filename): string {
        return filename.split('.').pop();
    }

    removeFile(index, type): void {
        type === 'IMAGE' ?
            this.chat.images.splice(index, 1) : this.chat.files.splice(index, 1);
    }

    openFileInNewTab(file, type): void {
        if (type === 'IMAGE') {
            const IMAGE = new Image();
            IMAGE.src = file.file;
            const WINDOW = window.open('');
            WINDOW.document.write(IMAGE.outerHTML);
        } else {
            // const contentType = file.contentType;
            // const a = document.createElement('a');
            // const blob = new Blob([file.file], { type: contentType });
            // a.href = window.URL.createObjectURL(blob);
            // a.download = file.fileName;
            // a.click();
            // window.open(file.file);

            // window.open("", "PDF", 'dependent=yes,locationbar=no,
            // scrollbars=no,menubar=no,resizable,screenX=50,screenY=50,width=850,height=800');


            // if (!file.contentType.includes('pdf')) {
            //     window.open(file.file);
            // } else {
            //  if (navigator.userAgent.indexOf('Chrome') !== -1) {
            const arr = file.file.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const a = document.createElement('a');
            a.id = 'testid';
            const blob = new Blob([u8arr], { type: file.contentType });
            a.href = window.URL.createObjectURL(blob);
            a.download = file.fileName;
            a.click();
            a.remove();
            // } else {
            // const iframe = `<iframe width='100%' height='100%'
            // src='${file.file}' Content-disposition: attachment; filename=[file.fileName]></iframe>`;
            //     const x = window.open();
            //     x.document.open();
            //     x.document.write(iframe);
            //     x.document.close();
            // }
            // }
        }
    }

    clickFilebutton(type): void {
        this.fileType = type;
        document.getElementById('imageFile').click();
    }
}
