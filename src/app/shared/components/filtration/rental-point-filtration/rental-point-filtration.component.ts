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
        range: [],
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

                let range = new Array<Date>();
                const today = new Date();
                const tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);
                range.push(today);
                range.push(tomorrow);
                this.filtrationForm.controls['range'].setValue(range);

                if(this.rpFiltrationModel !== null) {
                    if(this.rpFiltrationModel.keyHandOverTime !== undefined && this.rpFiltrationModel.keyReceivingTime !== undefined) {
                        let range = new Array<Date>();
                        range.push(this.rpFiltrationModel.keyReceivingTime);
                        range.push(this.rpFiltrationModel.keyHandOverTime);
                        this.filtrationForm.controls['range'].setValue(range);
                    }
                    if(this.rpFiltrationModel.countryId !== undefined) {
                        let countryId = this.rpFiltrationModel.countryId;
                        this.filtrationForm.controls['countryId'].setValue(countryId);
                        this.filtrationForm.controls['cityId'].setValue('');
                        if(this.rpFiltrationModel.cityId !== undefined) {
                            this.filterCities(countryId);
                            this.filtrationForm.controls['cityId'].setValue(this.rpFiltrationModel.cityId);
                        }
                    }
                    if(this.rpFiltrationModel.numberOfAvaliableCars !== undefined) {
                        this.filtrationForm.controls['numberOfAvaliableCars'].setValue(this.rpFiltrationModel.numberOfAvaliableCars);
                    }
                }
            });
        });
    }

    filter() {
        let rentalPointFiltrationModel: RentalPointFiltrationModel = {
            keyReceivingTime: this.filtrationForm.controls['range'].value[0],
            keyHandOverTime: this.filtrationForm.controls['range'].value[1],
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
        this.filtrationForm.controls['cityId'].setValue(''); 
    }

    c(event: any){
        console.log(event.value);
    }
}