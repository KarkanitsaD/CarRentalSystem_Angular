import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { PAGE_NOT_FOUND_PATH } from "src/app/core/constants/page-constans";
import { Car } from "src/app/shared/models/car/car.model";
import { Image } from "src/app/shared/models/image/image.model";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { CarImageService } from "src/app/shared/services/car-image.service";
import { CarService } from "src/app/shared/services/car.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-update-car-page',
    templateUrl: 'update-car-page.component.html',
    styleUrls: ['update-car-page.component.css']
})
export class UpdateCarPageComponent implements OnInit {

    carToUpdate!: Car;
    imageToUpdate!: Image;
    rentalPoints!: Array<RentalPoint>;

    constructor
    (
        private carService: CarService,
        private rentalPointService: RentalPointService,
        private carImageService: CarImageService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        let carId: string | null;
        this.route.paramMap.subscribe((params: ParamMap) => {
            carId = params.get('carId');
            if(carId) {
                this.loadCarDetails(carId);
                this.loadRentalPoints();
            } else {
                this.router.navigateByUrl(PAGE_NOT_FOUND_PATH);
            }
        });
    }

    private loadCarDetails(carId: string): void {
        this.carService.getCar(carId)
            .subscribe(car => this.carToUpdate = car);

        this.carImageService.getImage(carId)
            .subscribe(image => this.imageToUpdate = image);
    }

    private loadRentalPoints(): void {
        this.rentalPointService.getPageRentalPointsList()
            .subscribe(data => {
                this.rentalPoints = data.rentalPoints
            });
    }
}