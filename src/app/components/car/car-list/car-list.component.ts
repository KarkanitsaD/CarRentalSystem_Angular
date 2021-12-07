import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { PAGE_NOT_FOUND_PATH, UPDATE_CAR_PAGE_PATH } from "src/app/core/constants/page-constans";
import { CARS_PAGINATION_SIZE } from "src/app/core/constants/pagination-constans";
import { Car } from "src/app/shared/models/car/car.model";
import { CarService } from "src/app/shared/services/car.service";
import { CostCalculator } from "src/app/shared/services/cost-calculator.service";
import { LoginService } from "src/app/shared/services/login.service";
import { BookCarComponent } from "../book-car/book-car.component";

@Component({
    selector: 'app-car-list',
    templateUrl: './car-list.component.html',
    styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

    public spinner: boolean = true;
    public cars: Car[] = [];
    private rpId!: string;
    public filterForm = this.fb.group({
        brand: [],
        color: [],
        minPricePerDay: [, Validators.pattern('([0-9]+[/.])?[0-9]{1,2}')],
        maxPricePerDay: [, Validators.pattern('([0-9]+[/.])?[0-9]{1,2}')],
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
        private router: Router,
        private modalService: NgbModal,
        public costCalculator: CostCalculator
    ) {
        this.routeSubscription = route.params.subscribe(params => {
            this.rpId = params['rentalPointId'];
            if(this.rpId === undefined) {
                this.router.navigate([PAGE_NOT_FOUND_PATH]);
            }
            this.route.queryParams.subscribe((queryParam: any) => {
                let keyReceivingTime = queryParam['keyReceivingTime'] as Date;
                let keyHandOverTime = queryParam['keyHandOverTime'] as Date;
                if(keyReceivingTime === undefined && keyHandOverTime === undefined && !this.isAdmin()) {
                    this.router.navigate([PAGE_NOT_FOUND_PATH]);
                }
                else {
                    this.keyReceivingTime = keyReceivingTime;
                    this.keyHandOverTime = keyHandOverTime;
                    let range = new Array<Date>();
                    range.push(keyReceivingTime);
                    range.push(keyHandOverTime);
                    this.filterForm.controls['range'].setValue(range);
                }
            });
        });
    }
    
    ngOnInit() {
        this.getPage(1);
    }

    public isAdmin(): boolean {
        return this.loginService.getRole() === 'Admin';
    }

    public isLogin(): boolean {
        return this.loginService.isLogin();
    }

    public getPage(pageNumber: number): void {
        this.cars = [];
        this.itemsTotalCount = 0;
        this.spinner = true;
        this.currentPageNumber = pageNumber;
        let params: HttpParams = new HttpParams();
        params = this.setPaginationParams(params, this.currentPageNumber);
        params = this.setFilterParams(params);
        this.carService.getPageCarList(params).subscribe(data => {
            this.itemsTotalCount =  data.itemsTotalCount;
            this.cars = data.cars;
            this.spinner = false;
        },
        () => {
            this.spinner = false;
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
        if(this.isValidRange()) {
            let range = this.filterForm.controls['range'].value as Array<Date>;
            params = params.append('keyReceivingTime', new Date(range[0].toString()).toJSON());
            params = params.append('keyHandOverTime', new Date(range[1].toString()).toJSON());
            this.keyReceivingTime = new Date(range[0].toString());
            this.keyHandOverTime = new Date(range[1].toString());
        }
        return params;
    }

    private setPaginationParams(params: HttpParams, pageNumber: number): HttpParams {
        params = params.append('pageIndex', pageNumber - 1);
        params = params.append('pageSize', CARS_PAGINATION_SIZE);

        return params;
    }

    public deleteCar(carId: string) {
        this.carService.deleteCar(carId).subscribe(() => window.location.reload());
    }

    public updateCar(carId: string) {
        this.router.navigate([UPDATE_CAR_PAGE_PATH, carId]);
    }

    public showRentCarWindow(car: Car): void {
        const modalRef = this.modalService.open(BookCarComponent);
        modalRef.componentInstance.car = car;
        modalRef.componentInstance.keyHandOverTime = this.keyHandOverTime;
        modalRef.componentInstance.keyReceivingTime = this.keyReceivingTime;
    }

    public isValidRangeInput(): boolean {
        let isAdmin: boolean = this.loginService.getRole() === 'Admin';  
        return this.isValidRange() || isAdmin;
    }

    private isValidRange(): boolean {
        let range = this.filterForm.controls['range'].value as Array<Date>;
        return range &&
        range.length === 2 &&
        range[0] !== null &&
        range[1] !== null &&
        range[0] &&
        range[1] !== undefined;  
    }

    public countDays(): number {
        return this.costCalculator.countDays(this.keyHandOverTime, this.keyReceivingTime);
    }

    public getCost(pricePerDay: number): string {
        return this.costCalculator.getCost(this.keyHandOverTime, this.keyReceivingTime, pricePerDay).toFixed(2);
    }

    public addCar() {
        this.router.navigate([`rentalPoints/${this.rpId}/cars/addCar`]);
    }
}