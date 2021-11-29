import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AddBookigModel } from "../models/booking/add-booking.model";
import { ApiService } from "./api.service";

@Injectable()
export class BookingService {
    constructor
    (
        private apiService: ApiService
    ) {}

    public createBook(booking: AddBookigModel): Observable<any> {
        return this.apiService.post<any>(`${environment.api_url}bookings`, booking);
    }

}