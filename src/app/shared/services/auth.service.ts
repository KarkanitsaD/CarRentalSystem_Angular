import { Injectable } from "@angular/core";
import { AuthRequestModel } from "../models/auth/auth.model";
import { environment } from "src/environments/environment";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { RegisterModel } from "../models/auth/register.model";

@Injectable()
export class AuthService {
    constructor
    (
        private apiService: ApiService,
    )
    {}

    base_url: string = environment.api_url;

    login(loginModel: AuthRequestModel): Observable<any> {
        let url: string = this.base_url + 'auth/login';
        return this.apiService.post(url, loginModel);
    }
    
    register(registerModel: RegisterModel): Observable<any> {
        let url: string = this.base_url + 'auth/register';
        return this.apiService.post(url, registerModel);
    }

    refreshToken(refreshToken: string): Observable<any> {
         let url: string = this.base_url + 'auth/refresh-token';
         return this.apiService.post(url, refreshToken);
    }
}