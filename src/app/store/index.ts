import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import { auth, authReducer, AuthState } from "./auth";
import { loactionsReducer, locations, LocationsState } from "./locations";
import { timeRange, timeRangeReducer, TimeRangeState } from "./time-range";


export interface State {
    [timeRange]: TimeRangeState,
    [locations]: LocationsState,
    [auth]: AuthState
}

export const reducers: ActionReducerMap<State> = {
    [timeRange]: timeRangeReducer,
    [locations]: loactionsReducer,
    [auth]: authReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];