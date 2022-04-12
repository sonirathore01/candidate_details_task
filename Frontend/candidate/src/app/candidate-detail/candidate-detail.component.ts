import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {map, startWith} from 'rxjs/operators';
import {Countries} from "../shared/model/countries.model";
import {UtilityService} from "../shared/services/utility.service";
import {GooglePlaceDirective} from "ngx-google-places-autocomplete";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {CandidateService} from "../services/api-service.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CandidateDetailResponseModel} from "../shared/model/candidateDetail.model";


@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {

  type: string = 'Add';
  modalTitle: string = 'Candidate Details';
  candidateFrom: FormGroup = new FormGroup({});
  filteredOptions;
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
    this.initCandidateFrom();
    this.filteredOptions = this.getAddressFrom?.get('country')?.valueChanges.pipe(
      startWith(<string>''),
      map(value => {
        return this.utilityService.countries.filter((option: Countries) => option.name.toLowerCase().includes(value?.toLowerCase()));
      }),
    );
  }

  ngOnInit(): void {
    this.type = this.data?.type;
    if (this.data && this.data.candidateDetails) {
      this.candidateFrom.patchValue(this.data.candidateDetails)
    }

  }

  save() {
    if (this.type === 'Add') {
      this.apiService.saveCandidate(this.candidateFrom.value)
        .subscribe((response) => {
          this.dialogRef.close();
        })
    } else if (this.type === 'Update') {
      this.apiService.updateCandidate(this.candidateFrom.value, this.candidateFrom.value._id)
        .subscribe((response) => {
          this.dialogRef.close();
        })
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
    this.getAddressFrom.get('city')?.setValue(address.address_components.find((c) => c.types.includes('administrative_area_level_1'))?.long_name);
    this.getAddressFrom.get('addressLine1')?.setValue(address.formatted_address);
  }

  reset() {
    this.getAddressFrom.reset();
  }

  onCountryChange(event: any) {
    this.getPhoneNumberFrom.get('countryCode')?.setValue(event.dialCode);
  }

  hasError(event: Boolean) {
    if (!event) {
      this.getPhoneNumberFrom.get('number')?.setErrors({'incorrect': true});
    }
  }

  telInputObject(obj: any) {
    obj.setCountry('za');
  }

  private initCandidateFrom(): void {
    this.candidateFrom = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      emailAddress: ['', [Validators.required, Validators.email]],
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
}
