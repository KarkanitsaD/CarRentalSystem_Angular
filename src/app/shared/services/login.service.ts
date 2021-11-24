import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { TokenService } from "src/app/shared/services/token.service";

@Injectable()
export class LoginService {

    constructor
    (
        private tokenService: TokenService,
    )
    {}

    loginUser(user: User) {
        debugger
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

    getRoles(): string[] {
        let roles = localStorage.getItem('userRoles');
        if(roles == null) {
             return [];
        }
        let rolesArray: string[] = JSON.parse(roles);
            return rolesArray;
    }

    getUser(): User{
        let user = localStorage.getItem('user');
        if(user === null) {
            throw new Error("");
        }
        return JSON.parse(user) as User;
    }
}