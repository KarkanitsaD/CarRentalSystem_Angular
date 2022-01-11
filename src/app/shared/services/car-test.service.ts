import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CARS_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { AddCarModel } from "../models/car/add-car.model";
import { UpdateCarModel } from "../models/car/update-car.model";

import { ApiService } from "./api.service";

@Injectable()
export class CarTestService {
    constructor
    (
        private apiService: ApiService,
    ) {}

    base_url: string = environment.api_url;

    createCar(addCarModel: AddCarModel): Observable<any> {
        return this.apiService.post<any>(`${this.base_url}${CARS_URL}`, addCarModel);
    }

    updateCar(addCarModel: UpdateCarModel): Observable<any> {
        return this.apiService.put<any>(`${this.base_url}${CARS_URL}/${addCarModel.id}`, addCarModel);
    }
}