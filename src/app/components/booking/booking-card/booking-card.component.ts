import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BookingItem } from "src/app/shared/models/booking/booking-item.model";
import { BookingFeedbackService } from "src/app/shared/services/bookingFeedback.service";




@Component({
    selector: 'app-booking-card',
    templateUrl: 'booking-card.component.html',
    styleUrls: ['booking-card.component.css']
})
export class BookingCardComponent implements OnInit {

    public isPastBooking: boolean = false;
    @Output() onDelete = new EventEmitter<string>();
    @Input() booking!: BookingItem;

    comment: string = '';

    constructor
        (
            private bookingFeedbackService: BookingFeedbackService,
    ) { }

    getTime(date: Date): number {
        return new Date(date).getTime();
    }

    ngOnInit(): void {
        if (new Date(this.booking.keyHandOverTime).getTime() < new Date().getTime()) {
            this.isPastBooking = true;
            this.bookingFeedbackService.getBookingFeedbackByBookingId(this.booking.id)
                .subscribe(data => this.comment = data.comment);
        }
    }

    public deleteBooking(): void {
        this.onDelete.emit(this.booking.id);
    }

}