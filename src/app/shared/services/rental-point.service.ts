import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RENTALPOINTS_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { AddUpdateRentalPointModel } from "../models/add-update-rental-point.model";
import { RentalPoint } from "../models/rental-point.model";
import { ApiService } from "./api.service";

@Injectable()
export class RentalPointService {
    constructor
    (
        private apiService: ApiService
    ) {}

    getRentalPoints(): Observable<RentalPoint[]> {
        return this.apiService.get<RentalPoint[]>(`${environment.api_url}${RENTALPOINTS_URL}`);
    }

    createRentalPoint(model: AddUpdateRentalPointModel): Observable<any> {
        return this.apiService.post<any>(`${environment.api_url}${RENTALPOINTS_URL}`);
    }
}