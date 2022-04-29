import {createAction, props} from "@ngrx/store";
import {ActionType} from "../shared/model/action.modal";

export const GET_CANDIDATES = '[Candidate] Get Candidate';
export const GET_CANDIDATES_SUCCESS = '[Candidate] Get Candidate Success';
export const GET_CANDIDATES_FAILURE = '[Candidate] Get Candidate Failure';

export const ADD_CANDIDATE = '[Candidate] Add Candidate';
export const ADD_CANDIDATE_SUCCESS = '[Candidate] Add Candidate Success';
export const ADD_CANDIDATE_FAILURE = '[Candidate] Add Candidate Failure';

export const UPDATE_CANDIDATE = '[Candidate] Update Candidate';
export const UPDATE_CANDIDATE_SUCCESS = '[Candidate] Update Candidate Success';
export const UPDATE_CANDIDATE_FAILURE = '[Candidate] Update Candidate Failure';

export const DELETE_CANDIDATE = '[Candidate] Delete Candidate';
export const DELETE_CANDIDATE_SUCCESS = '[Candidate] Delete Candidate Success';
export const DELETE_CANDIDATE_FAILURE = '[Candidate] Delete Candidate Failure';

export const getCandidates = createAction(
  GET_CANDIDATES,
  props<ActionType>()
);

export const getCandidatesSuccess = createAction(
  GET_CANDIDATES_SUCCESS,
  props<any>()
);

export const getCandidatesFailure = createAction(
  GET_CANDIDATES_FAILURE,
  props<any>()
);

export const addCandidate = createAction(
  ADD_CANDIDATE,
  props<{candidate: any}>()
);

export const addCandidateSuccess = createAction(
  ADD_CANDIDATE_SUCCESS,
  props<any>()
);

export const addCandidateFailure = createAction(
  ADD_CANDIDATE_FAILURE,
  props<any>()
);

export const updateCandidate = createAction(
  UPDATE_CANDIDATE,
  props<{candidate: any}>()
);

export const updateCandidateSuccess = createAction(
  UPDATE_CANDIDATE_SUCCESS,
  props<any>()
);

export const updateCandidateFailure = createAction(
  UPDATE_CANDIDATE_FAILURE,
  props<any>()
);

export const deleteCandidate = createAction(
  DELETE_CANDIDATE,
  props<{ids: string[]}>()
);

export const deleteCandidateSuccess = createAction(
  DELETE_CANDIDATE_SUCCESS,
  props<any>()
);

export const deleteCandidateFailure = createAction(
  DELETE_CANDIDATE_FAILURE,
  props<any>()
);
