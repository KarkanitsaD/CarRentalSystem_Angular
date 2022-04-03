import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AddAdditionalFacilityModel } from "../models/additional-facility/add-additional-facility.model";
import { AdditionalFacility } from "../models/additional-facility/additional-facility.model";
import { UpdateAdditionalFacilityModel } from "../models/additional-facility/update-additional-facility.model";
import { ApiService } from "./api.service";

@Injectable()
export class AdditionalFacilityService {
    constructor
    (
        private apiService: ApiService
    ) {}

    public createAdditionalFacility(facility: AddAdditionalFacilityModel): Observable<AdditionalFacility> {
        return this.apiService.post<AdditionalFacility>(`${environment.api_url}additionalFacilities`, facility);
    }

    public deleteAdditionalFacility(id: string): Observable<unknown> {
        return this.apiService.delete<unknown>(`${environment.api_url}additionalFacilities/${id}`);
    }

    public updateAdditionalFacility(facility: UpdateAdditionalFacilityModel): Observable<unknown> {
        return this.apiService.put<unknown>(`${environment.api_url}additionalFacilities/${facility.id}`, facility);
    }

    public getAdditionalFacilityByRentalPointId(rentalPointId: string): Observable<AdditionalFacility[]> {
        return this.apiService.get<AdditionalFacility[]>(`${environment.api_url}rentalPoints/${rentalPointId}/additionalFacilities`);
    }
}