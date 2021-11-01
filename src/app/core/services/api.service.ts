import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable()
export class ApiService {

    constructor(
        private http: HttpClient
    ) {}

    get(path: string, params: HttpParams ){

    }

    post(path: string, body: Object){

    }

    put(path: string, body: Object){

    }

    delete(path: string){
        
    }
}