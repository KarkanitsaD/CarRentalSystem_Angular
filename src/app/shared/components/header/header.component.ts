import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { map} from "rxjs/operators";
import { LoginModalComponent } from "src/app/components/auth/login-modal/login-modal.component";
import { RegisterModalComponent } from "src/app/components/auth/register-modal/register-modal.component";
import { ADMIN_ROLE, USER_ROLE } from "src/app/core/constants/role-constans";
import { State } from "src/app/store";
import { loggedInUserSelector, resetCurrentUser } from "src/app/store/auth";
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
        private store: Store<State>
    ) {}

    user$ = this.store.select(loggedInUserSelector);
    isLogin$ = this.user$.pipe(map(user => user !== undefined));
    isAdmin$ = this.user$.pipe(map(user => user !== undefined && user.role.title === ADMIN_ROLE));
    isUser$ = this.user$.pipe(map(user => user !== undefined && user.role.title === USER_ROLE));
    userEmail$ = this.user$.pipe(map(user => user?.email));

    logOut(): void {
        this.store.dispatch(resetCurrentUser());
        this.loginService.logoutUser();
    }

    public showLoginModal(): void {
        this.modalService.open(LoginModalComponent);
    }

    public showRegisterModal(): void {
        this.modalService.open(RegisterModalComponent);
    }
}