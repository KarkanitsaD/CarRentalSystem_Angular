import { Component, Input, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UPDATE_CAR_PAGE_PATH } from "src/app/core/constants/page-constans";
import { Car } from "src/app/shared/models/car/car.model";
import { Image } from "src/app/shared/models/image.model";
import { CarImageService } from "src/app/shared/services/car-image.service";
import { CarService } from "src/app/shared/services/car.service";
import { LoginService } from "src/app/shared/services/login.service";
import { BookCarComponent } from "../book-car/book-car.component";
import { CarDetailsComponent } from "../car-details/car-details.component";

@Component({
    selector: 'app-car-list-item',
    templateUrl: './car-list-item.component.html',
    styleUrls: ['./car-list-item.component.css']
})
export class CarListItemComponent implements OnInit{

    @Input() car!: Car;
    @Input() keyReceivingTime!: Date;
    @Input() keyHandOverTime!: Date;
    src: string= '';
    img!: Image;
    constructor
    (
        private modalService: NgbModal,
        private carService: CarService,
        private loginService: LoginService,
        private router: Router,
        private carImageService: CarImageService,
    ) {}

    showDetails(): void{
        const modalRef = this.modalService.open(CarDetailsComponent);
        modalRef.componentInstance.car = this.car;
    }

    deleteCar() {
        this.carService.deleteCar(this.car.id).subscribe(() => window.location.reload());
    }

    updateCar() {
        this.router.navigate([UPDATE_CAR_PAGE_PATH, this.car.id]);
    }

    ngOnInit(): void {
        this.carImageService.getImage(this.car.id).subscribe(image => { this.src = `data:${image.extension};base64,${image.content}`;});
    }

    isAdmin(): boolean {
        return this.loginService.getRole() === 'Admin';
    }

    isLogin(): boolean {
        return this.loginService.isLogin();
    }

    showRentCarWindow(): void {
        const modalRef = this.modalService.open(BookCarComponent);
        modalRef.componentInstance.car = this.car;
        modalRef.componentInstance.keyHandOverTime = this.keyHandOverTime;
        modalRef.componentInstance.keyReceivingTime = this.keyReceivingTime;
    }
}