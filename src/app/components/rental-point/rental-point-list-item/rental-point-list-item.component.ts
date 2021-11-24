import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { RentalPoint } from "src/app/shared/models/rental-point.model";

@Component({
    selector: 'app-rental-point-list-item',
    templateUrl:'./rental-point-list-item.component.html',
    styleUrls: ['./rental-point-list-item.component.css']
})
export class RentalPointListItem {
    @Input() rentalPoint!: RentalPoint;

    constructor
    (
        private router: Router,
    ) {}
}