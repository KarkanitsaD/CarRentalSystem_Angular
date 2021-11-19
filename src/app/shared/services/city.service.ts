import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CITIES_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { City } from "../models/city.model";
import { ApiService } from "./api.service";

@Injectable()
export class CityService {
    constructor
    (
        private apiService: ApiService
    ) {}

    getCities(): Observable<City[]> {
        return this.apiService.get<City[]>(`${environment.api_url}${CITIES_URL}`);
    }
}