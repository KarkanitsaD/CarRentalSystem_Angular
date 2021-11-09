import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './components/car-list/car-list.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { CARLIST_PAGE_PATH, LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from './core/constants/page-constans';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: LOGIN_PAGE_PATH, component: LoginComponent},
  { path: REGISTER_PAGE_PATH, component: RegisterComponent},
  { path: CARLIST_PAGE_PATH, component: CarListComponent },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, RegisterComponent, PageNotFoundComponent]