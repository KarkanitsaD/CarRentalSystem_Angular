import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthRequestModel } from "../shared/auth.model";
import { AuthService } from "../shared/auth.service";

@Component({
    selector:'app-login-form',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})
export class LoginComponent{
    
    constructor(
        private authService: AuthService
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
      this.authService.login(requetModel);  
    }
}