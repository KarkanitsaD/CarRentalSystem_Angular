import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthRequestModel } from "src/app/shared/models/auth.model";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
    selector:'app-register-form',
    templateUrl:'./register.component.html',
    styleUrls:['./register.component.css']
})
export class RegisterComponent{
    
    constructor
    (
        private authService: AuthService
    ) {}

    registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,})')])
    });

    onSubmit(){
        let requetModel: AuthRequestModel = {
            email: this.registerForm.value.email,
            password: this.registerForm.value.password
        } 
        this.authService.register(requetModel).subscribe();
    }
}