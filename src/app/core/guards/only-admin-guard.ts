import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { LoginService } from "src/app/shared/services/login.service";
import { ADMIN_ROLE } from "../constants/role-constans";

@Injectable()
export class OnlyAdminGuard implements CanActivate {

    constructor
    (
        private loginService: LoginService
    ) {}
    
    canActivate(): boolean {
        return this.loginService.getRoles().includes(ADMIN_ROLE);
    }
}