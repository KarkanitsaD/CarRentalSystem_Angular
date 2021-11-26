import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RENTALPOINTS_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { RentalPoint } from "../models/rental-point.model";
import { ApiService } from "./api.service";

@Injectable()
export class RentalPointService {
    constructor
    (
        private apiService: ApiService
    ) {}

    getRentalPoint(id: string): Observable<RentalPoint> {
        return this.apiService.get(`${environment.api_url}${RENTALPOINTS_URL}/${id}`);
    }

    getRentalPoints(): Observable<RentalPoint[]> {
        return this.apiService.get<RentalPoint[]>(`${environment.api_url}${RENTALPOINTS_URL}`);
    }

    createRentalPoint(model: RentalPoint): Observable<any> {
        return this.apiService.post<any>(`${environment.api_url}${RENTALPOINTS_URL}`, model);
    }

    updateRentalPoint(model: RentalPoint): Observable<any> {
        return this.apiService.put<any>(`${environment.api_url}${RENTALPOINTS_URL}/${model.id}`, model);
    }

    deleteRentalPoint(id: string) : Observable<any> {
        return this.apiService.delete<any>(`${environment.api_url}${RENTALPOINTS_URL}/${id}`);
    }
}