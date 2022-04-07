import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LOGIN_PAGE_PATH, MAIN_PAGE_PATH } from "src/app/core/constants/page-constans";
import { RegisterModel } from "src/app/shared/models/auth/register.model";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
    selector: 'app-register-modal',
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent {

    public show: boolean = false;
    public error: string = '';

    registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,})')]),
        name: new FormControl('', [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')]),
        surname: new FormControl('', [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')])
    });

    constructor
    (
        private authService: AuthService,
        private router: Router,
        public activeModal: NgbActiveModal
    ) {debugger}

    onSubmit(){
        let requetModel: RegisterModel = {
            email: this.registerForm.value.email,
            password: this.registerForm.value.password,
            name: this.registerForm.value.name,
            surname: this.registerForm.value.surname
        }
        this.authService.register(requetModel).subscribe(() => {
            this.activeModal.close();
        },
        (error: any) => {
            this.registerForm.controls['email'].setValue('');
            this.registerForm.controls['password'].setValue('');
            this.registerForm.controls['name'].setValue('');
            this.registerForm.controls['surname'].setValue('');
            this.show = true;
            this.error = error.error;
        });
    }
}
