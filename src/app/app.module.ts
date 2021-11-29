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
import { OnlyAdminGuard } from './core/guards/only-admin-guard';
import { CarService } from './shared/services/car.service';
import { CarListItemComponent } from './components/car/car-list-item/car-list-item.component';
import { AuthorizedGuard } from './core/guards/authorized.guard';
import { CityService } from './shared/services/city.service';
import { CountryService } from './shared/services/country.service';
import { RentalPointService } from './shared/services/rental-point.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarImageService } from './shared/services/car-image.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { RentalPointListComponent } from './components/rental-point/rental-point-list/rental-point-list.component';
import { UserService } from './shared/services/user.service';
import { RoleService } from './shared/services/role.service';
import { AddUpdateUserComponent } from './components/manager/add-update-user/add-update-user.component';
import { RentalPointFiltrationComponent } from './shared/components/filtration/rental-point-filtration/rental-point-filtration.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BookCarComponent } from './components/car/book-car/book-car.component';
import { BookingService } from './shared/services/booking.service';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
    CarListItemComponent,
    RentalPointListComponent,
    AddUpdateUserComponent,
    RentalPointFiltrationComponent,
    BookCarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [
    ApiService, 
    TokenService,
    CityService,
    CountryService,
    AuthService,
    LoginService,
    OnlyAdminGuard,
    AuthorizedGuard,
    CarService,
    RentalPointService,
    CarImageService,
    UserService,
    RoleService,
    BookingService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }