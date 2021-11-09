import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CARS_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { Car } from "../models/car.model";
import { ApiService } from "./api.service";

@Injectable()
export class CarService {
    constructor
    (
        private apiService: ApiService,
    ) {}

    base_url: string = environment.api_url;

    getCars(): Observable<Car[]> {
        return this.apiService.get(`${this.base_url}${CARS_URL}`);
    }
}