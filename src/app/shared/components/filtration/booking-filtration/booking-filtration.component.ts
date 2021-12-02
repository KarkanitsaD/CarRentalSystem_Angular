import { Component, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { CityService } from "src/app/shared/services/city.service";
import { CountryService } from "src/app/shared/services/country.service";
import { EventEmitter } from "@angular/core";
import { Country } from "src/app/shared/models/country.model";
import { City } from "src/app/shared/models/city.model";
import { BookingFiltrationModel } from "src/app/shared/models/booking/booking-filtration.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-car-filtration',
    templateUrl: './booking-filtration.component.html',
    styleUrls: ['./booking-filtration.component.css']
})
export class CarFiltrationComponent implements OnInit {

    @Output() onFiltered = new EventEmitter<BookingFiltrationModel>();
    public countries!: Country[];
    public cities!: City[];
    public allCities!: City[];
    public keyword: string = "title";
    
    public filtrationForm: FormGroup = this.fb.group({
        countryId: [''],
        cityId: [''],
        get:['current']
    });

    constructor
    (
        private countryService: CountryService,
        private cityService: CityService,
        private fb: FormBuilder
    ) 
    {}

    ngOnInit(): void {
        this.countryService.getCountries().subscribe(countries => {
            this.countries = countries;
            this.cityService.getCities().subscribe(cities => {
                this.allCities = cities;
            });
        });
    }

    filter() {
        let current = this.filtrationForm.controls['get'].value;
        let bookingFiltration: BookingFiltrationModel = {
            countryId: this.filtrationForm.controls['countryId'].value,
            cityId: this.filtrationForm.controls['cityId'].value,
            getCurrent: current === 'current' ? true : (current === 'past' ? false : undefined)
        };
        debugger
        this.onFiltered.emit(bookingFiltration);
    }

    public onCountrySelected(event: any): void {
        let countryId = event.target.value;
        this.filterCities(countryId);
    }

    private filterCities(countryId: string): void {
        this.cities = this.allCities.filter(city => city.countryId === countryId); 
        this.filtrationForm.controls['cityId'].setValue('');
    }
}