import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { LOGIN_PAGE_PATH } from "src/app/core/constants/page-constans";

const headersConfig = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

    constructor
    (
        private router: Router
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError(error => {
                if(error instanceof HttpErrorResponse && error.status === 401) {
                    this.router.navigate([LOGIN_PAGE_PATH]);
                }
                return throwError(error);
            })
        )
    }
}