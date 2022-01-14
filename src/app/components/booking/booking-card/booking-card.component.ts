import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddBookingFeedbackModel } from "src/app/shared/models/booking-feedback/add-booking-feedback.model";
import { BookingFeedbackModel } from "src/app/shared/models/booking-feedback/booking-feedback.model";
import { BookingItem } from "src/app/shared/models/booking/booking-item.model";
import { BookingFeedbackService } from "src/app/shared/services/bookingFeedback.service";
import { LoginService } from "src/app/shared/services/login.service";

@Component({
    selector: 'app-booking-card',
    templateUrl: 'booking-card.component.html',
    styleUrls: ['booking-card.component.css']
})
export class BookingCardComponent implements OnInit {



    @Input() booking!: BookingItem;
    feedBack!: BookingFeedbackModel;

    form!: FormGroup;
    formReadOnly: boolean = false;

    constructor
    (
        private formBuilder: FormBuilder,
        private bookingFeedbackService: BookingFeedbackService,
        private loginService: LoginService
    ) {}
    
    getTime(date: Date): number {
        return new Date(date).getTime();
    }

    ngOnInit(): void {
        if(new Date(this.booking.keyHandOverTime).getTime() < new Date().getTime()) {
            this.form = this.formBuilder.group({
                feedback: [, Validators.required]
            });
        }
    }

    addFeedback(): void {
        debugger
        let feedback: AddBookingFeedbackModel = {
            carId: this.booking.carId,
            bookingId: this.booking.id,
            userId: this.loginService.getUser().id,
            comment: this.form.controls.feedback.value.comment,
            rating: this.form.controls.feedback.value.rating
        };
        this.bookingFeedbackService.createBookingFeedback(feedback).subscribe(() => console.log(1));
    }
}