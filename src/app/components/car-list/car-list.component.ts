import { Component, OnInit } from "@angular/core";
import { Car } from "src/app/shared/models/car.model";
import { CarService } from "src/app/shared/services/car.service";

@Component({
    selector: 'app-car-list',
    templateUrl: './car-list.component.html',
    styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
    constructor
    (
        private carService: CarService
    ) {}

    public cars: Car[] = [];
    
    ngOnInit() {
        this.carService.getCars().subscribe(data => {
            this.cars = data;
        });
    }
}