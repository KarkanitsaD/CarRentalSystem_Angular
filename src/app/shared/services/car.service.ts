import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AddCarModel } from "src/app/components/car/add-car/types/add-car.model";
import { CARS_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { Car } from "../models/car.model";
import { PageCarList } from "../models/page-car-list.model";
import { ApiService } from "./api.service";

@Injectable()
export class CarService {
    constructor
    (
        private apiService: ApiService,
    ) {}

    base_url: string = environment.api_url;

    getCar(carId: string): Observable<Car> {
        return this.apiService.get<Car>(`${this.base_url}${CARS_URL}/${carId}`);
    }

    getCars(httpParams?: HttpParams): Observable<Car[]> {
        return this.apiService.get<Car[]>(`${this.base_url}${CARS_URL}`, httpParams);
    }

    getPageCarList(httpParams?: HttpParams): Observable<PageCarList> {
        return this.apiService.get<PageCarList>(`${this.base_url}${CARS_URL}`, httpParams);
    }

    createCar(addCarModel: AddCarModel): Observable<any> {
        return this.apiService.post<any>(`${this.base_url}${CARS_URL}`, addCarModel);
    }

    deleteCar(id: string) {
        return this.apiService.delete(`${this.base_url}${CARS_URL}/${id}`);
    }

    updateCar(addCarModel: AddCarModel): Observable<any> {
        return this.apiService.put<any>(`${this.base_url}${CARS_URL}/${addCarModel.id}`, addCarModel);
    }
}