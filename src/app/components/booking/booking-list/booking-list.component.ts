import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { retry } from "rxjs/operators";
import { BookingFiltrationModel } from "src/app/shared/models/booking/booking-filtration.model";
import { BookingItem } from "src/app/shared/models/booking/booking-item.model";
import { BookingService } from "src/app/shared/services/booking.service";

@Component({
    selector: 'app-booking-list',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.css']
})
export class BookingList implements OnInit{

    bookingFiltrationModel: BookingFiltrationModel = {
        getCurrent: true
    }
    public bookings!: BookingItem[];
    public itemsTotalCount: number = 0;
    public currentPageNumber: number = 1;

    constructor
    (
        private bookingService: BookingService
    ) {}

    ngOnInit(): void {
        this.getPage(this.currentPageNumber);
    }

    onFiltered(event : any) {
        this.bookingFiltrationModel = event as BookingFiltrationModel;
        this.getPage(this.currentPageNumber);
    }

    public getPage(pageNumber: number): void {
        this.currentPageNumber = pageNumber;
        let params: HttpParams = new HttpParams();
        params = this.getPaginationParams(params, this.currentPageNumber);
        params = this.getFiltrationParams(params);
        this.bookingService.getPageBookingList(params).subscribe(data => {
            this.itemsTotalCount =  data.itemsTotalCount;
            this.bookings = data.bookings;
        });
    }

    getFiltrationParams(httpParams: HttpParams): HttpParams {
        if(this.bookingFiltrationModel.countryId) {
            httpParams = httpParams.append('countryId', this.bookingFiltrationModel.countryId);
        }
        if(this.bookingFiltrationModel.cityId) {
            httpParams = httpParams.append('cityId', this.bookingFiltrationModel.cityId)
        }
        if(this.bookingFiltrationModel.getCurrent === true) {
            httpParams = httpParams.append('getCurrent', true);
        }
        if(this.bookingFiltrationModel.getCurrent === false) {
            httpParams = httpParams.append('getCurrent', false);
        }
        return httpParams;
    }

    getPaginationParams(httpParams: HttpParams, pageNumber: number): HttpParams {
        httpParams = httpParams.append('pageIndex', pageNumber - 1);
        httpParams = httpParams.append('pageSize', 2);

        return httpParams;
    }
}