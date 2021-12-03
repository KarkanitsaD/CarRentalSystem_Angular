import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { LOGIN_PAGE_PATH } from "src/app/core/constants/page-constans";
import { AuthRequestModel } from "src/app/shared/models/auth/auth.model";
import { RegisterModel } from "src/app/shared/models/auth/register.model";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
    selector:'app-register-form',
    templateUrl:'./register.component.html',
    styleUrls:['./register.component.css']
})
export class RegisterComponent{
    
    public error!: string; 
    constructor
    (
        private authService: AuthService,
        private router: Router,
    ) {}

    registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,})')]),
        name: new FormControl('', [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')]),
        surname: new FormControl('', [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')])
    });

    onSubmit(){
        let requetModel: RegisterModel = {
            email: this.registerForm.value.email,
            password: this.registerForm.value.password,
            name: this.registerForm.value.name,
            surname: this.registerForm.value.surname
        } 
        this.authService.register(requetModel).subscribe(() => {
            this.router.navigate([LOGIN_PAGE_PATH]);
        }, 
        error => {
            this.registerForm.controls['email'].setValue('');
            this.registerForm.controls['password'].setValue('');
            this.registerForm.controls['name'].setValue('');
            this.registerForm.controls['surname'].setValue('');
            alert(console.log(error));
        });
    }
}