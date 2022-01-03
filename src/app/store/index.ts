import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import { timeRange, timeRangeReducer, TimeRangeState } from "./time-range";


export interface State {
    [timeRange]: TimeRangeState
}

export const reducers: ActionReducerMap<State> = {
    [timeRange]: timeRangeReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];