import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, startWith, takeUntil} from 'rxjs/operators';
import {Countries} from "../shared/model/Countries.model";
import {UtilityService} from "../shared/services/utility.service";
import {GooglePlaceDirective} from "ngx-google-places-autocomplete";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {CandidateService} from "../services/api-service.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {CandidateDetailRequestModel, CandidateDetailResponseModel} from "../shared/model/candidateDetail.model";


@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  type: string = 'Add';
  modalTitle: string = 'Candidate Details'
  candidateFrom: FormGroup = new FormGroup({});
  filteredOptions;
  dialCode = '';
  detailsApi: CandidateDetailRequestModel = {};
  candidateDetails: CandidateDetailResponseModel = {
    emailAddress: "",
    firstName: "",
    identifierNumber: 0,
    lastName: "",
    phoneNumber: 0
  };

  @ViewChild('placesRef')
  placesRef!: GooglePlaceDirective;


  constructor(public utilityService: UtilityService, public apiService: CandidateService,
              public dialogRef: MatDialogRef<CandidateDetailComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private  fb: FormBuilder) {
    this.modalTitle = this.data?.modalTitle;
    this.filteredOptions = this.candidateFrom.get('country')?.valueChanges.pipe(
      startWith(<string>''),
      map(value => {
        return this.utilityService.countries.filter((option: Countries) => option.name.toLowerCase().includes(value.toLowerCase()));
      }),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


  ngOnInit(): void {
    this.initCandidateFrom();
    this.type = this.data?.type;
    if(this.data && this.data.candidateDetails){
      this.candidateDetails = this.data.candidateDetails;
      this.getCandidateFrom.patchValue({
        ...this.candidateDetails, ...this.candidateDetails.address,
        ...this.candidateDetails.socialProfile
      })
    }

  }

  save() {

    this.detailsApi['user'] = {
      "identifierNumber": this.getCandidateFrom.get('identifierNumber')?.value,
      "firstName": this.getCandidateFrom.get('firstName')?.value,
      "lastName": this.getCandidateFrom.get('lastName')?.value,
      "emailAddress": this.getCandidateFrom.get('emailAddress')?.value,
      "phoneNumber": this.getCandidateFrom.get('phoneNumber')?.value
    }
    this.detailsApi['address'] = {
      "addressLine1": this.getCandidateFrom.get('addressLine1')?.value,
      "addressLine2": this.getCandidateFrom.get('addressLine2')?.value,
      "country": this.getCandidateFrom.get('country')?.value,
      "city": this.getCandidateFrom.get('city')?.value,
      "province": this.getCandidateFrom.get('province')?.value,
      "postalCode": Number(this.getCandidateFrom.get('postalCode')?.value)
    }
    this.detailsApi['socialMediaProfile'] = {
      "linkedin": this.getCandidateFrom.get('linkedin')?.value,
      "facebook": this.getCandidateFrom.get('facebook')?.value,
      "twitter": this.getCandidateFrom.get('twitter')?.value,
    }
  if(this.type === 'Add' ){
    this.apiService.saveCandidate(this.detailsApi).pipe((takeUntil(this.destroy$)))
      .subscribe((response) => {
        this.dialogRef.close();
      })
  }
  else if(this.type === 'Update'){
    this.apiService.updateCandidate(this.detailsApi, this.candidateDetails._id).pipe((takeUntil(this.destroy$)))
      .subscribe((response) => {
        this.dialogRef.close();
      })
  }


  }

  getRequireData(control: string) {
    switch (control) {
      case 'linkedin':
        this.getCandidateFrom.get(control)?.setValue(this.getCandidateFrom.get(control)?.value.replace('https:', '').replace('www.linkedin.com/in/', '').replaceAll('/', ''));
        break;
      case 'facebook':
        this.getCandidateFrom.get(control)?.setValue(this.getCandidateFrom.get(control)?.value.replace('https:', '').replace('www.facebook.com/', '').replaceAll('/', ''));
        break;
      case 'twitter':
        this.getCandidateFrom.get(control)?.setValue(this.getCandidateFrom.get(control)?.value.replace('https:', '').replace('www.twitter.com/', '').replaceAll('/', ''));
    }
  }

  handleAddressChange(address: Address) {
    console.log(address);
  }

  reset() {

  }

  onCountryChange(event: any) {
    this.dialCode = event.dialCode
  }

  getNumber(event: any) {
  }

  telInputObject(event: any) {
  }


  private initCandidateFrom(): void {
    this.candidateFrom = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:['', [Validators.required, Validators.minLength(2)]],
      emailAddress:['', [Validators.required, Validators.email]],
      phoneNumber:['', [Validators.required]],
      identifierNumber:['', [Validators.required, this.utilityService.checkLuhn()]],
      addressLine1:['', [Validators.required]],
      addressLine2:[''],
      country:['', [Validators.required]],
      city:['', [Validators.required]],
      province:['', [Validators.required]],
      postalCode:['', [Validators.required]],
      linkedin:['', [Validators.required]],
      facebook:['', [Validators.required]],
      twitter:['', [Validators.required]],
      _id: ['']
    })
  }

  public get getCandidateFrom(): FormGroup {
    return this.candidateFrom;
  }
}
