import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddBookingFeedbackModel } from "src/app/shared/models/booking-feedback/add-booking-feedback.model";
import { BookingItem } from "src/app/shared/models/booking/booking-item.model";
import { BookingFeedbackService } from "src/app/shared/services/bookingFeedback.service";
import { LoginService } from "src/app/shared/services/login.service";

@Component({
    selector: 'app-add-booking-feedback',
    templateUrl:'add-booking-feedback.component.html',
    styleUrls: ['add-booking-feedback.component.css']
}) export class AddBookingFeedbackComponent {

    @Output() onBookingFeedbackAdd = new EventEmitter<AddBookingFeedbackModel>();
    @Input() booking!: BookingItem;
    form: FormGroup = this.formBuilder.group({
        rating: [0,[Validators.required, Validators.min(1)]],
        comment: ['', [Validators.required, Validators.minLength(20)]]
    });

    constructor
    (
        private bookingFeedbackService: BookingFeedbackService,
        private formBuilder: FormBuilder,
        private loginService: LoginService
    ) {}

    get commentControl(): AbstractControl {
        return this.form.controls.comment;
    }

    get ratingControl(): AbstractControl {
        return this.form.controls.rating;
    }

    public addBookingFeedback() {
        let bookingFeedback: AddBookingFeedbackModel = {
            comment: this.form.controls.comment.value,
            rating: this.form.controls.rating.value,
            carId: this.booking.carId,
            bookingId: this.booking.id,
            userId: this.loginService.getUser().id
        };
        this.bookingFeedbackService.createBookingFeedback(bookingFeedback)
        .subscribe(() => {
            this.onBookingFeedbackAdd.emit(bookingFeedback);
        });
    }
}