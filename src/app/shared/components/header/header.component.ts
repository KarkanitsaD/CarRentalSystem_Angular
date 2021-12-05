import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginModalComponent } from "src/app/components/auth/login-modal/login-modal.component";
import { RegisterModalComponent } from "src/app/components/auth/register-modal/register-modal.component";
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
        private loginService: LoginService,
        private modalService: NgbModal,
    ) {}


    showManagementButton(): boolean {
        return this.isLogin() && this.loginService.getRole() === "Admin";
    }

    isLogin(): boolean {
        return this.loginService.isLogin();
    }

    logOut(): void {
        this.loginService.logoutUser();
    }

    public isAdmin(): boolean {
        return this.loginService.getRole() === ADMIN_ROLE;
    }

    public showLoginModal(): void {
        const modalRef = this.modalService.open(LoginModalComponent);
    }

    public showRegisterModal(): void {
        const modalRef = this.modalService.open(RegisterModalComponent);
    }
}