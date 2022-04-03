import { Component, Input, OnInit } from "@angular/core";
import { CarImageService } from "src/app/shared/services/car-image.service";

@Component({
    selector: 'app-car-image',
    templateUrl: './car-image.component.html',
    styleUrls: ['./car-image.component.css']
})
export class CarImageComponent implements OnInit {
    
    @Input() carId!: string;
    src: string = '';
    constructor
    (
        private carImageService: CarImageService
    ) {}

    ngOnInit(): void {
        this.carImageService.getImage(this.carId).subscribe(image => { this.src = `data:${image.extension};base64,${image.content}`;});
    }
}