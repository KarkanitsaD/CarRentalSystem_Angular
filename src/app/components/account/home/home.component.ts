import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserData } from "src/app/shared/models/user-data.model";
import { User } from "src/app/shared/models/user.model";
import { LoginService } from "src/app/shared/services/login.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

    public informationForm!: FormGroup;
    public user: User = this.loginService.getUser();
    public newPasswordForm: FormGroup = this.fb.group({
        password: ['', Validators.required]
    });

    constructor
    (
        private fb: FormBuilder,
        private loginService: LoginService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.user = this.loginService.getUser();
        this.informationForm = this.fb.group({
            email: [this.user?.email],
            name: [this.user?.name],
            surname: [this.user?.surname]
        });
    }

    updatePassword(): void {

    }

    updateInfo(): void {
        let userData: UserData = {
            id: this.user.id,
            email: this.user.email,
            name: this.informationForm.controls['name'].value,
            surname: this.informationForm.controls['surname'].value
        }
        this.userService.updateUser(userData).subscribe(() => alert("Data updated!"));
    }

}