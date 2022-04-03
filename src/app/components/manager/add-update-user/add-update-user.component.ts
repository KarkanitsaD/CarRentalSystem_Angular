import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Role } from "src/app/shared/models/role.model";
import { AddUpdateUserModel } from "src/app/shared/models/user/add-update-user.model";
import { UserService } from "src/app/shared/services/user.service";

@Component({
    selector: 'app-add-update-user',
    templateUrl: './add-update-user.component.html',
    styleUrls: ['./add-update-user.component.css']
})
export class AddUpdateUserComponent implements OnInit {
    
    @Input() user!: AddUpdateUserModel;
    @Input() roles!: Role[];
    @Input() updateFunction: any;
    
    public addingUser: boolean = false;
    public userForm!: FormGroup;
    public selectedRole!: Role;

    constructor
    (
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        if(this.user === undefined) {
            this.addingUser = true;
            this.user = {
                email: '',
                name: '',
                surname: '',
                password: '',
                role: {
                    id: '',
                    title: ''
                }
            }
        }
        this.userForm = this.fb.group({
            email: [this.user.email, [Validators.required, Validators.email]],
            name: [this.user.name, [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')]],
            surname: [this.user.surname, [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')]],
        });
        if (this.addingUser) {
            this.userForm.addControl('password', this.fb.control('', [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,})')]));
        }
        this.selectedRole = this.roles[this.roles.length - 1];
    }

    saveUser() {
        let user: AddUpdateUserModel = {
            email: this.userForm.controls['email'].value,
            name: this.userForm.controls['name'].value,
            surname: this.userForm.controls['surname'].value,
            role: this.selectedRole,
            id: this.addingUser ? ' ' : this.user.id,
            password: this.addingUser ? this.userForm.controls['password'].value : '' 
        }
        if(this.addingUser) {
            this.userService.addUser(user).subscribe(() => {
                this.activeModal.close();
            });    
        }
        else {
            this.userService.updateUser(user).subscribe(() => {
                this.activeModal.close();
            });
        }
    }

    changeRole(event: any) {
        let roleTitle = event.target.value;
        let selectedRole = this.roles.filter(role => role.title === roleTitle)[0];
        this.selectedRole = selectedRole;
    }

    isUserInRole(role: Role): boolean {
        return this.user.role.title === role.title;
    }
}