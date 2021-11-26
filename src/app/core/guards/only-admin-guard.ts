import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { LoginService } from "src/app/shared/services/login.service";
import { MAIN_PAGE_PATH } from "../constants/page-constans";
import { ADMIN_ROLE } from "../constants/role-constans";

@Injectable()
export class OnlyAdminGuard implements CanActivate {

    constructor
    (
        private loginService: LoginService,
        private router: Router
    ) {}
    
    canActivate(): boolean {
        var can =  this.loginService.getRole() === "Admin";
        if(can) {
            return true;
        }
        this.router.navigate([MAIN_PAGE_PATH]);
        return false;
    }
}