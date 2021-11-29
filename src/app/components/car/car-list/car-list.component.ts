import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { PAGE_NOT_FOUND_PATH } from "src/app/core/constants/page-constans";
import { CARS_PAGINATION_SIZE } from "src/app/core/constants/pagination-constans";
import { CarFiltrationModel } from "src/app/shared/models/car/car-filtration.model";
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
    private rpId!: string;
    public filterForm = this.fb.group({
        brand: [],
        color: [],
        minPricePerDay: [, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')],
        maxPricePerDay: [, Validators.pattern('([0-9]*[/.])?[0-9]{1,2}')],
        range: []
    });
    public itemsTotalCount: number = 0;
    public currentPageNumber: number = 1;

    public canRent: boolean = false;

    private routeSubscription!: Subscription;
    private querySubscription!: Subscription;
    public keyReceivingTime!: Date;
    public keyHandOverTime!: Date;

    constructor
    (
        private carService: CarService,
        private loginService: LoginService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.routeSubscription = route.params.subscribe(params => {
            this.rpId=params['rentalPointId'];
            if(this.rpId === undefined) {
                this.router.navigate([PAGE_NOT_FOUND_PATH]);
            }
            this.route.queryParams.subscribe((queryParam: any) => {
                let keyReceivingTime = queryParam['keyReceivingTime'] as Date;
                let keyHandOverTime = queryParam['keyHandOverTime'] as Date;
                this.keyReceivingTime = keyReceivingTime;
                this.keyHandOverTime = keyHandOverTime;
                let range = new Array<Date>();
                range.push(keyReceivingTime);
                range.push(keyHandOverTime);
                this.filterForm.controls['range'].setValue(range);
                // this.filterForm.controls['brand'] = queryParam['brand'];
                // this.filterForm.controls['minPricePerDay'] = queryParam['minPricePerDay'];
                // this.filterForm.controls['maxPricePerDay'] = queryParam['maxPricePerDay'];
            });
        });
    }
    
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
        if(this.rpId != null) {
            params = params.append('rentalPointId', this.rpId);
        }
        if(this.filterForm.controls['range'].value != null) {
            params = params.append('keyReceivingTime', this.filterForm.controls['range'].value[0]);
            params = params.append('keyHandOverTime', this.filterForm.controls['range'].value[1]);

        }
        return params;
    }

    private setPaginationParams(params: HttpParams, pageNumber: number): HttpParams {
        params = params.append('pageIndex', pageNumber - 1);
        params = params.append('pageSize', CARS_PAGINATION_SIZE);

        return params;
    }
}