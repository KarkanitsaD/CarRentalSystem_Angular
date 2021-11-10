import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { filter, take, catchError, switchMap} from "rxjs/operators";
import { LoginService } from "../services/login.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor
    (
        private tokenService: TokenService,
        private authService: AuthService,
        private loginService: LoginService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authRequest = req;
        let jwt = this.tokenService.getJwt();
        if(jwt) {
            authRequest = this.addAuthorizationHeader(req, jwt);
        }

        return next.handle(authRequest).pipe(
            catchError(error => {
                if(error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(authRequest, next);
                }

                return throwError(error);
            }),
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if(!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            let refreshToken = this.tokenService.getRefreshToken();

            if(refreshToken) {
                return this.authService.refreshToken(refreshToken).pipe(
                    switchMap((responce: any) => {
                        let jwt = responce.token;
                        let refreshToken = responce.refreshToken;

                        this.tokenService.saveJwt(jwt);
                        this.tokenService.saveRefreshToken(refreshToken);

                        this.refreshTokenSubject.next(jwt);

                        this.isRefreshing = false;
                        return next.handle(this.addAuthorizationHeader(request, jwt));
                    }),
                    catchError((error) => {
                        this.isRefreshing = false;
                        this.loginService.logoutUser();

                        return throwError(error);
                    })
                );
            }
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => next.handle(this.addAuthorizationHeader(request, token))),
        );
    }

    private addAuthorizationHeader(req: HttpRequest<any>, jwt: string): HttpRequest<any> {
        return req.clone({ headers: req.headers.set('Authorization', `Bearer ${jwt}`) });
    }
}