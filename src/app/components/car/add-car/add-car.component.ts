import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CARLIST_PAGE_PATH } from "src/app/core/constants/page-constans";
import { IMAGE_NOT_FOUND_URL } from "src/app/core/constants/shared";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { CarService } from "src/app/shared/services/car.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";
import { AddCarModel } from "./types/add-car.model";

@Component({
    selector: 'app-add-car',
    templateUrl: './add-car.component.html',
    styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit{

    private pictureBase64Content: string = '';
    private pictureExtension: string = '';

    public rentalPoints: RentalPoint[] = new Array<RentalPoint>();
    public imageUrl: string = IMAGE_NOT_FOUND_URL;

    constructor
    (
        private carService: CarService,
        private rentalPointService: RentalPointService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.rentalPointService.getPageRentalPointsList().subscribe(data => {this.rentalPoints = data.rentalPoints;});
    }

    addCarForm = this.fb.group({
        brand: ['', [Validators.required]],
        model: ['', [Validators.required]],
        pricePerDay: ['', [Validators.required, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')]],   
        fuelConsumptionPerHundredKilometers: ['', [Validators.required, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')]],
        numberOfSeats: ['', [Validators.required, Validators.pattern('\[0-9]{1,2}')]],
        transmissionType: [''],
        color: [''],
        rentalPointId:['', [Validators.required]],
        image: ['', [Validators.required]],
        pictureShortName: ['', [Validators.required]],
            description: ['', [Validators.minLength(50)]]
    });

    addCar(): void {

        let addCarModel: AddCarModel = {
            brand: this.addCarForm.value.brand,
            model: this.addCarForm.value.model,
            pricePerDay: Number(this.addCarForm.value.pricePerDay),
            fuelConsumptionPerHundredKilometers: Number(this.addCarForm.value.fuelConsumptionPerHundredKilometers),
            numberOfSeats: Number(this.addCarForm.value.numberOfSeats),
            transmissionType: this.addCarForm.value.transmissionType,
            color: this.addCarForm.value.color,
            pictureExtension: this.pictureExtension,
            rentalPointId: this.addCarForm.value.rentalPointId,
            pictureShortName: this.addCarForm.value.pictureShortName,
            pictureBase64Content: this.pictureBase64Content,
            description: this.addCarForm.value.description
        };
        this.carService.createCar(addCarModel).subscribe(() => this.router.navigate([CARLIST_PAGE_PATH]));        
    }

    onImageSelected(event: any) {
        if(event.target.files && event.target.files.length > 0) {
            let imageFile: File = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = () => {
                let url = reader.result as string;

                let firstExtensionIndex = url.indexOf(':');
                let secondExtensionIndex = url.indexOf(';');

                let extension = url.substring(firstExtensionIndex + 1, secondExtensionIndex);

                let base64Index = url.indexOf(';base64,') + ';base64,'.length;
                let pictureBase64Content = url.substring(base64Index);

                this.imageUrl = url;
                this.pictureExtension = extension;
                this.pictureBase64Content = pictureBase64Content;
                this.addCarForm.controls['pictureShortName'].setValue(imageFile.name);
            }
        }
        else{
            this.imageUrl = IMAGE_NOT_FOUND_URL;
            this.addCarForm.controls['pictureShortName'].setValue('');
        }
    }

    getRentalPointDisplayTitle(rentalPoint: RentalPoint): string {
        let title = '';
        title +=  rentalPoint.title != null ? rentalPoint.title : '';
        title +=  rentalPoint.address != null ? '. Adress: ' + rentalPoint.address : '';
        return title;  
    }
}