import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CandidateDetailComponent} from "./candidate-detail/candidate-detail.component";
import {CandidateService} from "./services/api-service.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CandidateDetailResponseModel} from "./shared/model/candidateDetail.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'candidate';
  details: CandidateDetailResponseModel[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber','action'];


  constructor(public dialog: MatDialog, public candidateService: CandidateService) {
  }

  ngOnInit(): void {
    this.getAllCandidate();

  }

  public openCandidateDialog(modalTitle: string, type: 'Update' | 'Add', data?: any ): void {

    const dialogRef = this.dialog.open(CandidateDetailComponent, {
      data: {type, modalTitle, candidateDetails: data}
    }).afterClosed().subscribe(() => {
      this.getAllCandidate();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private getAllCandidate() {
    this.candidateService.getAllCandidates().pipe(takeUntil(this.destroy$)).subscribe((response: { items: CandidateDetailResponseModel[], total: number }) => {
      this.details = [...response.items];
    })
  }
}
