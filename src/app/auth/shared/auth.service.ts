import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { TokenService } from "src/app/core/services/token.service";
import { LoginResponseModel } from "../login/types/login-response.model";
import { RefreshTokenResponseModel } from "../login/types/refresh-token-response.model";
import { AuthRequestModel } from "./auth.model";
import { HttpHeaders } from "@angular/common/http";

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

@Injectable()
export class AuthService {
    constructor
    (
        private httpClient: HttpClient,
        private tokenService: TokenService
    )
    {}

    login(loginModel: AuthRequestModel): Observable<LoginResponseModel> {
        return this.httpClient.post<LoginResponseModel>(
            '${enviroment.api_url}/auth/refresh-token',
            JSON.stringify(loginModel)).pipe(map(data => {
                let loginResponse: LoginResponseModel = {
                    id: data.id,
                    email: data.email,
                    name: data?.name,
                    jwt: data.jwt,
                    refreshToken: data.refreshToken    
                };
                return loginResponse;
            }),
            catchError(err => {  
                console.log(err); 
                return throwError(err);
            }))
    };

    register(loginModel: AuthRequestModel) {
        debugger
        let path: string = 'https://localhost:44331/api/Auth/register'; 
        let obj: string = JSON.stringify(loginModel);

        return this.httpClient.post(
            path,
            obj,
            httpOptions
        );
    }

    refreshToken() {
        let refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken)
            return;

        this.httpClient.post<RefreshTokenResponseModel>(
            '${enviroment.api_url}/auth/refresh-token',
            JSON.stringify(refreshToken)
        ).pipe(map(
            data => {
                let responseModel: RefreshTokenResponseModel = {
                    jwt: data.jwt,
                    refreshToken: data.refreshToken    
                };
                return responseModel;
            }
        )).subscribe(responseModel => {
            this.tokenService.saveJwt(responseModel.jwt);
            this.tokenService.saveRefreshToken(responseModel.refreshToken);
        });
    }
}