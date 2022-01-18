import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { UPDATE_CAR_PAGE_PATH } from "src/app/core/constants/page-constans";
import { BookingFeedbackModel } from "src/app/shared/models/booking-feedback/booking-feedback.model";
import { Car } from "src/app/shared/models/car/car.model";
import { BookingFeedbackService } from "src/app/shared/services/bookingFeedback.service";
import { CarService } from "src/app/shared/services/car.service";
import { LoginService } from "src/app/shared/services/login.service";
import { LoginModalComponent } from "../../auth/login-modal/login-modal.component";
import { BookCarComponent } from "../book-car/book-car.component";

@Component({
    selector: 'app-car-card',
    templateUrl: 'car-card.component.html',
    styleUrls: ['car-card.component.css']
}) export class CarCardComponent implements OnInit {

    private isFeedbackLoaded: boolean = false;

    @Output() onError = new EventEmitter();
    @Input() car!: Car;
    @Input() public keyReceivingTime!: Date;
    @Input() public keyHandOverTime!: Date;
    public isFeedbackSpinner: boolean = true;
    public isCollapsed = true;
    public bookingFeedbacks$: Observable<BookingFeedbackModel[]> = new Observable();
    constructor
    (
        private carService: CarService,
        private bookingFeedbackService: BookingFeedbackService,
        private router: Router,
        private modalService: NgbModal,
        private loginService: LoginService
    ) {}

    ngOnInit(): void {
    
    }

    public deleteCar(carId: string) {
        this.carService.deleteCar(carId).subscribe(() => window.location.reload());
    }

    public updateCar(carId: string) {
        this.router.navigate([UPDATE_CAR_PAGE_PATH, carId]);
    }

    public showRentCarWindow(car: Car): void {
        if(!this.isLogin) {
            this.modalService.open(LoginModalComponent)
            .result.then(() => {
                if(this.isLogin()) {
                    this.carService.lockCar(car.id).subscribe(data => {
                        this.openBookModel(car);
                    },
                    error => {
                        this.onError.emit();
                        //event emmiter to parent this.getPage(this.currentPageNumber);
                    });
                }
            });
        }
        else {
            this.carService.lockCar(car.id).subscribe(data => {
                this.openBookModel(car);
            },
            error => {
                this.onError.emit();
                //event emmiter to parent this.getPage(this.currentPageNumber);
            });
        }
    }

    private openBookModel(car: Car): void {
        const modalRef = this.modalService.open(BookCarComponent);
        modalRef.componentInstance.car = car;
        modalRef.componentInstance.keyHandOverTime = this.keyHandOverTime;
        modalRef.componentInstance.keyReceivingTime = this.keyReceivingTime;
    }

    public loadFeedbacks(): void {
        if(!this.isFeedbackLoaded) {
            this.bookingFeedbacks$ = this.bookingFeedbackService.getBookingFeedbacksByCarId(this.car.id);
            this.isFeedbackLoaded = true;
        }
    }

    public isAdmin(): boolean {
        return this.loginService.getRole() === 'Admin';
    }

    public isLogin(): boolean {
        return this.loginService.isLogin();
    }
}