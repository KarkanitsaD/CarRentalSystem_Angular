import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from "@ngrx/store";
import { User } from "../shared/models/user/user.model";


//feature name
export const auth = 'auth';

//state
export interface AuthState {
    loggedInUser: User | undefined
}

export const initalAuthState: AuthState = {
    loggedInUser: undefined
}

//actions
export const setCurrentUser = createAction(
    '[Auth] Set Current User',
    props<{user: User}>()
)

export const resetCurrentUser = createAction(
    '[Auth] Log Out User'
)

//reducers
export const authReducer = createReducer(
    initalAuthState,
    on(setCurrentUser, (state, action) => ({
        ...state,
        loggedInUser: action.user
    })),
    on(resetCurrentUser, state => ({
        ...state,
        loggedInUser: undefined
    })),
)

//selectors
export const featureSelector = createFeatureSelector<AuthState>(auth);

export const loggedInUserSelector = createSelector(
    featureSelector,
    state => state.loggedInUser
)