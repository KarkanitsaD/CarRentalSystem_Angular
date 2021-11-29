import { Component, OnInit} from "@angular/core";
import { ParamMap, Router } from "@angular/router";
import { CarService } from "src/app/shared/services/car.service";
import { ActivatedRoute } from "@angular/router";
import { RentalPointService } from "src/app/shared/services/rental-point.service";
import { CarImageService } from "src/app/shared/services/car-image.service";
import { IMAGE_NOT_FOUND_URL } from "src/app/core/constants/shared";
import { RentalPointAddCarModel } from "../add-car/types/rentalPoint-add-car.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CARLIST_PAGE_PATH, PAGE_NOT_FOUND_PATH } from "src/app/core/constants/page-constans";
import { AddCarModel } from "../add-car/types/add-car.model";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";

@Component({
    selector: 'app-update-car',
    templateUrl: './update-car-component.html',
    styleUrls: ['./update-car-component.css'],
})
export class UpdateCarComponent implements OnInit{
   
    private pictureBase64Content: string = '';
    private pictureExtension: string = '';
    private carId!: string;
    private baseImageUrl!: string;
    private imageId!: string;

    public rentalPoints: RentalPoint[] = new Array<RentalPoint>();
    public imageUrl: string = IMAGE_NOT_FOUND_URL;
    public updateCarForm!: FormGroup;
    
    constructor
    (
        private carService: CarService,
        private router: Router,
        private route: ActivatedRoute,
        private rentalPointService: RentalPointService,
        private carImageService: CarImageService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.rentalPointService.getPageRentalPointsList().subscribe(data => {this.rentalPoints = data.rentalPoints;});

        let id: string | null = '';
        this.route.paramMap.subscribe((params: ParamMap) => {
            id = params.get('carId');
        });
        if(id == null) {
            this.router.navigate([PAGE_NOT_FOUND_PATH]);
        }    
        this.carId = id;
        
        this.carService.getCar(this.carId).subscribe(data => {
            this.updateCarForm = this.fb.group({
                brand: [data.brand, Validators.required],
                model: [data.model, Validators.required],
                pricePerDay: [data.pricePerDay, [Validators.required, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')]],   
                fuelConsumptionPerHundredKilometers: [data.fuelConsumptionPerHundredKilometers, [Validators.required, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')]],
                numberOfSeats: [data.numberOfSeats, [Validators.required, Validators.pattern('\[0-9]{1,2}')]],
                transmissionType: [data.transmissionType],
                color: [data.color],
                rentalPointId:[data.rentalPointId, [Validators.required]],
                pictureShortName: ['', [Validators.required]]
            });

            this.carImageService.getImage(this.carId).subscribe(image => {
                this.baseImageUrl = `data:${image.extension};base64,${image.content}`;
                this.imageUrl = this.baseImageUrl;
                this.updateCarForm.controls['pictureShortName'].setValue(image.shortName);
                this.imageId = image.id;
            });
        }, () => {
            this.router.navigate([PAGE_NOT_FOUND_PATH]);
        });
    }

    getRentalPointDisplayTitle(rentalPoint: RentalPointAddCarModel): string {
        let title = '';
        title += rentalPoint.title != null ? rentalPoint.title : '';
        title += rentalPoint.address != null ? '. Adress: ' + rentalPoint.address : '';
        return title;  
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
                this.updateCarForm.controls['pictureShortName'].setValue(imageFile.name);
            }
        }
        else{
            this.imageUrl = this.baseImageUrl;
            this.updateCarForm.controls['pictureShortName'].setValue('');
        }
    }

    updateCar(): void {

        let addCarModel: AddCarModel = {
            id: this.carId,
            brand: this.updateCarForm.value.brand,
            model: this.updateCarForm.value.model,
            pricePerDay: Number(this.updateCarForm.value.pricePerDay),
            fuelConsumptionPerHundredKilometers: Number(this.updateCarForm.value.fuelConsumptionPerHundredKilometers),
            numberOfSeats: Number(this.updateCarForm.value.numberOfSeats),
            transmissionType: this.updateCarForm.value.transmissionType,
            color: this.updateCarForm.value.color,
            pictureExtension: this.pictureExtension,
            rentalPointId: this.updateCarForm.value.rentalPointId,
            pictureShortName: this.updateCarForm.value.pictureShortName,
            pictureBase64Content: this.pictureBase64Content,
            imageId: this.imageId
        };
        this.carService.updateCar(addCarModel).subscribe(() => this.router.navigate([CARLIST_PAGE_PATH]));    
    }
}
