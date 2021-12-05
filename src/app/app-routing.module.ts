import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './components/car/car-list/car-list.component';
import { LoginComponent } from 'src/app/components/auth/login/login.component';
import { RegisterComponent } from 'src/app/components/auth/register/register.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { CARLIST_PAGE_PATH, PROFILE_PAGE, LOGIN_PAGE_PATH, MAIN_PAGE_PATH, MANAGEMENT_PAGE_PATH, NO_PERMISSION_PATH, PAGE_NOT_FOUND_PATH, REGISTER_PAGE_PATH, ADD_CAR_PAGE_PATH, UPDATE_CAR_PAGE_PATH, ADD_RENTAL_POINT_PATH, UPDATE_RENTAL_POINT_PAGE_PATH, RENTAL_POINTS_PAGE, BOOKINGS_PAGE } from './core/constants/page-constans';
import { ManagementComponent } from './components/manager/management/management.component';
import { OnlyAdminGuard } from './core/guards/only-admin-guard';
import { NoPermissionComponent } from './shared/components/no-permission/no-permission.component';
import { MainPageComponent } from './shared/components/main-page/main-page.component';
import { AddCarComponent } from './components/car/add-car/add-car.component';
import { UpdateCarComponent } from './components/car/update-car/update-car.component';
import { AddRentalPointComponent } from './components/rental-point/add-rental-point/add-rental-point.component';
import { UpdateRentalPointComponent } from './components/rental-point/update-rental-point/update-rental-point.component';
import { RentalPointsComponent } from './components/rental-point/rental-points/rental-points.component';
import { BookingList } from './components/booking/booking-list/booking-list.component';
import { AuthorizedGuard } from './core/guards/authorized.guard';


const routes: Routes = [
  { path: '', redirectTo: '/rider', pathMatch: 'full'},
  { path: BOOKINGS_PAGE, component: BookingList, canActivate: [AuthorizedGuard] },
  { path: ADD_RENTAL_POINT_PATH, component: AddRentalPointComponent, canActivate: [OnlyAdminGuard] },
  { path: RENTAL_POINTS_PAGE + '/:rentalPointId/' + UPDATE_RENTAL_POINT_PAGE_PATH, component: UpdateRentalPointComponent},
  { path: MAIN_PAGE_PATH, component: MainPageComponent},
  { path: LOGIN_PAGE_PATH, component: LoginComponent},
  { path: REGISTER_PAGE_PATH, component: RegisterComponent},
  { path: CARLIST_PAGE_PATH, component: CarListComponent },
  { path: MANAGEMENT_PAGE_PATH, component: ManagementComponent, canActivate: [OnlyAdminGuard] },
  { path: 'rentalPoints/:rentalPointId/cars/addCar', component: AddCarComponent, canActivate: [OnlyAdminGuard]},
  { path: ADD_CAR_PAGE_PATH, component: AddCarComponent, canActivate: [OnlyAdminGuard] },
  { path: UPDATE_CAR_PAGE_PATH + '/:carId', component: UpdateCarComponent, canActivate: [OnlyAdminGuard] },
  { path: NO_PERMISSION_PATH, component: NoPermissionComponent },
  { path: RENTAL_POINTS_PAGE, component: RentalPointsComponent},
  { path: RENTAL_POINTS_PAGE + '/:rentalPointId/' + CARLIST_PAGE_PATH, component: CarListComponent },
  { path: PAGE_NOT_FOUND_PATH, component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LoginComponent,
  RegisterComponent,
  PageNotFoundComponent,
  ManagementComponent,
  CarListComponent,
  MainPageComponent,
  AddCarComponent,
  UpdateCarComponent,
  AddRentalPointComponent,
  UpdateRentalPointComponent,
  RentalPointsComponent,
  BookingList
]