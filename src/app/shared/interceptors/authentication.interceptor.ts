import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { LOGIN_PAGE_PATH } from "src/app/core/constants/page-constans";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        throw new Error("Method not implemented.");
    }
    
}