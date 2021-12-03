import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiService } from "./api.service";

@Injectable()
export class TestService {
    constructor
    (
       private apiService: ApiService
    ){}

    testPost(date: Date): Observable<Date> {
        return this.apiService.post<Date>(`${environment.api_url}test`, date);
    }
}