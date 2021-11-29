import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
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
            email: [this.user.email],
            name: [this.user.name],
            surname: [this.user.surname],
            password: this.addingUser ? [''] : null,
        });
        this.selectedRole = this.user.role;
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