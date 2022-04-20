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
        this.apiService.getAllCandidates().pipe(
          map(response => {
            return candidateActions.getCandidatesSuccess({response})
          }),
          catchError((error: any) => of(candidateActions.getCandidatesFailure(error))))
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(candidateActions.addCandidate),
      exhaustMap(action =>
        this.apiService.saveCandidate(action.candidate).pipe(
          map(response => candidateActions.addCandidateSuccess(response)),
          catchError((error: any) => of(candidateActions.addCandidateFailure(error))))
      )
    )
  );

  editTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(candidateActions.updateCandidate),
      exhaustMap(action =>
        this.apiService.updateCandidate(action.candidate, action.id).pipe(
          map(response => candidateActions.updateCandidateSuccess(response)),
          catchError((error: any) => of(candidateActions.updateCandidateFailure(error))))
      )
    )
  );

}
