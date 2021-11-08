import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { map } from "rxjs/operators";
import { AuthRequestModel } from "src/app/shared/models/auth.model";
import { AuthService } from "src/app/shared/services/auth.service";
import { TokenService } from "src/app/shared/services/token.service";
import { environment } from "src/environments/environment";

@Component({
    selector:'app-login-form',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})
export class LoginComponent{
    
    constructor(
        private authService: AuthService,
        private tokenService: TokenService,
        private http: HttpClient,
    ) {}

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),//add password validation using regular expressions
    });

    onSubmit(){
        let requetModel: AuthRequestModel = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        } 
        this.authService.login(requetModel).subscribe((data: any) => {
            this.tokenService.saveJwt(data.token);
            this.tokenService.saveRefreshToken(data.refreshToken);
            console.log(data.token);
        });
    }

    onTest() {
        let base_url = environment.api_url;
        this.http.get(base_url + 'auth/test').pipe(map(x => console.log(x))).subscribe();
    }
}