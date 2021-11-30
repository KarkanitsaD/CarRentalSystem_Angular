import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { PAGE_NOT_FOUND_PATH, UPDATE_CAR_PAGE_PATH } from "src/app/core/constants/page-constans";
import { CARS_PAGINATION_SIZE } from "src/app/core/constants/pagination-constans";
import { Car } from "src/app/shared/models/car/car.model";
import { CarImageService } from "src/app/shared/services/car-image.service";
import { CarService } from "src/app/shared/services/car.service";
import { LoginService } from "src/app/shared/services/login.service";
import { BookCarComponent } from "../book-car/book-car.component";
import { CarDetailsComponent } from "../car-details/car-details.component";

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
        private router: Router,
        private modalService: NgbModal,
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

                if(keyReceivingTime !== undefined && keyHandOverTime !== undefined) {
                    let range = new Array<Date>();
                    range.push(keyReceivingTime);
                    range.push(keyHandOverTime);
                    this.filterForm.controls['range'].setValue(range);
                }
                else if(!this.isAdmin()) {
                    this.router.navigate([PAGE_NOT_FOUND_PATH]);
                }
            });
        });
    }
    
    ngOnInit() {
        this.getPage(1);
    }

    isAdmin(): boolean {
        return this.loginService.getRole() === 'Admin';
    }

    isLogin(): boolean {
        return this.loginService.isLogin();
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

    showDetails(car: Car): void{
        const modalRef = this.modalService.open(CarDetailsComponent);
        modalRef.componentInstance.car = car;
    }

    deleteCar(carId: string) {
        this.carService.deleteCar(carId).subscribe(() => window.location.reload());
    }

    updateCar(carId: string) {
        this.router.navigate([UPDATE_CAR_PAGE_PATH, carId]);
    }

    showRentCarWindow(car: Car): void {
        const modalRef = this.modalService.open(BookCarComponent);
        modalRef.componentInstance.car = car;
        modalRef.componentInstance.keyHandOverTime = this.keyHandOverTime;
        modalRef.componentInstance.keyReceivingTime = this.keyReceivingTime;
    }
}