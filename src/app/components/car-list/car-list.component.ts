import { Component, OnInit } from "@angular/core";
import { ADMIN_ROLE } from "src/app/core/constants/role-constans";
import { Car } from "src/app/shared/models/car.model";
import { CarService } from "src/app/shared/services/car.service";
import { LoginService } from "src/app/shared/services/login.service";

@Component({
    selector: 'app-car-list',
    templateUrl: './car-list.component.html',
    styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
    constructor
    (
        private carService: CarService,
        private loginService: LoginService
    ) {}

    public cars: Car[] = [];
    
    ngOnInit() {
        this.carService.getCars().subscribe(data => {
            this.cars = data;
        });
    }

    isAdmin() {
        return this.loginService.getRoles().includes(ADMIN_ROLE);
    }
}