import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CARS_PAGINATION_SIZE } from "src/app/core/constants/pagination-constans";
import { ADMIN_ROLE } from "src/app/core/constants/role-constans";
import { Car } from "src/app/shared/models/car.model";
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
    public itemsTotalCount: number = 1;
    public currentPageNumber: number = 1;

    constructor
    (
        private carService: CarService,
        private loginService: LoginService,
        private fb: FormBuilder
    ) {}
    
    ngOnInit() {
        this.getPage(this.currentPageNumber);
    }

    isAdmin(): boolean {
        return this.loginService.getRoles().includes(ADMIN_ROLE);
    }

    filter(): void {
        let params: HttpParams = new HttpParams();
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
        this.carService.getPageCarList(params).subscribe(data => {
            this.cars = data.cars;
        });
    }

    getPage(page: number): void{
        let params: HttpParams = new HttpParams();
        params = params.append('pageIndex', page - 1);
        params = params.append('pageSize', 3);
        this.carService.getPageCarList(params).subscribe(data => {
            this.itemsTotalCount = data.itemsTotalCount + 3;
            this.cars = data.cars;
        });
    }
}