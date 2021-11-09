import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'src/app/shared/services/token.service';
import { AuthService } from './shared/services/auth.service';
import { ApiService } from './shared/services/api.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpHeadersInterceptor } from './shared/interceptors/http-headers.interceptor';
import { AuthenticationInterceptor } from './shared/interceptors/authentication.interceptor';
import { HeaderComponent } from './shared/components/header/header.component';
import { ErrorHandlerInterceptor } from './shared/interceptors/error.interceptor';
import { LoginService } from './shared/services/login.service';
import { ManagementButtonComponent } from './components/management-button/mangement-button.component';
import { OnlyAdminGuard } from './core/guards/only-admin-guard';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
    ManagementButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    ApiService, 
    TokenService,
    AuthService,
    LoginService,
    OnlyAdminGuard,
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }