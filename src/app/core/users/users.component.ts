import { templateSourceUrl } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

@Component({
    selector:'app-users',
    templateUrl:'./users.component.html'
})
export class UsersComponent implements OnInit{
    public users: User[] = [];

    constructor (private _userService: UserService) { }

    ngOnInit(): void {
        this._userService.getUsers()
        .subscribe(data => this.users = data);
    }
}