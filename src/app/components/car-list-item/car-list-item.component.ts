import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Car } from "src/app/shared/models/car.model";
import { CarDetailsComponent } from "./car-details/car-details.component";

@Component({
    selector: 'app-car-list-item',
    templateUrl: './car-list-item.component.html',
    styleUrls: ['./car-list-item.component.css']
})
export class CarListItemComponent {

    @Input() car!: Car;

    constructor
    (
        private modalService: NgbModal
    ) {}

    showDetails(): void{
        const modalRef = this.modalService.open(CarDetailsComponent);
        modalRef.componentInstance.car = this.car;
    }
}