import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AddBookigModel } from "src/app/shared/models/booking/add-booking.model";
import { Car } from "src/app/shared/models/car/car.model";
import { BookingService } from "src/app/shared/services/booking.service";
import { CarService } from "src/app/shared/services/car.service";

@Component({
    selector: 'app-book-car',
    templateUrl: './book-car.component.html',
    styleUrls: ['./book-car.component.css']
})
export class BookCarComponent implements OnInit {
    @Input() car!: Car;
    @Input() keyReceivingTime!: Date;
    @Input() keyHandOverTime!: Date;

    constructor
    (
        public activeModal: NgbActiveModal,
        private bookingService: BookingService,
        private router: Router,
        private carService: CarService
    ) {}

    ngOnInit() {
        this.carService.lockCar(this.car.id).subscribe();
    }

    getCost() {
        let days = Math.ceil((this.keyHandOverTime.getTime() - this.keyReceivingTime.getTime())/(1000*60*60*24));
        return days * this.car.pricePerDay;
    }

    rent(): void {
        debugger
        let offset = new Date().getTimezoneOffset();
        this.keyReceivingTime = new Date(this.keyReceivingTime.getTime() - offset*60000);
        this.keyHandOverTime = new Date(this.keyHandOverTime.getTime() - offset*60000);
        let booking: AddBookigModel = {
            carId: this.car.id,
            rentalPointId: this.car.rentalPointId,
            keyHandOverTime: this.keyHandOverTime.toJSON(),
            keyReceivingTime: this.keyReceivingTime.toJSON(),
            price: this.getCost()
        };

        this.bookingService.createBook(booking).subscribe(() => {
            this.router.navigate(['rider']);
        }, () => {
            alert('Error!');
        });
    }
}