import { Injectable } from "@angular/core";
import * as signalR from '@aspnet/signalr';
import { City } from "../models/city.model";
import { Country } from "../models/country.model";
import { State } from "src/app/store";
import { Store } from "@ngrx/store";
import { addCity, addCountry } from "src/app/store/locations";

@Injectable()
export class SignalRService {

    constructor
    (
        private store: Store<State>
    ) {}


    private hubConnection!: signalR.HubConnection;

    public startConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:44331/location')
        .build();

        this.hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(() => console.log('Error while starting connection!'));
    }

    public addAddingCityListener() {
        this.hubConnection.on("addCity", (data: City) => {
            this.store.dispatch(addCity({city: data}));
        });
    }

    public addAddingCountryListener() {
        this.hubConnection.on('addCountry', (data: Country) => {
            this.store.dispatch(addCountry({country: data}));
        });
    }

}