import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { LoginService } from "src/app/shared/services/login.service";
import { MAIN_PAGE_PATH, PAGE_NOT_FOUND_PATH } from "../constants/page-constans";

@Injectable()
export class AuthorizedGuard implements CanActivate {
    constructor
    (
        private loginService: LoginService,
        private router: Router
    ) {}

    canActivate(): boolean {
        var can = this.loginService.isLogin();

        if(can) {
            return true;
        }
        this.router.navigate([PAGE_NOT_FOUND_PATH]);
        return false;
    }
}