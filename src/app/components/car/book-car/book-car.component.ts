import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MAIN_PAGE_PATH } from "src/app/core/constants/page-constans";
import { CheckBoxItem } from "src/app/shared/components/custom-inputs/check-box-group/check-box-group.component";
import { AdditionalFacility } from "src/app/shared/models/additional-facility/additional-facility.model";
import { AddBookigModel } from "src/app/shared/models/booking/add-booking.model";
import { Car } from "src/app/shared/models/car/car.model";
import { AdditionalFacilityService } from "src/app/shared/services/additional-facility.service";
import { BookingService } from "src/app/shared/services/booking.service";
import { CostCalculator } from "src/app/shared/services/cost-calculator.service";
import { LoginService } from "src/app/shared/services/login.service";

@Component({
    selector: 'app-book-car',
    templateUrl: './book-car.component.html',
    styleUrls: ['./book-car.component.css']
})
export class BookCarComponent implements OnInit {
    @Input() car!: Car;
    @Input() keyReceivingTime!: Date;
    @Input() keyHandOverTime!: Date;

    public additionalFacilitiesOptions!: Array<CheckBoxItem>;
    private additionalFacilitiesIds: string[] | null = null;

    public bookForm!: FormGroup;
    public success: boolean = false;
    public error: string = '';

    totalPrice: number = 0;

    get price(): number {
        return this.totalPrice;
    }

    constructor
    (
        public activeModal: NgbActiveModal,
        private bookingService: BookingService,
        private router: Router,
        private fb: FormBuilder,
        private loginService: LoginService,
        private costCalculator: CostCalculator,
        private additionalFacilitiesService: AdditionalFacilityService
    ) {}

    ngOnInit() {
        this.totalPrice = this.getCost(this.car.pricePerDay);

        let user = this.loginService.getUser();
        this.bookForm = this.fb.group({
            name: [user.name, [Validators.required]],
            surname: [user.surname, [Validators.required]],
            email: [user.email, [Validators.required, Validators.email]],
            phoneNumber: [, [Validators.required, Validators.pattern('^(\\+)[1-9][0-9]{11,12}$')]]
        });

        this.additionalFacilitiesService.getAdditionalFacilityByRentalPointId(this.car.rentalPointId)
        .subscribe(data => {
            this.additionalFacilitiesOptions = data.map(f => new CheckBoxItem(f, f.title + ' - ' + f.price + ' br'));
        });
    }

    rent(): void {
        let offset = new Date().getTimezoneOffset();
        this.keyReceivingTime = new Date(this.keyReceivingTime.getTime() - offset*60000);
        this.keyHandOverTime = new Date(this.keyHandOverTime.getTime() - offset*60000);
        let bookingTime = new Date(new Date().getTime() - offset*60000);
        let booking: AddBookigModel = {
            carId: this.car.id,
            rentalPointId: this.car.rentalPointId,
            keyHandOverTime: this.keyHandOverTime.toJSON(),
            keyReceivingTime: this.keyReceivingTime.toJSON(),
            price: this.getCost(this.car.pricePerDay),
            bookingTime: bookingTime.toJSON(),
            customerEmail: this.bookForm.controls['email'].value,
            customerName: this.bookForm.controls['name'].value,
            customerSurname: this.bookForm.controls['surname'].value,
            phoneNumber: this.bookForm.controls['phoneNumber'].value,
            additionalFacilitiesIds: this.additionalFacilitiesIds
        };

        this.bookingService.createBook(booking).subscribe(() => {
            this.success = true;
            this.router.navigate(['bookings']);
        }, (error:any) => {
            this.error = error.error;
            this.router.navigate([MAIN_PAGE_PATH]);
        });
    }

    public countDays(): number {
        return this.costCalculator.countDays(this.keyHandOverTime, this.keyReceivingTime);
    }

    public getCost(pricePerDay: number): number {
        return this.costCalculator.getCost(this.keyHandOverTime, this.keyReceivingTime, pricePerDay);
    }

    public onFacilitiesToggled(facilities: AdditionalFacility[]): void {
        this.totalPrice = this.getCost(this.car.pricePerDay);
        facilities.forEach(f => {
            this.totalPrice += f.price;
        });
        this.additionalFacilitiesIds = facilities.map(f => f.id);
    }
}