import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ParamMap, Router } from "@angular/router";
import { Car } from "src/app/shared/models/car.model";
import { City } from "src/app/shared/models/city.model";
import { Country } from "src/app/shared/models/country.model";
import { CarService } from "src/app/shared/services/car.service";
import { RentalPointAddCarModel } from "../add-car/types/rentalPoint-add-car.model";
import { ActivatedRoute } from "@angular/router";
import { RentalPointService } from "src/app/shared/services/rental-point.service";
import { CityService } from "src/app/shared/services/city.service";
import { CountryService } from "src/app/shared/services/country.service";
import { ImageService } from "src/app/shared/services/image.service";
import { environment } from "src/environments/environment";
import { CAR_PICTURES_URL } from "src/app/core/constants/api-url-constans";
import { AddCarModel } from "../add-car/types/add-car.model";
import { CARLIST_PAGE_PATH } from "src/app/core/constants/page-constans";

@Component({
    selector: 'app-update-car',
    templateUrl: './update-car-component.html',
    styleUrls: ['./update-car-component.css'],
})
export class UpdateCarComponent implements OnInit{

    constructor
    (
        private carService: CarService,
        private router: Router,
        private route: ActivatedRoute,
        private rentalPointService: RentalPointService,
        private cityService: CityService,
        private countryService: CountryService,
        private imageService: ImageService,
    ) {}

    @Input() carId!: string;
    car!: Car;
    imageUrl!: string;
    @ViewChild('img', { static: true }) image!: ElementRef;
    
    private pictureBase64Content: string = '';
    private pictureExtension: string = '';

    public countries: Country[] = new Array<Country>();
    public filteredCountries: Country[] = new Array<Country>();

    public cities: City[] = new Array<City>();
    public filteredCities: City[] = new Array<City>();

    public rentalPoints: RentalPointAddCarModel[] = new Array<RentalPointAddCarModel>();
    public filteredRentalPoints: RentalPointAddCarModel[] = new Array<RentalPointAddCarModel>();

    updateCarForm = new FormGroup({
        brand: new FormControl('', [Validators.required]),
        model: new FormControl('', [Validators.required]),
        pricePerDay: new FormControl('', [Validators.required, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')]),   
        fuelConsumptionPerHundredKilometers: new FormControl('', [Validators.required, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')]),
        numberOfSeats: new FormControl('', [Validators.required, Validators.pattern('\[0-9]{1,2}')]),
        transmissionType: new FormControl(''),
        color: new FormControl(''),
        rentalPointId: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        image: new FormControl(''),
        pictureShortName: new FormControl('', [Validators.required])
    });


    ngOnInit(): void {
        this.countryService.getCountries().subscribe(data => {this.countries = data; this.filteredCountries = this.countries.slice()});
        this.cityService.getCities().subscribe(data => {this.cities = data; this.filteredCities = this.cities.slice()});
        this.rentalPointService.getRentalPointAddCarModels().subscribe(data => {this.rentalPoints = data; this.filteredRentalPoints = this.rentalPoints.slice()});

        let id: string | null = '';
        this.route.paramMap.subscribe((params: ParamMap) => {
            id = params.get('carId');
        });
        if(id == null) {
            return;
        }      

        this.carService.getCar(id).subscribe(data => {
            this.car = data;
            this.updateCarForm.controls['brand'].setValue(this.car.carBrand);
            this.updateCarForm.controls['model'].setValue(this.car.carBrand);
            this.updateCarForm.controls['pricePerDay'].setValue(this.car.pricePerDay);
            this.updateCarForm.controls['fuelConsumptionPerHundredKilometers'].setValue(this.car.fuelConsumptionPerHundredKilometers);
            this.updateCarForm.controls['numberOfSeats'].setValue(this.car.numberOfSeats);
            this.updateCarForm.controls['transmissionType'].setValue(this.car.transmissionType);
            this.updateCarForm.controls['color'].setValue(this.car.color);
        });

        this.imageService.getImageUrl(`${environment.api_url}${CAR_PICTURES_URL}/` + id).subscribe(image => {
            let url = URL.createObjectURL(image.fileResult);
            this.image.nativeElement.src = url;

            this.updateCarForm.controls['pictureShortName'].setValue(image.shortName);
        });
    }

    onCountryChanged(): void {
        let countryTitle = this.updateCarForm.value.country;
        let country = this.countries.find(cnt => cnt.title === countryTitle);
        if(country) {
            let cities = this.cities.filter(ct => ct.countryId === country?.id);
            let rentalPoints = this.rentalPoints.filter(rp => rp.countryId === country?.id);

            this.filteredCities = cities;
            this.filteredRentalPoints = rentalPoints;

            this.updateCarForm.controls['city'].setValue(cities[0].title);
            this.updateCarForm.controls['rentalPointId'].setValue(rentalPoints[0]);
        }
    }

    onCityChanged(): void {
        let cityTitle = this.updateCarForm.value.city;
        let city = this.cities.find(ct => ct.title === cityTitle);
        if(city) {
            let country = this.countries.find(cnt => cnt.id === city?.countryId);
            let rentalPoints = this.rentalPoints.filter(rp => rp.cityId === city?.id);

            this.filteredRentalPoints = rentalPoints;

            this.updateCarForm.controls['country'].setValue(country?.title);
            this.updateCarForm.controls['rentalPointId'].setValue(rentalPoints[0]);
        }
    }

    onRentalPointChanged(): void {
        let rentalPointId = this.updateCarForm.value.rentalPointId;
        let rentalPoint = this.rentalPoints.find(rp => rp.id === rentalPointId);
        if(rentalPoint) {
            let city = this.cities.find(ct => ct.id === rentalPoint?.cityId);
            let country = this.countries.find(cnt => cnt.id === rentalPoint?.countryId);

            this.updateCarForm.controls['city'].setValue(city?.title);
            this.updateCarForm.controls['country'].setValue(country?.title);
        }
    }

    getRentalPointDisplayTitle(rentalPoint: RentalPointAddCarModel): string {
        let title = '';
        title += rentalPoint.title != null ? rentalPoint.title : '';
        title += rentalPoint.address != null ? '. Adress: ' + rentalPoint.address : '';
        return title;  
    }

    onImageSelected(event: any) {
        if(event.target.files) {
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event: any) => {
                let url = event.target.result as string;
                this.imageUrl = url;

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

    updateCar(): void {

        let addCarModel: AddCarModel = {
            id: this.car.id,
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
            pictureBase64Content: this.pictureBase64Content
        };
        this.carService.updateCar(addCarModel).subscribe(() => this.router.navigate([CARLIST_PAGE_PATH]));    
    }
}