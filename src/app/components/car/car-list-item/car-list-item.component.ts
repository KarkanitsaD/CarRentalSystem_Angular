import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CAR_PICTURES_URL } from "src/app/core/constants/api-url-constans";
import { UPDATE_CAR_PAGE_PATH } from "src/app/core/constants/page-constans";
import { ADMIN_ROLE } from "src/app/core/constants/role-constans";
import { Car } from "src/app/shared/models/car.model";
import { Image } from "src/app/shared/models/image.model";
import { CarImageService } from "src/app/shared/services/car-image.service";
import { CarService } from "src/app/shared/services/car.service";
import { LoginService } from "src/app/shared/services/login.service";
import { environment } from "src/environments/environment";
import { CarDetailsComponent } from "../car-details/car-details.component";

@Component({
    selector: 'app-car-list-item',
    templateUrl: './car-list-item.component.html',
    styleUrls: ['./car-list-item.component.css']
})
export class CarListItemComponent implements OnInit{

    @Input() car!: Car;
    src: string= '';
    img!: Image;
    constructor
    (
        private modalService: NgbModal,
        private carService: CarService,
        private loginService: LoginService,
        private router: Router,
        private carImageService: CarImageService
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
        return this.loginService.getRoles().includes(ADMIN_ROLE);
    }
}