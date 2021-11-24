import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserData } from "../models/user-data.model";
import { User } from "../models/user.model";
import { ApiService } from "./api.service";

@Injectable()
export class UserService {

    constructor
    (
        private apiService: ApiService
    ) {}

    public getAllUsers(): Observable<User[]>  {
        return this.apiService.get<User[]>(`${environment.api_url}users`);
    }

    public updateUser(userData: UserData): Observable<any> {
        return this.apiService.put<any>(`${environment.api_url}users/${userData.id}`, userData);
    }
}