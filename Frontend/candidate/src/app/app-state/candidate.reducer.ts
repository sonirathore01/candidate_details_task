import {UserModel} from "../shared/model/candidateDetail.model";
import * as storage from './storage';
import * as _ from 'lodash'
import * as candidateActions from './candidate.actions'
import {Action, createReducer, on} from "@ngrx/store";

export interface State {
  candidates: UserModel[];
  currentCandidate?: UserModel;
}

export const initialState: State = {
  candidates: storage.getItem('candidates').candidates,
  currentCandidate: {} as UserModel
};


const candidateReducer = createReducer(
  initialState,

  on(candidateActions.getCandidates, (state) => ({...state})),
  on(candidateActions.getCandidatesSuccess, (state, result) => ({candidates: result.response.items})),

  on(candidateActions.addCandidate, (state, {candidate}) => ({...state, currentTask: candidate})),
  on(candidateActions.addCandidateSuccess, (state, result: UserModel) => {
    const candidates = undefined !== state.candidates ? _.cloneDeep(state.candidates) : [];
    candidates.push(result);
    return {
      candidates
    };
  }),

  on(candidateActions.updateCandidate, (state, {candidate}) => ({...state, currentTask: candidate})),
  on(candidateActions.updateCandidateSuccess, (state, result) => {
    let candidates: UserModel[] = undefined !== state.candidates ? _.cloneDeep(state.candidates) : [];
    candidates = candidates.map(can => {
      if (can._id === result._id) {
        can = result;
      }
      return can;
    });
    return {
      candidates
    };
  })

);

export function reducer(state: State | undefined, action: Action): any {
  return candidateReducer(state, action);
}

export const getCandidates = (state: State) => {
  return {
    candidates: state.candidates
  };
};
