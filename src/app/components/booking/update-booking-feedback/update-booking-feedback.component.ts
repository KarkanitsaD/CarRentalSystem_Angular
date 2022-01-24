import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UpdateBookingFeedbackModel } from "src/app/shared/models/booking-feedback/update-booking-feedback.model";
import { BookingFeedbackService } from "src/app/shared/services/bookingFeedback.service";

@Component({
    selector: 'app-update-booking-feedback',
    templateUrl: 'update-booking-feedback.component.html',
    styleUrls: ['update-booking-feedback.component.css']
}) export class UpdateBookingFeedbackComponent implements OnInit{

    @Output() onUpdateOrDeleteFeedback = new EventEmitter<UpdateBookingFeedbackModel | null>();
    @Input() bookingFeedback!: UpdateBookingFeedbackModel;
    form!: FormGroup;

    constructor
    (
        private formBuilder: FormBuilder,
        private feedbackBookingService: BookingFeedbackService
    ) {}

    get commentControl(): AbstractControl {
        return this.form.controls.comment;
    }

    get ratingControl(): AbstractControl {
        return this.form.controls.rating;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            rating: [this.bookingFeedback.rating, [Validators.required, Validators.min(1)]],
            comment: [this.bookingFeedback.comment, [Validators.required]]
        });
    }

    public deleteFeedback() {
        this.feedbackBookingService.deleteBookingFeedback(this.bookingFeedback.bookingFeedbackId)
        .subscribe(() => {
            this.onUpdateOrDeleteFeedback.emit(null);
        });
    }

    public updateFeedback() {
        let bookingFeedback: UpdateBookingFeedbackModel = {
            bookingFeedbackId: this.bookingFeedback.bookingFeedbackId,
            rating: this.form.controls.rating.value,
            comment: this.form.controls.comment.value
        }

        this.feedbackBookingService.updateBookingFeedback(bookingFeedback)
        .subscribe(() => {
            this.onUpdateOrDeleteFeedback.emit(bookingFeedback);
        });
    }

}