import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RENTALPOINTS_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { PageRentalPointList } from "../models/rental-point/page-rental-point-list.model";
import { RentalPoint } from "../models/rental-point/rental-point.model";
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

    getPageRentalPointsList(httpParams?: HttpParams): Observable<PageRentalPointList> {
        return this.apiService.get<PageRentalPointList>(`${environment.api_url}${RENTALPOINTS_URL}`, httpParams);
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