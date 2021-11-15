import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CAR_PICTURES_URL } from "src/app/core/constants/api-url-constans";
import { ADMIN_ROLE } from "src/app/core/constants/role-constans";
import { Car } from "src/app/shared/models/car.model";
import { CarService } from "src/app/shared/services/car.service";
import { ImageService } from "src/app/shared/services/image.service";
import { LoginService } from "src/app/shared/services/login.service";
import { environment } from "src/environments/environment";
import { CarDetailsComponent } from "../car-details/car-details.component";

@Component({
    selector: 'app-car-list-item',
    templateUrl: './car-list-item.component.html',
    styleUrls: ['./car-list-item.component.css']
})
export class CarListItemComponent implements OnInit{

    @ViewChild('img', { static: true }) image!: ElementRef;
    @Input() car!: Car;
    constructor
    (
        private modalService: NgbModal,
        private imageService: ImageService,
        private carService: CarService,
        private loginService: LoginService
    ) {}

    showDetails(): void{
        const modalRef = this.modalService.open(CarDetailsComponent);
        modalRef.componentInstance.car = this.car;
    }

    deleteCar() {
        debugger
        this.carService.deleteCar(this.car.id).subscribe(() => window.location.reload());
    }

    ngOnInit(): void {
        debugger
        this.imageService.getImageUrl(`${environment.api_url}${CAR_PICTURES_URL}/` + this.car.id).subscribe(image => {
            let url = URL.createObjectURL(image.fileResult);

            this.image.nativeElement.src = url;
        });
    }

    isAdmin(): boolean {
        return this.loginService.getRoles().includes(ADMIN_ROLE);
    }
}