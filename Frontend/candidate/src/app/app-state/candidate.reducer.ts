import {UserModel} from "../shared/model/candidateDetail.model";
import * as storage from './storage';
import * as _ from 'lodash'
import * as candidateActions from './candidate.actions'
import {Action, createReducer, on} from "@ngrx/store";

export interface State {
  candidates: UserModel[];
  currentCandidate?: UserModel;
  total?: number;
  deleteCandidateId: string[];
  error?: any,
  status : string,
  loading: boolean
}

export const initialState: State = {
  candidates: storage.getItem('candidates').candidates,
  currentCandidate: {} as UserModel,
  total: 0,
  deleteCandidateId: [],
  error : '',
  status : '',
  loading: false
};


const candidateReducer = createReducer(
  initialState,

  on(candidateActions.getCandidates, (state) => ({...state, loading: true})),
  on(candidateActions.getCandidatesSuccess, (state, result) =>{
    if (result.errors && result.errors[0].message == "Candidates were not found."){
      return  {...state , candidates: [], total:0};
    }
    return  {...state, candidates: result.data.user.items, total: result.data.user.total, loading: false}
  }),
  on(candidateActions.getCandidatesFailure, (state, result) =>{
    if (result['error']['text'] == "Candidates were not found."){
      return  {...state, candidates: [], total: 0};
    } else {
      return {...state};
    }
  }),

  on(candidateActions.addCandidate, (state, {candidate}) => ({...state, currentCandidate: candidate, loading: true})),
  on(candidateActions.addCandidateSuccess, (state, result: {data:{ createUser: UserModel}}) => {
    const candidates = undefined !== state.candidates ? _.cloneDeep(state.candidates) : [];
    candidates.push(result.data.createUser);
    return {
      ...state,
      candidates: candidates,
      status:"success",
      error : '',
      total: state.total ? state.total + 1 : 1,
      loading: false
    };
  }),
  on(candidateActions.addCandidateFailure, (state,result) => {
    if(result.graphQLErrors) {
      return  {...state , error : result.graphQLErrors[0].extensions.response, status : '', loading: false};
    }else {
      return {...state};
    }

  }),

  on(candidateActions.updateCandidate, (state, {candidate}) => ({...state, currentCandidate: candidate, loading: true})),
  on(candidateActions.updateCandidateSuccess, (state, result) => {
    let candidates: UserModel[] = undefined !== state.candidates ? _.cloneDeep(state.candidates) : [];
    candidates = candidates.map(can => {
      if (can._id === result.data.updateUser._id) {
        can = result.data.updateUser;
      }
      return can;
    });
    return {
      ...state,
      candidates: candidates,
      status : "success",
      error : '',
      total: state.total,
      loading: false
    };
  }),
  on(candidateActions.updateCandidateFailure, (state,result) => {
    if(result.graphQLErrors) {
      return  {...state , error : result.graphQLErrors[0].extensions.response, status : '', loading: false};
    }else {
      return {...state};
    }

  }),

  on(candidateActions.deleteCandidate, (state, {ids}) => ({...state, deleteCandidateId: ids, loading: true})),
  on(candidateActions.deleteCandidateSuccess, (state, result) => {
    let candidates = undefined !== state.candidates ? _.cloneDeep(state.candidates) : [];
    if (result.data.deleteUser.message == 'Data successfully deleted') {
      candidates = candidates.filter(candidate => !state.deleteCandidateId.includes(candidate._id ? candidate._id : ''));
    }
    return {
      ...state,
      candidates,
      total: state.total ? state.total - state.deleteCandidateId.length : 0,
      loading: false
    };
  }),

);

export function reducer(state: State | undefined, action: Action): any {
  return candidateReducer(state, action);
}

export const getCandidates = (state: State) => {
  return {
    candidates: state.candidates,
    total: state.total,
    error : state.error,
    status:state.status,
    loading: state.loading
  };
};
