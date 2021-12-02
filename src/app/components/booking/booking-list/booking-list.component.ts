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

    public bookings!: BookingItem[];


    constructor
    (
        private bookingService: BookingService
    ) {}

    ngOnInit(): void {
        let params = new HttpParams();
        params = params.append('pageIndex', 0);
        params = params.append('pageSize', 10);
        this.bookingService.getPageBookingList(params).subscribe(data => this.bookings = data.bookings);
    }

    onFiltered(event : any) {
        let bookingFiltrationModel = event as BookingFiltrationModel;
        this.filter(bookingFiltrationModel);
    }

    filter(bookingFiltrationModel: BookingFiltrationModel) {
        let httpParams = new HttpParams();
        httpParams = this.getFiltrationParams(httpParams, bookingFiltrationModel);
        httpParams = httpParams.append('pageIndex', 0);
        httpParams = httpParams.append('pageSize', 10);
        this.bookingService.getPageBookingList(httpParams).subscribe(data => {
            this.bookings = data.bookings
        });
    }

    getFiltrationParams(httpParams: HttpParams, bookingFiltrationModel: BookingFiltrationModel): HttpParams {
        if(bookingFiltrationModel.countryId) {
            httpParams = httpParams.append('countryId', bookingFiltrationModel.countryId);
        }
        if(bookingFiltrationModel.cityId) {
            httpParams = httpParams.append('cityId', bookingFiltrationModel.cityId)
        }
        if(bookingFiltrationModel.getCurrent === true) {
            httpParams = httpParams.append('getCurrent', true);
        }
        if(bookingFiltrationModel.getCurrent === false) {
            httpParams = httpParams.append('getCurrent', false);
        }
        return httpParams;
    }
}