import { Component, Input, OnInit, Output } from "@angular/core";
import { RentalPointFiltrationModel } from "src/app/shared/models/rental-point/rental-point-filtration.model";
import { EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup} from "@angular/forms";
import { City } from "src/app/shared/models/city.model";
import { LoginService } from "src/app/shared/services/login.service";
import { DateTimeRangePickerValidationHelper } from "src/app/shared/helpers/date-time-range-picker-validation.helper";
import { Store } from "@ngrx/store";
import { State } from "src/app/store";
import { areCitiesLoaded, areCountriesLoaded, citiesSelector, countriesSelector, loadAllCities, loadAllCountries } from "src/app/store/locations";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Component({
    selector: 'app-rental-point-filtration',
    templateUrl: './rental-point-filtration.component.html',
    styleUrls: ['./rental-point-filtration.component.css']
})
export class RentalPointFiltrationComponent implements OnInit {

    allCountries$ = this.store.select(countriesSelector);
    allCities$ = this.store.select(citiesSelector);
    citiesToShow$ = new Observable<City[]>();

    public minTime = new Date();

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
        private loginService: LoginService,
        private dateTimeRangePickerValidationHelper: DateTimeRangePickerValidationHelper,
        private store: Store<State>,
    ) {}


    ngOnInit(): void {
        this.store.select(areCountriesLoaded)
        .subscribe(loaded => loaded ? {} : this.store.dispatch(loadAllCountries()));
        this.store.select(areCitiesLoaded)
        .subscribe(loaded => loaded ? {} : this.store.dispatch(loadAllCities()));
        this.fillForm();
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
        this.citiesToShow$ = this.allCities$.pipe(
            map(cities => cities.filter(city => city.countryId === countryId))
        );
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

    public addMinutesAndHoursInputValidators(): void {
        this.dateTimeRangePickerValidationHelper.addMinutesAndHoursInputValidators();
    }
}