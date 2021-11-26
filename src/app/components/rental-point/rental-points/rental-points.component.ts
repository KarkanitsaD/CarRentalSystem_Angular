import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ADD_RENTAL_POINT_PATH } from "src/app/core/constants/page-constans";

@Component({
    selector: 'app-rental-points',
    templateUrl: './rental-points.component.html',
    styleUrls: ['./rental-points.component.css']
})
export class RentalPointsComponent {

    constructor
    (
        private router: Router
    ) {}

    public addRentalPoint() {
        this.router.navigate([ADD_RENTAL_POINT_PATH]);
    }
}