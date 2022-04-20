import * as fromCandidate from './candidate.reducer';
import {ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from "@ngrx/store";
import {localStorageSync} from "ngrx-store-localstorage";
import {environment} from "../../environments/environment";

export interface State {
  candidates: fromCandidate.State;
}

export const reducers: ActionReducerMap<State> = {
  candidates: fromCandidate.reducer,
};

const reducerKeys = ['candidates'];
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: reducerKeys})(reducer);
}

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    // console.log('state', state);
    // console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [debug, localStorageSyncReducer] : [localStorageSyncReducer];


export const getCandidateState = createFeatureSelector<fromCandidate.State>('candidates');

export const getCandidates = createSelector(
  getCandidateState,
  fromCandidate.getCandidates
);
