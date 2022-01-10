import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { AuthRequestModel } from "src/app/shared/models/auth/auth.model";
import { User } from "src/app/shared/models/user/user.model";
import { AuthService } from "src/app/shared/services/auth.service";
import { LoginService } from "src/app/shared/services/login.service";
import { State } from "src/app/store";
import { setCurrentUser } from "src/app/store/auth";

@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {
    
    error: string = '';

    constructor(
        private authService: AuthService,
        private loginService: LoginService,        
        public activeModal: NgbActiveModal,
        private store: Store<State>
    ) {}


    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,})')]),
    });

    onSubmit(){
        let requetModel: AuthRequestModel = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        }
        this.authService.login(requetModel)
        .subscribe((data: User) => {
            this.loginService.loginUser(data);
            this.store.dispatch(setCurrentUser({user: data}));
            this.activeModal.close();
        },
        error => {
            this.loginForm.controls['email'].setValue('');
            this.loginForm.controls['password'].setValue('');
            this.error = error.error;
        });
    }
}