import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as candidateActions from './candidate.actions'
import {catchError, exhaustMap, map} from "rxjs/operators";
import {CandidateService} from "../services/api-service.service";
import {of} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class CandidateEffects {

  constructor(private actions$: Actions,
              public apiService: CandidateService) {
  }

  getCandidates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(candidateActions.getCandidates),
      exhaustMap(action =>
        this.apiService.getAllCandidates({search: action.search,page: action.page, limit: action.limit, sortColumn: action.sortColumn, sortType: action.sortType}).then(response => {
          return candidateActions.getCandidatesSuccess(response)
          }).catch((error: any) => of(candidateActions.getCandidatesFailure(error)))
      )
    )
  );

  createCandidate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(candidateActions.addCandidate),
      exhaustMap(action =>
        this.apiService.saveCandidate(action.candidate).pipe(
          map(response => candidateActions.addCandidateSuccess(response)),
          catchError((error: any) => of(candidateActions.addCandidateFailure(error))))
      )
    )
  );

  editCandidate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(candidateActions.updateCandidate),
      exhaustMap(action =>
        this.apiService.updateCandidate(action.candidate).pipe(
          map(response => candidateActions.updateCandidateSuccess(response)),
          catchError((error: any) => of(candidateActions.updateCandidateFailure(error))))
      )
    )
  );

  deleteCandidate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(candidateActions.deleteCandidate),
      exhaustMap(action => this.apiService.deleteCandidate(action).pipe(
        map(response => candidateActions.deleteCandidateSuccess(response)),
        catchError((error: any) => of(candidateActions.deleteCandidateFailure(error))))
      )
    )
  );

}
