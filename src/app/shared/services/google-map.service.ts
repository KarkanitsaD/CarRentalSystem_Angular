import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import axios from "axios"
@Injectable()
export class GoogleMapService {

    constructor
    (
        private httpClient: HttpClient
    ) {}

    public GetTimeOffset(locationX: number, locationY: number): Promise<any> {
        let url = `https://maps.googleapis.com/maps/api/timezone/json?location=${locationX}%2C${locationY}&timestamp=1331766000&key=AIzaSyA6vPzSmS6Ts_zd38aQwKJq4Iu8E9wqNgs`;
        return axios.get(url);
    }
}