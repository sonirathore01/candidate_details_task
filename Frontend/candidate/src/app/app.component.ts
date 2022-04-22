import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CandidateDetailComponent} from "./candidate-detail/candidate-detail.component";
import {Subject} from "rxjs";
import {distinctUntilChanged, takeUntil} from "rxjs/operators";
import {UserModel} from "./shared/model/candidateDetail.model";
import {Store} from "@ngrx/store";
import * as fromRoot from './app-state/index';
import * as candidateActions from './app-state/candidate.actions'
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {SelectionModel} from "@angular/cdk/collections";
import {CandidateService} from "./services/api-service.service";
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'candidate';
  details: MatTableDataSource<UserModel> = new MatTableDataSource([] as UserModel[]);

  destroy$: Subject<boolean> = new Subject<boolean>();
  selection = new SelectionModel<UserModel>(true, []);
  displayedColumns: string[] = ['select', 'firstName', 'identifierNumber', 'address', 'emailAddress', 'phoneNumber', 'daysActive', 'action'];
  countryList: any;
  filterValue = '';
  total: number = 0;

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;


  constructor(public dialog: MatDialog,
              private apiService: CandidateService,
              private readonly store: Store) {
    this.apiService.getCountryState().subscribe((res: any)=> {
      this.countryList = res['country'];
    });
  }

  ngOnInit(): void {
    this.store.dispatch(candidateActions.getCandidates({filterValue: this.filterValue, selectedPage: 0, pageSize: 10}));
    this.store.select(fromRoot.getCandidates).pipe(
      distinctUntilChanged()
    ).subscribe((data: any) => {
      this.total = data.total;
      this.details =  new MatTableDataSource(data.candidates ? [...data.candidates] : []);
    });
  }

  ngAfterViewInit() {
    this.details.paginator = this.paginator;
    this.details.sort = this.sort;
  }

  public openCandidateDialog(modalTitle: string, type: 'Update' | 'Add', data?: any ): void {

    this.dialog.open(CandidateDetailComponent, {
      data: {type, modalTitle, candidateDetails: data}
    })
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.paginator.pageIndex = 0;
    this.store.dispatch(candidateActions.getCandidates({filterValue: this.filterValue, selectedPage: this.paginator.pageIndex, pageSize: this.paginator.pageSize}));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.details.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.details.data);
  }

  checkboxLabel(row?: UserModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getCountryCode(country: string) {
    let selected = country ? Object.entries(this.countryList).find((c: any)=> c[1].toLowerCase() == country.toLowerCase()) : null;
    return selected ? selected[0].toLowerCase() : '';
  }

  onPageChange(event: any) {
    this.store.dispatch(candidateActions.getCandidates({filterValue: this.filterValue, selectedPage: this.paginator.pageIndex, pageSize: this.paginator.pageSize}));
  }

  deleteCandidate(id: string) {
    this.store.dispatch(candidateActions.deleteCandidate({candidateIds: [id]}));
  }

  deleteSelected() {
    this.store.dispatch(candidateActions.deleteCandidate({candidateIds: this.selection.selected.map((c)=>c._id ? c._id : '')}));
    this.selection = new SelectionModel<UserModel>(true, []);
  }

  announceSortChange(event: any) {
    this.store.dispatch(candidateActions.getCandidates(
      {filterValue: this.filterValue,
        selectedPage: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        sortColumn: event.active,
        sortType: event.direction}));
  }

  
}
