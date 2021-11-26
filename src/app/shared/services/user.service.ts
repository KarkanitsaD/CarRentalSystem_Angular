import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AddUpdateUserModel } from "../models/user/add-update-user.model";
import { PageUserList } from "../models/user/page-user-list.model";
import { UserData } from "../models/user/user-data.model";
import { User } from "../models/user/user.model";
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

    public getPageUserList(httpParams?: HttpParams): Observable<PageUserList> {
        return this.apiService.get<PageUserList>(`${environment.api_url}users`, httpParams);
    }

    public updateUser(userData: AddUpdateUserModel): Observable<any> {
        return this.apiService.put<any>(`${environment.api_url}users/${userData.id}`, userData);
    }

    public addUser(userData: AddUpdateUserModel): Observable<any> {
        return this.apiService.post<any>(`${environment.api_url}users`, userData);
    }

    public deleteUser(userId: string): Observable<any> {
        return this.apiService.delete<any>(`${environment.api_url}users/${userId}`);
    }
}