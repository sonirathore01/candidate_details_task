import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "../shared/services/utility.service";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { CandidateService } from "../services/api-service.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserModel } from "../shared/model/candidateDetail.model";
import { Store } from "@ngrx/store";
import * as candidateActions from '../app-state/candidate.actions'
import * as fromRoot from '../app-state/index';
declare var google: any;


@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {

  type: string = '';
  modalTitle: string = 'Candidate Details';
  candidateFrom: FormGroup = new FormGroup({});
  filteredOptions: any;
  candidateDetails: UserModel = {
    emailAddress: "",
    firstName: "",
    identifierNumber: 0,
    lastName: "",
    phoneNumber: 0
  };
  countryCode: any;
  countryStateList: any;
  filteredState: any;
  error : any;
  field : any;
  center : any = new google.maps.LatLng(this.apiService.location.latitude,this.apiService.location.longitude);
  circle : any = new google.maps.Circle({
    center : this.center,
    radius: 10000
  })

  placeOptions = {
    location:[this.center],
    bounds : this.circle.getBounds(),
    fields: ["address_components"],
    types: []
  } as any;
  telInstance: any;

  @ViewChild('placesRef')
  placesRef!: GooglePlaceDirective;
  @ViewChild('telInput') telInput: any;


  constructor(public utilityService: UtilityService, public apiService: CandidateService,
    public dialogRef: MatDialogRef<CandidateDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private readonly store: Store) {
    this.modalTitle = this.data?.modalTitle;
    this.initCandidateFrom();
    this.apiService.getCountryState().subscribe((res) => {
      this.countryStateList = res;
    });
  }

  ngOnInit(): void {
    this.type = this.data?.type;
    if (this.data && this.data.candidateId) {
      this.apiService.getCandidateDetails(this.data.candidateId).then((res: UserModel)=>{
        this.candidateFrom.patchValue(res)
      })
    }

  }

  filterCountryOption(flag = 'initial') {
    if (flag == 'initial') {
      this.filteredOptions = Object.entries(this.countryStateList.country);
    } else {
      this.filteredOptions = Object.entries(this.countryStateList.country).filter((c: any) => c[1].toLowerCase().includes(this.getAddressFrom?.get('country')?.value?.toLowerCase()));
    }
  }

  filterProvinceOption(flag = 'initial') {
    if (this.countryStateList && this.getAddressFrom.get('country')?.value && flag == 'filter') {
      let countryCode = Object.entries(this.countryStateList.country).find((c: any) => c[1] === this.getAddressFrom.get('country')?.value);
      this.filteredState = countryCode ? this.countryStateList.states[countryCode[0]].filter((state: any) => state.name.toLowerCase().includes(this.getAddressFrom.get('province')?.value.toLowerCase() ?? '')) : [];
    } else if (this.countryStateList && this.getAddressFrom.get('country')?.value && flag == 'initial') {
      let countryCode = Object.entries(this.countryStateList.country).find((c: any) => c[1] === this.getAddressFrom.get('country')?.value);
      this.filteredState = countryCode ? this.countryStateList.states[countryCode[0]] : [];
    } else {
      this.filteredState = [];
    }
  }

  save() {
    if (this.type === 'Add') {
      this.store.dispatch(candidateActions.addCandidate({ candidate: this.candidateFrom.value }));

      this.store.select(fromRoot.getCandidates).subscribe((data: any) => {

        if(Object.keys(data.error).length!==0){
          this.error = data.error.message;
          this.field  = data.error.field;
          data.error = null
        }
        if (data.status === "success") {
          this.error = data.error
          this.dialogRef.close()
        }
      });

    } else if (this.type === 'Update') {
      this.store.dispatch(candidateActions.updateCandidate({ candidate: this.candidateFrom.value}));
      this.store.select(fromRoot.getCandidates).subscribe((data: any) => {

        if(data.error && Object.keys(data.error).length!==0){
          this.error = data.error.message;
          this.field  = data.error.field;
        }
        if (data.status === "success") {
          this.error = data.error
          this.dialogRef.close()
        }
      });
    }
  }

  getRequireData(control: string) {
    switch (control) {
      case 'linkedin':
        this.getSocialFrom.get(control)?.setValue(this.getSocialFrom.get(control)?.value.replace('https:', '').replace('www.linkedin.com/in/', '').replaceAll('/', ''));
        break;
      case 'facebook':
        this.getSocialFrom.get(control)?.setValue(this.getSocialFrom.get(control)?.value.replace('https:', '').replace('www.facebook.com/', '').replaceAll('/', ''));
        break;
      case 'twitter':
        this.getSocialFrom.get(control)?.setValue(this.getSocialFrom.get(control)?.value.replace('https:', '').replace('www.twitter.com/', '').replaceAll('/', ''));
    }
  }

  handleAddressChange(address: Address) {
    this.getAddressFrom.get('postalCode')?.setValue(address.address_components.find((c) => c.types.includes('postal_code'))?.long_name);
    this.getAddressFrom.get('country')?.setValue(address.address_components.find((c) => c.types.includes('country'))?.long_name);
    this.getAddressFrom.get('city')?.setValue(address.address_components.find((c) => c.types.includes('locality'))?.long_name);
    this.getAddressFrom.get('province')?.setValue(address.address_components.find((c) => c.types.includes('administrative_area_level_1'))?.long_name);
    this.getAddressFrom.get('addressLine1')?.setValue((address.address_components.find((c) => c.types.includes('street_number'))?.long_name + ' ' ?? '') + (address.address_components.find((c) => c.types.includes('route'))?.long_name ?? ''));
  }

  reset() {
    this.getAddressFrom.reset();
  }

  onCountryChange(event: any) {
    this.countryCode = event.dialCode
    this.getPhoneNumberFrom.get('countryCode')?.setValue(event.dialCode);
  }

  hasError(event: Boolean) {
    if (!event) {
      this.getPhoneNumberFrom.get('number')?.setErrors({ 'incorrect': true });
    }
  }

  telInputObject(obj: any) {
    obj.setCountry(this.apiService.location.country);
    this.telInstance = obj;
  }



  private initCandidateFrom(): void {

    this.candidateFrom = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      emailAddress: ['', [Validators.required, Validators.email,]],
      phoneNumber: this.fb.group({
        countryCode: ['', [Validators.required]],
        number: ['', [Validators.required]]
      }),
      identifierNumber: ['', [Validators.required, this.utilityService.checkLuhn()]],
      address: this.fb.group({
        addressLine1: ['', [Validators.required]],
        addressLine2: [''],
        country: ['', [Validators.required]],
        city: ['', [Validators.required]],
        province: ['', [Validators.required]],
        postalCode: ['', [Validators.required]]
      }),
      socialProfile: this.fb.group({
        linkedin: [''],
        facebook: [''],
        twitter: ['',]
      }),
      _id: ['']
    })
  }

  public get getAddressFrom() {
    return this.candidateFrom.controls['address'];
  }

  public get getSocialFrom() {
    return this.candidateFrom.controls['socialProfile'];
  }

  public get getPhoneNumberFrom() {
    return this.candidateFrom.controls['phoneNumber'];
  }


  writeValue(value: any) {
    if (value) {
      this.telInput.nativeElement.value = value;
      if (this.telInstance) {
        this.telInstance.setNumber(value);
      }
    }
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  onTouched = () => { };

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onChange() {
    this.onTouched();
    const w: any = window;
    if (typeof w.intlTelInputUtils !== 'undefined') {
      const currentText = this.telInstance.getNumber(w.intlTelInputUtils.numberFormat.E164);
      if (typeof currentText === 'string') {
        this.telInstance.setNumber(currentText);
        this.getPhoneNumberFrom.get('number')?.setValue(this.telInput.nativeElement.value);
        this.propagateChange(this.telInput.nativeElement.value);
      }
    }
  }
}
