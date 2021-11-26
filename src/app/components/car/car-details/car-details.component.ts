import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Car } from "src/app/shared/models/car/car.model";

@Component({
    selector: 'app-car-details',
    templateUrl: './car-details.component.html',
    styleUrls: ["./car-details.component.css"]
  })
  export class CarDetailsComponent {
    
    @Input() car!: Car;
  
    constructor
    (
        public activeModal: NgbActiveModal
    ) {}
  }