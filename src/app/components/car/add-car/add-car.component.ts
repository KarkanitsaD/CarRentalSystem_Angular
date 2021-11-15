import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CARLIST_PAGE_PATH } from "src/app/core/constants/page-constans";
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
    public filteredCountries: Country[] = new Array<Country>();

    public cities: City[] = new Array<City>();
    public filteredCities: City[] = new Array<City>();

    public rentalPoints: RentalPointAddCarModel[] = new Array<RentalPointAddCarModel>();
    public filteredRentalPoints: RentalPointAddCarModel[] = new Array<RentalPointAddCarModel>();

    public cityValue: string = '';
    public countryValue: string = '';

    constructor
    (
        private carService: CarService,
        private countryService: CountryService,
        private cityService: CityService,
        private rentalPointService: RentalPointService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.countryService.getCountries().subscribe(data => {this.countries = data; this.filteredCountries = this.countries.slice()});
        this.cityService.getCities().subscribe(data => {this.cities = data; this.filteredCities = this.cities.slice()});
        this.rentalPointService.getRentalPointAddCarModels().subscribe(data => {this.rentalPoints = data; this.filteredRentalPoints = this.rentalPoints.slice()});
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
        rentalPointId: new FormControl('', [Validators.required]),
        city: new FormControl(this.cityValue, [Validators.required]),
        country: new FormControl(this.countryValue, [Validators.required]),
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
            rentalPointId: this.addCarForm.value.rentalPointId,
            pictureShortName: this.addCarForm.value.pictureShortName,
            pictureBase64Content: this.pictureBase64Content
        };
        this.carService.createCar(addCarModel).subscribe(() => this.router.navigate([CARLIST_PAGE_PATH]));        
    }

    onImageSelected(event: any) {
        if(event.target.files) {
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event: any) => {
                let url = event.target.result as string;
                this.imageUrl = url;

                debugger
                let firstExtensionIndex = url.indexOf(':');
                let secondExtensionIndex = url.indexOf(';');

                let extension = url.substring(firstExtensionIndex + 1, secondExtensionIndex);
                this.pictureExtension = extension;

                let base64Index = url.indexOf(';base64,') + ';base64,'.length;
                let pictureBase64Content = url.substring(base64Index);
                this.pictureBase64Content = pictureBase64Content;
            }
        }
    }

    onCountryChanged(): void {
        let countryTitle = this.addCarForm.value.country;
        let country = this.countries.find(cnt => cnt.title === countryTitle);
        if(country) {
            let cities = this.cities.filter(ct => ct.countryId === country?.id);
            let rentalPoints = this.rentalPoints.filter(rp => rp.countryId === country?.id);

            this.filteredCities = cities;
            this.filteredRentalPoints = rentalPoints;

            this.addCarForm.controls['city'].setValue('');
            this.addCarForm.controls['rentalPointId'].setValue('');
        }
    }

    onCityChanged(): void {
        let cityTitle = this.addCarForm.value.city;
        let city = this.cities.find(ct => ct.title === cityTitle);
        if(city) {
            let country = this.countries.find(cnt => cnt.id === city?.countryId);
            let rentalPoints = this.rentalPoints.filter(rp => rp.cityId === city?.id);

            this.addCarForm.controls['country'].setValue(country?.title);
            this.filteredRentalPoints = rentalPoints;

            this.addCarForm.controls['rentalPointId'].setValue('');
        }
    }

    onRentalPointChanged(): void {
        let rentalPointId = this.addCarForm.value.rentalPointId;
        let rentalPoint = this.rentalPoints.find(rp => rp.id === rentalPointId);
        if(rentalPoint) {
            let city = this.cities.find(ct => ct.id === rentalPoint?.cityId);
            let country = this.countries.find(cnt => cnt.id === rentalPoint?.countryId);

            this.addCarForm.controls['city'].setValue(city?.title);
            this.addCarForm.controls['country'].setValue(country?.title);
            return;
        }
    }
}