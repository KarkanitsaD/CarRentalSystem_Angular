import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthRequestModel } from "../shared/auth.model";
import { AuthService } from "../shared/auth.service";

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
        password: new FormControl('', [Validators.required])
    });

    onSubmit(){
        let requetModel: AuthRequestModel = {
            email: this.registerForm.value.email,
            password: this.registerForm.value.password
        } 
        debugger
        this.authService.register(requetModel).subscribe();
    }
}