import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class ApiService{
    constructor
    (
        private httpClient: HttpClient
    ) {}

    get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
        return this.httpClient.get<T>(path, { params });
    }

    post(path: string, body: Object= {}): Observable<any> {
        return this.httpClient.post(path, JSON.stringify(body));
    }

    put(path: string, body: Object = {}): Observable<any> {
        return this.httpClient.put(path, JSON.stringify(body));
    }

    delete(path: string): Observable<any> {
        return this.httpClient.delete(path);
    }
}