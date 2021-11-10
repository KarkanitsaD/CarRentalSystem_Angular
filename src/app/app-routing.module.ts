import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './components/car/car-list/car-list.component';
import { LoginComponent } from 'src/app/components/auth/login/login.component';
import { RegisterComponent } from 'src/app/components/auth/register/register.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { CARLIST_PAGE_PATH, LOGIN_PAGE_PATH, MANAGEMENT_PAGE_PATH, NO_PERMISSION_PATH, PAGE_NOT_FOUND_PATH, REGISTER_PAGE_PATH } from './core/constants/page-constans';
import { ManagementComponent } from './components/manager/management/management.component';
import { OnlyAdminGuard } from './core/guards/only-admin-guard';
import { NoPermissionComponent } from './shared/components/no-permission/no-permission.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: LOGIN_PAGE_PATH, component: LoginComponent},
  { path: REGISTER_PAGE_PATH, component: RegisterComponent},
  { path: CARLIST_PAGE_PATH, component: CarListComponent },
  { path: MANAGEMENT_PAGE_PATH, component: ManagementComponent, canActivate: [OnlyAdminGuard] },
  { path: NO_PERMISSION_PATH, component: NoPermissionComponent },
  { path: PAGE_NOT_FOUND_PATH, component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, RegisterComponent, PageNotFoundComponent, ManagementComponent, CarListComponent]