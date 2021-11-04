import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map} from 'rxjs/operators';
import { TokenService } from "./token.service";
import { AuthRequestModel } from "../models/auth.model";
import axios from "axios";
import { environment } from "src/environments/environment";


@Injectable()
export class AuthService {
    constructor
    (
        private httpClient: HttpClient,
        private tokenService: TokenService
    )
    {}

    base_url: string = environment.api_url;

    login(loginModel: AuthRequestModel) {

        let url: string = this.base_url + 'auth/login';
        axios({
            method: 'post',
            url: url,
            data: {
                email: loginModel.email,
                password: loginModel.password
            },
            headers: {'Content-Type':  'application/json'}

        }).then(res =>{
            this.tokenService.saveJwt(res.data.token);
            this.tokenService.saveRefreshToken(res.data.refreshToken);
        });
    }

    register(loginModel: AuthRequestModel) {
        let url: string = this.base_url + 'auth/register';
        axios({
            method: 'post',
            url: url,
            data: {
                email: loginModel.email,
                password: loginModel.password
            },
            headers: {'Content-Type':  'application/json'}
        });
    }

    refreshToken() {
        let refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken)
            return;

        let url: string = this.base_url + 'auth/refresh-token'

        axios({
            method: 'post',
            url: url,
            data: {
                refreshToken
            },
            headers: {'Content-Type':  'application/json'}
        }).then(res =>{
            this.tokenService.saveJwt(res.data.token);
            this.tokenService.saveRefreshToken(res.data.refreshToken);
        });
    }
}