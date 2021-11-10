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
        return this.isLogin() && this.loginService.getRoles().includes(ADMIN_ROLE);
    }

    isLogin(): boolean {
        return this.loginService.isLogin();
    }

    logOut(): void {
        this.loginService.logoutUser();
    }
}