import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ADD_RENTAL_POINT_PATH } from "src/app/core/constants/page-constans";

@Component({
    selector: 'app-management',
    templateUrl: './management.component.html',
    styleUrls: ['./management.component.css']
})
export class ManagementComponent {

    constructor
    (
        private router: Router
    ) {}

    public addRentalPoint() {
        this.router.navigate([ADD_RENTAL_POINT_PATH]);
    }
}