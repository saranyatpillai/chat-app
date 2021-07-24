import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
const routes = [
    { path: '', component: LoginComponent }
];
@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    providers: [AuthenticationService]
})
export class LoginModule { }
