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
    }

    logoutUser() {
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRoles');
    }
}