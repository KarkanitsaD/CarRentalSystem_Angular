import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './components/car/car-list/car-list.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { CARLIST_PAGE_PATH, MAIN_PAGE_PATH, MANAGEMENT_PAGE_PATH, PAGE_NOT_FOUND_PATH, UPDATE_CAR_PAGE_PATH, ADD_RENTAL_POINT_PATH, UPDATE_RENTAL_POINT_PAGE_PATH, RENTAL_POINTS_PAGE, BOOKINGS_PAGE } from './core/constants/page-constans';
import { ManagementComponent } from './components/manager/management/management.component';
import { OnlyAdminGuard } from './core/guards/only-admin-guard';
import { MainPageComponent } from './shared/components/main-page/main-page.component';
import { AddRentalPointComponent } from './components/rental-point/add-rental-point/add-rental-point.component';
import { UpdateRentalPointComponent } from './components/rental-point/update-rental-point/update-rental-point.component';
import { RentalPointsComponent } from './components/rental-point/rental-points/rental-points.component';
import { BookingList } from './components/booking/booking-list/booking-list.component';
import { AuthorizedGuard } from './core/guards/authorized.guard';
import { UpdateCarPageComponent } from './components/car/update-car-page/update-car-page.component';
import { AddCarPageComponent } from './components/car/add-car-page/add-car-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/rider', pathMatch: 'full'},
  { path: BOOKINGS_PAGE, component: BookingList, canActivate: [AuthorizedGuard] },
  { path: ADD_RENTAL_POINT_PATH, component: AddRentalPointComponent, canActivate: [OnlyAdminGuard] },
  { path: RENTAL_POINTS_PAGE + '/:rentalPointId/' + UPDATE_RENTAL_POINT_PAGE_PATH, component: UpdateRentalPointComponent},
  { path: MAIN_PAGE_PATH, component: MainPageComponent},
  { path: CARLIST_PAGE_PATH, component: CarListComponent },
  { path: MANAGEMENT_PAGE_PATH, component: ManagementComponent, canActivate: [OnlyAdminGuard] },
  { path: 'rentalPoints/:rentalPointId/cars/addCar', component: AddCarPageComponent, canActivate: [OnlyAdminGuard]},
  { path: UPDATE_CAR_PAGE_PATH + '/:carId', component: UpdateCarPageComponent, canActivate: [OnlyAdminGuard] },
  { path: RENTAL_POINTS_PAGE, component: RentalPointsComponent},
  { path: RENTAL_POINTS_PAGE + '/:rentalPointId/' + CARLIST_PAGE_PATH, component: CarListComponent },
  { path: PAGE_NOT_FOUND_PATH, component: PageNotFoundComponent},
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  PageNotFoundComponent,
  ManagementComponent,
  CarListComponent,
  MainPageComponent,
  AddRentalPointComponent,
  UpdateRentalPointComponent,
  RentalPointsComponent,
  BookingList,
  UpdateCarPageComponent,
  AddCarPageComponent
]