import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { delay } from "rxjs/operators";
import { CARLIST_PAGE_PATH } from "src/app/core/constants/page-constans";
import { AuthRequestModel } from "src/app/shared/models/auth.model";
import { User } from "src/app/shared/models/user.model";
import { AuthService } from "src/app/shared/services/auth.service";
import { LoginService } from "src/app/shared/services/login.service";

@Component({
    selector:'app-login-form',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})
export class LoginComponent {
    
    constructor(
        private authService: AuthService,
        private loginService: LoginService,
        private router: Router,
    ) {}

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),//add password validation using regular expressions
    });

    onSubmit(){
        let requetModel: AuthRequestModel = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        } 
        this.authService.login(requetModel).subscribe((data: User) => {
            this.loginService.loginUser(data);
            this.router.navigate([CARLIST_PAGE_PATH]);
        });
    }
}