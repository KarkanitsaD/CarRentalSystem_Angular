import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CAR_PICTURES_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { Image } from "../models/image.model";
import { ApiService } from "./api.service";

@Injectable()
export class CarImageService {
    constructor
    (
        private apiService: ApiService
    ) {}

    getImage(carId: string): Observable<Image> {
        return this.apiService.get<Image>(`${environment.api_url}${CAR_PICTURES_URL}/${carId}`);
    }
}