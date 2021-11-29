import { Component, Input, OnInit, Output } from "@angular/core";
import { RentalPointFiltrationModel } from "src/app/shared/models/rental-point/rental-point-filtration.model";
import { EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Country } from "src/app/shared/models/country.model";
import { City } from "src/app/shared/models/city.model";
import { CountryService } from "src/app/shared/services/country.service";
import { CityService } from "src/app/shared/services/city.service";

@Component({
    selector: 'app-rental-point-filtration',
    templateUrl: './rental-point-filtration.component.html',
    styleUrls: ['./rental-point-filtration.component.css']
})
export class RentalPointFiltrationComponent implements OnInit{

    public countries!: Country[];
    public cities!: City[];
    public allCities!: City[];
    public filtrationForm: FormGroup =this.fb.group({
        keyReceivingTime: [],
        keyHandOverTime: [],
        numberOfAvaliableCars: [],
        cityId: [],
        countryId: []
    });  
    @Output() onFiltered = new EventEmitter<RentalPointFiltrationModel>();
    @Input() rpFiltrationModel!: RentalPointFiltrationModel;
    
    constructor
    (
        private fb: FormBuilder,
        private countryService: CountryService,
        private cityService: CityService
    ) {}

    ngOnInit(): void {
        this.countryService.getCountries().subscribe(countries => {
            this.countries = countries;
            this.cityService.getCities().subscribe(cities => {
                this.allCities = cities;
                this.filterCities(countries[0].id);
                this.filtrationForm = this.fb.group({
                    keyReceivingTime: [this.rpFiltrationModel.keyReceivingTime],
                    keyHandOverTime: [this.rpFiltrationModel.keyHandOverTime],
                    numberOfAvaliableCars: [this.rpFiltrationModel.numberOfAvaliableCars],
                    countryId: [this.rpFiltrationModel.countryId],
                    cityId: [this.rpFiltrationModel.cityId],
                });
            });
        });
    }

    filter() {
        let rentalPointFiltrationModel: RentalPointFiltrationModel = {
            keyHandOverTime: new Date(),
            keyReceivingTime: new Date(),
            numberOfAvaliableCars: this.filtrationForm.controls['numberOfAvaliableCars'].value,
            cityId: this.filtrationForm.controls['cityId'].value,
            countryId: this.filtrationForm.controls['countryId'].value
        }
        this.onFiltered.emit(rentalPointFiltrationModel);
    }

    public onCountrySelected(event: any): void {
        let countryId = event.target.value;
        this.filterCities(countryId);
    }

    private filterCities(countryId: string): void {
        this.cities = this.allCities.filter(city => city.countryId === countryId);   
    }
}