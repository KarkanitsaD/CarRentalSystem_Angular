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
        this.tokenService.saveJwt(user.jwt);
        this.tokenService.saveRefreshToken(user.refreshToken);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userRoles', JSON.stringify(user.roles));
        localStorage.setItem('isLogin', 'true');
    }

    logoutUser(): void {
        this.tokenService.destroyJwt();
        this.tokenService.destroyreRreshToken();
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRoles');
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
}