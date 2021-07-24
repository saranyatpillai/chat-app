import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { WebSocketService } from '../chat/services/websocket.service';
import { ChatService } from '../chat/services/chat.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

    submitted = false;
    isError = false;
    loginForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl(''),
    });
    subscription = new Subscription();

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private webSocketService: WebSocketService,
                private authenticationService: AuthenticationService,
                private chatService: ChatService) { }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        // this.webSocketService.listen('newUser').subscribe((data) => this.updateActiveUsers(data));
        // this.webSocketService.listen('disconnect').subscribe((data) => this.updateActiveUsers(data));
    }

    updateActiveUsers(data): void {
        this.chatService.activeUsers = data.data;
        this.chatService.setActiveUsers(data.data);
    }

    get formField(): any {
        return this.loginForm.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        this.isError = false;
        if (this.loginForm.invalid) {
            return;
        } else {
            const VALID_USER = this.authenticationService.login(this.formField.username.value, this.formField.password.value);
            if (VALID_USER) {
                this.router.navigate(['chat-app']);
                localStorage.setItem('currentUser', this.formField.username.value);
                this.chatService.setCurrentUserAccount(this.formField.username.value);
            } else {
                this.isError = true;
            }
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
