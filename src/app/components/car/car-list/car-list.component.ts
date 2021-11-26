import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CARS_PAGINATION_SIZE } from "src/app/core/constants/pagination-constans";
import { Car } from "src/app/shared/models/car/car.model";
import { CarService } from "src/app/shared/services/car.service";
import { LoginService } from "src/app/shared/services/login.service";

@Component({
    selector: 'app-car-list',
    templateUrl: './car-list.component.html',
    styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

    public cars: Car[] = [];
    public filterForm = this.fb.group({
        brand: [''],
        color: [''],
        minPricePerDay: ['', Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')],
        maxPricePerDay: ['', Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')]
    });
    public itemsTotalCount: number = 0;
    public currentPageNumber: number = 1;

    constructor
    (
        private carService: CarService,
        private loginService: LoginService,
        private fb: FormBuilder
    ) {}
    
    ngOnInit() {
        this.getPage(1);
    }

    isAdmin(): boolean {
        return this.loginService.getRole() === 'Admin';
    }

    getPage(pageNumber: number): void {
        this.currentPageNumber = pageNumber;
        let params: HttpParams = new HttpParams();
        params = this.setPaginationParams(params, this.currentPageNumber);
        params = this.setFilterParams(params);
        this.carService.getPageCarList(params).subscribe(data => {
            this.itemsTotalCount =  data.itemsTotalCount;
            this.cars = data.cars;
        });
    }

    private setFilterParams(params: HttpParams): HttpParams {
        if(this.filterForm.value.brand != null && (this.filterForm.value.brand as string).trim() != '') {
            params = params.append('brand', this.filterForm.value.brand);
        }
        if(this.filterForm.value.color != null && (this.filterForm.value.color as string).trim() != '') {
            params = params.append('color', this.filterForm.value.color);
        }
        if(this.filterForm.value.minPricePerDay != null && (this.filterForm.value.minPricePerDay as string).trim() != '') {
            params = params.append('minPricePerDay', Number(this.filterForm.value.minPricePerDay));
        }
        if(this.filterForm.value.maxPricePerDay != null && (this.filterForm.value.maxPricePerDay as string).trim() != '') {
            params = params.append('maxPricePerDay', Number(this.filterForm.value.maxPricePerDay));
        }
        return params;
    }

    private setPaginationParams(params: HttpParams, pageNumber: number): HttpParams {
        params = params.append('pageIndex', pageNumber - 1);
        params = params.append('pageSize', CARS_PAGINATION_SIZE);

        return params;
    }
}