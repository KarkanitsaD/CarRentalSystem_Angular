import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CARLIST_PAGE_PATH, RENTAL_POINTS_PAGE } from "src/app/core/constants/page-constans";
import { IMAGE_NOT_FOUND_URL } from "src/app/core/constants/shared";
import { AddCarModel } from "src/app/shared/models/car/add-car.model";
import { Car } from "src/app/shared/models/car/car.model";
import { UpdateCarModel } from "src/app/shared/models/car/update-car.model";
import { Image } from "src/app/shared/models/image/image.model";
import { CarTestService } from "src/app/shared/services/car-test.service";

@Component({
    selector: 'app-car-form',
    templateUrl: 'car-form.component.html',
    styleUrls: ['car-form.component.css']
})
export class CarFormComponent implements OnInit {

    @Input() car: Car | null = null;
    @Input() image: Image | null = null;
    @Input() addCarMode: boolean = true;
    carForm!: FormGroup;

    baseImageUrl: string = '';
    imageUrl: string = '';
    imageExtension: string = '';
    imageContent: string = '';

    constructor
    (
        private fb: FormBuilder,
        private carService: CarTestService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // this.initializeImageInformation();
        this.initializeForm();
    }

    private initializeImageInformation(): void {
        if(!this.addCarMode && this.image) {
            this.baseImageUrl = `data:${this.image.extension};base64,${this.image.content}`;
            this.imageUrl = this.baseImageUrl;
            this.imageExtension = this.image.extension;
        } else {
            this.baseImageUrl = IMAGE_NOT_FOUND_URL;
            this.imageUrl = this.baseImageUrl;
        }
    }

    private initializeForm(): void {
        this.carForm = this.fb.group({
            brand: [this.addCarMode ? null : this.car?.brand, [Validators.required]],
            model: [this.addCarMode ? null : this.car?.model, [Validators.required]],
            pricePerDay: [this.addCarMode ? null : this.car?.pricePerDay, [Validators.required]],
            fuelConsumption: [this.addCarMode ? null : this.car?.fuelConsumption, [Validators.required]],
            numberOfSeats: [this.addCarMode ? null : this.car?.numberOfSeats, [Validators.required]],
            transmissionType: [this.addCarMode ? null : this.car?.transmissionType, [Validators.required]],
            color: [this.addCarMode ? null : this.car?.color, [Validators.required]],
            rentalPointId: [this.addCarMode ? null : this.car?.rentalPointId, [Validators.required]],
            description: [this.addCarMode ? null : this.car?.description, [Validators.required]],
            imageShortName: [this.addCarMode ? null : this.image?.shortName, [Validators.required]]
        })
    }

    public onImageSelected(event: Event): void {
        let input = event.target as HTMLInputElement;
        if(input.files && input.files.length > 0) {
            let selectedImageFile = input.files[0];
            let fileReader = new FileReader();
            fileReader.readAsDataURL(selectedImageFile);
            fileReader.onload = () => {
                let imageUrl = fileReader.result as string;

                let firstExtensionIndex = imageUrl.indexOf(':');
                let secondExtensionIndex = imageUrl.indexOf(';');
                let base64Index = imageUrl.indexOf(';base64,') + ';base64,'.length;

                this.imageUrl = imageUrl;
                this.imageExtension = imageUrl.substring(firstExtensionIndex + 1, secondExtensionIndex);
                this.imageContent = imageUrl.substring(base64Index);
                this.carForm.controls['imageShortName'].setValue(selectedImageFile.name);
            }
        } else {
            this.carForm.controls['imageShortName'].setValue('');
        }
    }

    public addCar(): void {
        debugger
        let addCarModel: AddCarModel = {
            brand: this.carForm.controls['brand'].value,
            model: this.carForm.controls['model'].value,
            pricePerDay: this.carForm.controls['pricePerDay'].value,
            fuelConsumption: this.carForm.controls['fuelConsumption'].value,
            numberOfSeats: this.carForm.controls['numberOfSeats'].value,
            transmissionType: this.carForm.controls['transmissionType'].value,
            color: this.carForm.controls['color'].value,
            rentalPointId: this.carForm.controls['rentalPointId'].value,
            description: this.carForm.controls['description'].value,
            pictureShortName: this.carForm.controls['pictureShortName'].value,
            pictureBase64Content: this.imageContent,
            pictureExtension: this.imageExtension
        }

        this.carService.createCar(addCarModel).subscribe(() => this.router.navigate([RENTAL_POINTS_PAGE + `/${this.carForm.value.rentalPointId}/` + CARLIST_PAGE_PATH]));
    }

    public updateCar(): void {

        if(this.car && this.image) {
            let updateCarModel: UpdateCarModel = {
                id: this.car.id,
                brand: this.carForm.controls['brand'].value,
                model: this.carForm.controls['model'].value,
                pricePerDay: this.carForm.controls['pricePerDay'].value,
                fuelConsumption: this.carForm.controls['fuelConsumption'].value,
                numberOfSeats: this.carForm.controls['numberOfSeats'].value,
                transmissionType: this.carForm.controls['transmissionType'].value,
                color: this.carForm.controls['color'].value,
                rentalPointId: this.carForm.controls['rentalPointId'].value,
                description: this.carForm.controls['description'].value,
                pictureShortName: this.carForm.controls['pictureShortName'].value,
                pictureBase64Content: this.imageContent,
                pictureExtension: this.imageExtension,
                imageId: this.image.id
            }
            this.carService.updateCar(updateCarModel).subscribe(() => this.router.navigate([RENTAL_POINTS_PAGE + `/${this.carForm.value.rentalPointId}/` + CARLIST_PAGE_PATH]));
        }
    }
}