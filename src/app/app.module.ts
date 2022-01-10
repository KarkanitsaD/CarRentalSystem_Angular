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
import { LoginService } from './shared/services/login.service';
import { OnlyAdminGuard } from './core/guards/only-admin-guard';
import { CarService } from './shared/services/car.service';
import { AuthorizedGuard } from './core/guards/authorized.guard';
import { CityService } from './shared/services/city.service';
import { CountryService } from './shared/services/country.service';
import { RentalPointService } from './shared/services/rental-point.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarImageService } from './shared/services/car-image.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserService } from './shared/services/user.service';
import { RoleService } from './shared/services/role.service';
import { AddUpdateUserComponent } from './components/manager/add-update-user/add-update-user.component';
import { RentalPointFiltrationComponent } from './shared/components/filtration/rental-point-filtration/rental-point-filtration.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BookCarComponent } from './components/car/book-car/book-car.component';
import { BookingService } from './shared/services/booking.service';
import { CarImageComponent } from './components/car/car-image/car-image.component';
import { CarFiltrationComponent } from './shared/components/filtration/booking-filtration/booking-filtration.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { GoogleMapService } from './shared/services/google-map.service';
import { CostCalculator } from './shared/services/cost-calculator.service';
import { LoginModalComponent } from './components/auth/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/auth/register-modal/register-modal.component';
import { MapService } from './shared/services/map.service';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { NumbersOnlyInputComponent } from './shared/components/custom-inputs/numbers-only-input/numbers-only-input.component';
import { DateTimeRangePickerValidationHelper } from './shared/helpers/date-time-range-picker-validation.helper';
import { LocationsEffects } from './store/locations';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
    AddUpdateUserComponent,
    RentalPointFiltrationComponent,
    BookCarComponent,
    CarImageComponent,
    LoginModalComponent,
    CarFiltrationComponent,
    RegisterModalComponent,
    NumbersOnlyInputComponent
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
    OwlNativeDateTimeModule,
    AutocompleteLibModule,
    EffectsModule.forFeature([LocationsEffects]),
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([AppEffects])
  ],
  providers: [
    DateTimeRangePickerValidationHelper,
    CostCalculator,
    ApiService, 
    GoogleMapService,
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
    MapService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }