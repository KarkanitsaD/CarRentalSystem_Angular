import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { COUNTRIES_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { Country } from "../models/country.model";
import { ApiService } from "./api.service";

@Injectable()
export class CountryService {
    constructor
    (
        private apiService: ApiService
    ) {}


    getCountries(): Observable<Country[]> {
        return this.apiService.get<Country[]>(`${environment.api_url}${COUNTRIES_URL}`);
    }
}