import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { City } from "src/app/shared/models/city.model";
import { Country } from "src/app/shared/models/country.model";
import { CarService } from "src/app/shared/services/car.service";
import { CityService } from "src/app/shared/services/city.service";
import { CountryService } from "src/app/shared/services/country.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";
import { AddCarModel } from "./types/add-car.model";
import { RentalPointAddCarModel } from "./types/rentalPoint-add-car.model";

@Component({
    selector: 'app-add-car',
    templateUrl: './add-car.component.html',
    styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit{

    private pictureBase64Content: string = '';
    private pictureExtension: string = '';

    public countries: Country[] = new Array<Country>();
    public cities: City[] = new Array<City>();
    public rentalPoints: RentalPointAddCarModel[] = new Array<RentalPointAddCarModel>();

    constructor
    (
        private carService: CarService,
        private countryService: CountryService,
        private cityService: CityService,
        private rentalPointService: RentalPointService
    ) {}

    ngOnInit(): void {
        this.countryService.getCountries().subscribe(data =>this.countries = data);
        this.cityService.getCities().subscribe(data => this.cities = data);
        this.rentalPointService.getRentalPointAddCarModels().subscribe(data => {this.rentalPoints = data; console.log(data)});
    }
    
    imageUrl: string = "https://www.buhuslugi.by/wp-content/themes/consultix/images/no-image-found-360x250.png";

    addCarForm = new FormGroup({
        brand: new FormControl('', [Validators.required]),
        model: new FormControl('', [Validators.required]),
        pricePerDay: new FormControl('', [Validators.required, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')]),   
        fuelConsumptionPerHundredKilometers: new FormControl('', [Validators.required]),
        numberOfSeats: new FormControl('', [Validators.required, Validators.pattern('\[0-9]{1,2}')]),
        transmissionType: new FormControl(''),
        color: new FormControl(''),
        rentalPoint: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        image: new FormControl('', [Validators.required]),
        pictureShortName: new FormControl('', [Validators.required])
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
            rentalPointId: this.addCarForm.value.rentalPoint,
            pictureShortName: this.addCarForm.value.pictureShortName,
            pictureBase64Content: this.pictureBase64Content
        };
        this.carService.createCar(addCarModel).subscribe();
    }

    onImageSelected(event: any) {
        if(event.target.files) {
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event: any) => {
                let url = event.target.result as string;
                this.imageUrl = url;

                let firstExtensionIndex = url.indexOf('/');
                let secondExtensionIndex = url.indexOf(';');

                let extension = url.substring(firstExtensionIndex + 1, secondExtensionIndex);
                this.pictureExtension = extension;

                let base64Index = url.indexOf(';base64,') + ';base64,'.length;
                let pictureBase64Content = url.substring(base64Index);
                this.pictureBase64Content = pictureBase64Content;
            }
        }
    }

    onRentalPointSelected(): void {

        console.log(this.addCarForm.value.rentalPoint);
        let rentalPointValue = this.addCarForm.value.rentalPoint;

        this.cities = this.cities.filter(data => data.id === rentalPointValue)
    }

    onCitySelected(): void {

    }

    onCountrySelected(): void {
    }
}