import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import { loactionsReducer, locations, LocationsState } from "./locations";
import { timeRange, timeRangeReducer, TimeRangeState } from "./time-range";


export interface State {
    [timeRange]: TimeRangeState,
    [locations]: LocationsState
}

export const reducers: ActionReducerMap<State> = {
    [timeRange]: timeRangeReducer,
    [locations]: loactionsReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];