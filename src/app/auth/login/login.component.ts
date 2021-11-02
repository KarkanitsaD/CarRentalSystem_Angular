import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../shared/auth.service";

@Component({
    selector:'app-login-form',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})
export class LoginComponent{
    
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),//add password validation using regular expressions
    });

    onSubmit(){
        console.log(this.loginForm.value);
    }
}