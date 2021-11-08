import { Component } from "@angular/core";
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
        if(localStorage.getItem('isLogin') === 'true') {
            return true;
        }
        return false;
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