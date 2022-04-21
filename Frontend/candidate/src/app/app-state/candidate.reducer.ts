import {UserModel} from "../shared/model/candidateDetail.model";
import * as storage from './storage';
import * as _ from 'lodash'
import * as candidateActions from './candidate.actions'
import {Action, createReducer, on} from "@ngrx/store";

export interface State {
  candidates: UserModel[];
  currentCandidate?: UserModel;
  total?: number;
  deleteCandidateId?: string;
}

export const initialState: State = {
  candidates: storage.getItem('candidates').candidates,
  currentCandidate: {} as UserModel,
  total: 0
};


const candidateReducer = createReducer(
  initialState,

  on(candidateActions.getCandidates, (state) => ({...state})),
  on(candidateActions.getCandidatesSuccess, (state, result) => ({candidates: result.response.items, total: result.response.total})),

  on(candidateActions.addCandidate, (state, {candidate}) => ({...state, currentCandidate: candidate})),
  on(candidateActions.addCandidateSuccess, (state, result: UserModel) => {
    const candidates = undefined !== state.candidates ? _.cloneDeep(state.candidates) : [];
    candidates.push(result);
    return {
      candidates: candidates,
      total: state.total ? state.total + 1 : 1
    };
  }),

  on(candidateActions.updateCandidate, (state, {candidate}) => ({...state, currentCandidate: candidate})),
  on(candidateActions.updateCandidateSuccess, (state, result) => {
    let candidates: UserModel[] = undefined !== state.candidates ? _.cloneDeep(state.candidates) : [];
    candidates = candidates.map(can => {
      if (can._id === result._id) {
        can = result;
      }
      return can;
    });
    return {
      candidates: candidates,
      total: state.total
    };
  }),

  on(candidateActions.deleteCandidate, (state, {candidateId}) => ({...state, deleteCandidateId: candidateId})),
  on(candidateActions.deleteCandidateSuccess, (state, result) => {
    let candidates = undefined !== state.candidates ? _.cloneDeep(state.candidates) : [];
    if (result.message == 'Data successfully deleted') {
      candidates = candidates.filter(candidate => candidate._id !== state.deleteCandidateId);
    }
    return {
      candidates,
      total: state.total ? state.total -1 : 0
    };
  }),

);

export function reducer(state: State | undefined, action: Action): any {
  return candidateReducer(state, action);
}

export const getCandidates = (state: State) => {
  return {
    candidates: state.candidates,
    total: state.total
  };
};
