import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AddBookingFeedbackModel } from "src/app/shared/models/booking-feedback/add-booking-feedback.model";
import { UpdateBookingFeedbackModel } from "src/app/shared/models/booking-feedback/update-booking-feedback.model";
import { BookingItem } from "src/app/shared/models/booking/booking-item.model";
import { BookingFeedbackService } from "src/app/shared/services/bookingFeedback.service";




@Component({
    selector: 'app-booking-card',
    templateUrl: 'booking-card.component.html',
    styleUrls: ['booking-card.component.css']
})
export class BookingCardComponent implements OnInit {

    public addFeedbackMode: boolean = true;
    public isPastBooking: boolean = false;
    @Output() onDelete = new EventEmitter<string>();
    @Input() booking!: BookingItem;
    public updateBookingFeedbackModel!: UpdateBookingFeedbackModel | null;


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
                .subscribe(
                    data => {
                        this.comment = data.comment;
                        this.addFeedbackMode = false;
                        this.updateBookingFeedbackModel = {
                            bookingFeedbackId: data.id,
                            comment: data.comment,
                            rating: data.rating   
                        }
                    });
        }
    }

    public deleteBooking(): void {
        this.onDelete.emit(this.booking.id);
    }

    public onUpdateOrDeleteFeedback(feedback: UpdateBookingFeedbackModel | null): void {
        if(feedback) {
            this.updateBookingFeedbackModel = {
                bookingFeedbackId: feedback.bookingFeedbackId,
                comment: feedback.comment,
                rating: feedback.rating
            }
        } else {
            this.updateBookingFeedbackModel = null;
        }
    }

    public onAddFeedback(feedback: AddBookingFeedbackModel): void {
        this.bookingFeedbackService.getBookingFeedbackByBookingId(this.booking.id)
        .subscribe(data => {
            this.updateBookingFeedbackModel = {
                bookingFeedbackId: data.id,
                comment: data.comment,
                rating: data.rating
            }
        })
    }
}