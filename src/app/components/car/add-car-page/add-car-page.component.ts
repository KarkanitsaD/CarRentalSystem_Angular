import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-add-car-page',
    templateUrl: 'add-car-page.component.html',
    styleUrls: ['add-car-page.component.css']
})
export class AddCarPageComponent implements OnInit {

    rentalPoints!: RentalPoint[];
    rentalPointId!: string | null;

    constructor 
    (
        private rentalPointService: RentalPointService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.rentalPointService.getPageRentalPointsList()
            .subscribe(data => this.rentalPoints = data.rentalPoints);

        this.route.paramMap
            .subscribe((params: ParamMap) => {
                this.rentalPointId = params.get('rentalPointId');
            })
    }
}