import { Injectable } from "@angular/core";
import { User } from "../models/user/user.model";
import { TokenService } from "src/app/shared/services/token.service";
import { Role } from "../models/role.model";

@Injectable()
export class LoginService {

    constructor
    (
        private tokenService: TokenService,
    )
    {}

    loginUser(user: User) {
        this.tokenService.saveJwt(user.jwt);
        this.tokenService.saveRefreshToken(user.refreshToken);
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('user', JSON.stringify(user));
    }

    logoutUser(): void {
        this.tokenService.destroyJwt();
        this.tokenService.destroyreRreshToken();
        localStorage.removeItem('user');
        localStorage.setItem('isLogin', 'false');
    }

    isLogin(): boolean {
        return localStorage.getItem('isLogin') == 'true';
    }

    getRole(): string {
        let jsonUser = localStorage.getItem('user');
        if(jsonUser !== null) {
            let user = JSON.parse(jsonUser) as User;
            return user.role.title;
        }
        return '';
    }

    getUser(): User{
        let user = localStorage.getItem('user');
        if(user === null) {
            throw new Error("");
        }
        return JSON.parse(user) as User;
    }
}