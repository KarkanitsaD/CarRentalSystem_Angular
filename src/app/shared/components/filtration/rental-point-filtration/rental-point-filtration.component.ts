import { Component, Input, OnInit, Output } from "@angular/core";
import { RentalPointFiltrationModel } from "src/app/shared/models/rental-point/rental-point-filtration.model";
import { EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup} from "@angular/forms";
import { Country } from "src/app/shared/models/country.model";
import { City } from "src/app/shared/models/city.model";
import { CountryService } from "src/app/shared/services/country.service";
import { CityService } from "src/app/shared/services/city.service";
import { LoginService } from "src/app/shared/services/login.service";
import { DateTimeRangePickerValidationHelper } from "src/app/shared/helpers/date-time-range-picker-validation.helper";

@Component({
    selector: 'app-rental-point-filtration',
    templateUrl: './rental-point-filtration.component.html',
    styleUrls: ['./rental-point-filtration.component.css']
})
export class RentalPointFiltrationComponent implements OnInit {

    public minTime = new Date();

    public countries!: Country[];
    public cities!: City[];
    public allCities!: City[];

    public filtrationForm: FormGroup = this.fb.group({
        range: [],
        numberOfAvaliableCars: [],
        cityId: [''],
        countryId: ['']
    });

    @Output() onFiltered = new EventEmitter<RentalPointFiltrationModel>();
    @Output() onFiltrationChanged = new EventEmitter();
    @Input() rpFiltrationModel!: RentalPointFiltrationModel;
    
    constructor
    (
        private fb: FormBuilder,
        private countryService: CountryService,
        private cityService: CityService,
        private loginService: LoginService,
        private dateTimeRangePickerValidationHelper: DateTimeRangePickerValidationHelper
    ) {}


    ngOnInit(): void {
        this.countryService.getCountries().subscribe(countries => {
            this.countries = countries;
            this.cityService.getCities().subscribe(cities => {
                this.allCities = cities;
                this.fillForm();
            });
        });
    }

    public filter(): void {
        let range = this.filtrationForm.controls['range'].value;
        let rentalPointFiltrationModel: RentalPointFiltrationModel = {
            keyReceivingTime: range !== null ?  this.filtrationForm.controls['range'].value[0] : undefined,
            keyHandOverTime: range !== null ? this.filtrationForm.controls['range'].value[1] : undefined,
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

    public isValidRangeInput(): boolean {
        let range = this.filtrationForm.controls['range'].value as Array<Date>;
        let isValidRange = range && range.length === 2 && range[0] !== null && range[1] !== null;   
        return isValidRange;
    }

    public isAdmin() {
        return  this.loginService.getRole() === 'Admin';
    }

    private fillForm(): void {
        if(this.rpFiltrationModel) {
            if(this.rpFiltrationModel.keyHandOverTime && this.rpFiltrationModel.keyReceivingTime) {
                let range = new Array<Date>();
                range.push(this.rpFiltrationModel.keyReceivingTime);
                range.push(this.rpFiltrationModel.keyHandOverTime);
                this.filtrationForm.controls['range'].setValue(range);
            }
            if(this.rpFiltrationModel.countryId) {
                let countryId = this.rpFiltrationModel.countryId;
                this.filtrationForm.controls['countryId'].setValue(countryId);
                if(this.rpFiltrationModel.cityId) {
                    this.filterCities(countryId);
                    this.filtrationForm.controls['cityId'].setValue(this.rpFiltrationModel.cityId);
                }
            }
            if(this.rpFiltrationModel.numberOfAvaliableCars) {
                this.filtrationForm.controls['numberOfAvaliableCars'].setValue(this.rpFiltrationModel.numberOfAvaliableCars);
            }
        }
    }

    public handleNumberOfAvailebleCarsKeyPress(event: KeyboardEvent): void {
        if(!(event.key >= "0" && event.key <= "9"))
            event.preventDefault();
    }

    public addMinutesAndHoursInputValidators(): void {
        this.dateTimeRangePickerValidationHelper.addMinutesAndHoursInputValidators();
    }
}