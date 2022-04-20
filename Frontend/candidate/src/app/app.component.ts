import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CandidateDetailComponent} from "./candidate-detail/candidate-detail.component";
import {CandidateService} from "./services/api-service.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {UserModel} from "./shared/model/candidateDetail.model";
import {Store} from "@ngrx/store";
import * as fromRoot from './app-state/index';
import * as candidateActions from './app-state/candidate.actions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'candidate';
  details: UserModel[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber','action'];


  constructor(public dialog: MatDialog,
              private readonly store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(candidateActions.getCandidates());
    this.store.select(fromRoot.getCandidates).pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.details =  data.candidates ? [...data.candidates] : []
    });
  }

  public openCandidateDialog(modalTitle: string, type: 'Update' | 'Add', data?: any ): void {

    this.dialog.open(CandidateDetailComponent, {
      data: {type, modalTitle, candidateDetails: data}
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
