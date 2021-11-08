import { Injectable } from "@angular/core";

@Injectable()
export class TokenService{

    getJwt(): string | null{
        return window.localStorage['jwt'];
    }

    saveJwt(jwt: string) {
        window.localStorage['jwt'] = jwt;
    }

    destroyJwt() {
        window.localStorage.removeItem('jwt');
    }

    getRefreshToken(): string | null {
        return window.localStorage['refreshToken'];
    }

    saveRefreshToken(refreshToken: string) {
        window.localStorage['refreshToken'] = refreshToken;
    }

    destroyreRreshToken() {
        window.localStorage.removeItem('refreshToken');
    }
}