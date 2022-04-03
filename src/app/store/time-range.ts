import { createAction, createReducer, props, on, createFeatureSelector, createSelector } from "@ngrx/store"

//FEATURE NAME
export const timeRange = "timeRange";

//STATE
export interface TimeRangeState {
    keyReceivingTime: number;
    keyHandOverTime: number;
}

export const initialTimeRangeState: TimeRangeState = {
    keyReceivingTime: getDefaultKeyRecevingTime(),
    keyHandOverTime: getDefaultKeyHandOverTime(),
}

//ACTIONS
export const changeTimeRange = createAction(
    '[TIMERANGE] change key receving-time and key handover time', 
    props<{keyReceivingTime: number, keyHandOverTime: number}>());
export const resetTimeRange = createAction('[TIMERANGE] reset key receiving time and key handover time')

//REDUCER
export const timeRangeReducer = createReducer(
    initialTimeRangeState,
    on(resetTimeRange, state => ({
        ...state,
        keyReceivingTime: getDefaultKeyRecevingTime(),
        keyHandOverTime: getDefaultKeyHandOverTime()
    })),
    on(changeTimeRange, (state, action) => ({
        ...state,
        keyReceivingTime: action.keyReceivingTime,
        keyHandOverTime: action.keyHandOverTime
    }))
);

//SELECTORS
export const featureSelector = createFeatureSelector<TimeRangeState>(timeRange);

export const timeRangeSelector = createSelector(
    featureSelector,
    state => [state.keyReceivingTime, state.keyHandOverTime]
);

function getDefaultKeyRecevingTime(): number {
    return Date.now() + 60*60*1000;
}

function getDefaultKeyHandOverTime(): number {
    return Date.now() + 25*60*60*1000;
}