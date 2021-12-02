import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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
}