import { Injectable } from "@angular/core";
import { TokenService } from "./token.service";
import { AuthRequestModel } from "../models/auth.model";
import { environment } from "src/environments/environment";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
    constructor
    (
        private tokenService: TokenService,
        private apiService: ApiService,
        private router: Router
    )
    {}

    base_url: string = environment.api_url;

    login(loginModel: AuthRequestModel) {
        let url: string = this.base_url + 'auth/login';
        this.apiService.post(url, loginModel)
        .subscribe((data: any) => {
            this.tokenService.saveJwt(data.token);
            this.tokenService.saveRefreshToken(data.refreshToken);
            console.log(data.refreshToken);
        });
    }
    
    register(registerModel: AuthRequestModel) {
        let url: string = this.base_url + 'auth/register';
        this.apiService.post(url, registerModel).subscribe();
    }

    refreshToken() {
        let refreshToken = this.tokenService.getRefreshToken();
         if (!refreshToken)
         {
            this.router.navigateByUrl('/login');
         }

         let url: string = this.base_url + 'auth/refresh-token';

         this.apiService.post(url, refreshToken)
         .subscribe((data: any) => {
            this.tokenService.saveJwt(data.token);
            this.tokenService.saveRefreshToken(data.refreshToken);
        });
    }
}