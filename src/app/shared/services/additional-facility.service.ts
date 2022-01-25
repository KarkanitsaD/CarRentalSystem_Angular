import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
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
        return of({title: 'title007', id:(Math.random() + 1).toString(36).substring(7), rentalPointId: 'rpid007', price: 777})
        return this.apiService.post<AdditionalFacility>(`${environment.api_url}additionalFacilities`, facility);
    }

    public deleteAdditionalFacility(id: string): Observable<unknown> {
        return of(null);
        return this.apiService.delete<unknown>(`${environment.api_url}additionalFacilities/${id}`);
    }

    public updateAdditionalFacility(facility: UpdateAdditionalFacilityModel): Observable<unknown> {
        return of(null);
        return this.apiService.put<unknown>(`${environment.api_url}additionalFacilities/${facility.id}`, facility);
    }

    public getAdditionalFacilityByRentalPointId(rentalPointId: string): Observable<AdditionalFacility[]> {
        var array = new Array<AdditionalFacility>();
        array.push({title:'title1', id: 'id1', rentalPointId: 'rentalPointId1', price: 1});
        array.push({title:'title2', id: 'id2', rentalPointId: 'rentalPointId2', price: 2});
        return of(array);
        //return this.apiService.get<AdditionalFacility[]>(`${environment.api_url}`);
    }
}