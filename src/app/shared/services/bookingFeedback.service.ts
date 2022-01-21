import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AddBookingFeedbackModel } from "../models/booking-feedback/add-booking-feedback.model";
import { BookingFeedbackModel } from "../models/booking-feedback/booking-feedback.model";
import { ApiService } from "./api.service";

@Injectable()
export class BookingFeedbackService {

    constructor(private apiService: ApiService) {}

    public getBookingFeedbackByBookingId(bookingId: string): Observable<BookingFeedbackModel> {
        return this.apiService.get<BookingFeedbackModel>(`${environment.api_url}bookingFeedbacks/booking/${bookingId}`);
    }

    public getBookingFeedback(bookingId: string): Observable<BookingFeedbackModel> {
        return this.apiService.get<BookingFeedbackModel>(`${environment.api_url}bookingFeedbacks/${bookingId}`);
    }

    public getBookingFeedbacksByCarId(carId: string): Observable<BookingFeedbackModel[]> {
        return this.apiService.get<BookingFeedbackModel[]>(`${environment.api_url}bookingFeedbacks/car/${carId}`);
    }

    public createBookingFeedback(bookingFeedback: AddBookingFeedbackModel): Observable<any> {
        return this.apiService.post<any>(`${environment.api_url}bookingFeedbacks`, bookingFeedback);
    }

    public deleteBookingFeedback(id: string): Observable<any> {
        return this.apiService.delete<any>(`${environment.api_url}bookingFeedbacks/{id}`);
    }
}