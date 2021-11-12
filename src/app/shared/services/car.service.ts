import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AddCarModel } from "src/app/components/car/add-car/types/add-car.model";
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
        return this.apiService.get<Car[]>(`${this.base_url}${CARS_URL}`);
    }

    createCar(addCarModel: AddCarModel): Observable<any> {
        return this.apiService.post<any>(`${this.base_url}${CARS_URL}`, addCarModel);
    }
}