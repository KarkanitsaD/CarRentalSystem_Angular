import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, concatMap, map } from "rxjs/operators";
import { City } from "../shared/models/city.model";
import { Country } from "../shared/models/country.model";
import { CityService } from "../shared/services/city.service";
import { CountryService } from "../shared/services/country.service";

//feature name
export const locations = 'locations';

//state
export interface LocationsState {
    countries: Country[],
    countriesLoades: boolean,
    cities: City[],
    citiesLoaded: boolean
}

const initialLocationState: LocationsState = {
    countries: [],
    countriesLoades: false,
    cities: [],
    citiesLoaded: false
}

//actions
export const loadAllCities = createAction(
    '[LOCATIONS] Load All Cities'
)

export const loadAllCitiesSuccess = createAction(
    '[LOCATIONS] Load All Cities Success',
    props<{cities: City[]}>()
)

export const loadAllCitiesError = createAction(
    '[LOCATIONS] Load All Cities Error'
)

export const loadAllCountries = createAction(
    '[LOCATIONS] Load All Countries',
)

export const loadAllCountriesSucces = createAction(
    '[LOCATIONS] Load All Countries Success',
    props<{countries: Country[]}>()
)

export const loadAllCountriesError = createAction(
    '[LOCATIONS] Load All Countries Error'
)

//reducer
export const loactionsReducer = createReducer(
    initialLocationState,
    on(loadAllCountriesSucces, (state, action) => ({
        ...state,
        countries: action.countries,
        countriesLoades: true
    })),
    on(loadAllCitiesSuccess, (state, action) => ({
        ...state,
        cities: action.cities,
        citiesLoaded: true
    }))
)

//selectors
export const featureSelector = createFeatureSelector<LocationsState>(locations);

export const countriesSelector = createSelector(
    featureSelector,
    state => state.countries
)

export const citiesSelector = createSelector(
    featureSelector,
    state => state.cities
)

export const areCountriesLoaded = createSelector(
    featureSelector,
    state => state.countriesLoades
)

export const areCitiesLoaded = createSelector(
    featureSelector,
    state => state.citiesLoaded
)

@Injectable()
export class LocationsEffects {

    constructor
    (
        private actions$: Actions,
        private countryService: CountryService,
        private cityService: CityService
    ) {}

    loadAllCities$ = createEffect(
        () => this.actions$.pipe(
            ofType(loadAllCities),
            concatMap(() => this.cityService.getCities()),
            map(cities => loadAllCitiesSuccess({cities: cities})),
            catchError(() => of(loadAllCitiesError()))
        )
    );

    loadAllCountries$ = createEffect(
        () => this.actions$.pipe(
            ofType(loadAllCountries),
            concatMap(() => this.countryService.getCountries()),
            map(countries => loadAllCountriesSucces({countries: countries})),
            catchError(() => of(loadAllCountriesError()))
        )
    )
}