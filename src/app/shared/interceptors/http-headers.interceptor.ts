import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const headersConfig = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone({ setHeaders: headersConfig });
        return next.handle(request);
    }
}