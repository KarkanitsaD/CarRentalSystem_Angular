import { Component } from "@angular/core";
import { ADMIN_ROLE } from "src/app/core/constants/role-constans";
import { LoginService } from "../../services/login.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    constructor
    (
        private loginService: LoginService
    ) {}


    showManagementButton(): boolean {
        let roles = localStorage.getItem('userRoles'); 
        if(roles == null) {
            return false;
        }
        let rolesArray: string[] = JSON.parse(roles);
        return this.isLogin() && rolesArray.includes(ADMIN_ROLE);
    }

    showAuthButtons(): boolean {
        if(localStorage.getItem('isLogin') == 'false') {
            return true;
        }
        return false;
    }

    isLogin(): boolean {
        return localStorage.getItem('isLogin') == 'true';
    }

    logOut(): void {
        this.loginService.logoutUser();
    }
}