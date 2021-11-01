import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable()
export class UserService {

    constructor(
        private http: HttpClient
    ) {}

    getUsers() {
        return this.http.get('${enviroment.api_url}');
    }
}