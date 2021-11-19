import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RentalPointAddCarModel } from "src/app/components/car/add-car/types/rentalPoint-add-car.model";
import { RENTALPOINT_TITLES_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { ApiService } from "./api.service";

@Injectable()
export class RentalPointService {
    constructor
    (
        private apiService: ApiService
    ) {}

    getRentalPointAddCarModels(): Observable<RentalPointAddCarModel[]> {
        return this.apiService.get<RentalPointAddCarModel[]>(`${environment.api_url}${RENTALPOINT_TITLES_URL}`);
    }
}