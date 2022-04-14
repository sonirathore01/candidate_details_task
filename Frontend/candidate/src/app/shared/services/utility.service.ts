import { Injectable } from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  checkLuhn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let correct = true;
      let text = '';

      let idNumber = control.value ? control.value.replaceAll(' ', '') : '';
      //Ref: http://www.sadev.co.za/content/what-south-african-id-number-made
      // SA ID Number have to be 13 digits, so check the length
      if (idNumber.length != 13 || !Number.isInteger(+idNumber)) {
        text='<p>ID number does not appear to be authentic - input not a valid number</p>';
        correct = false;
      }

      // get first 6 digits as a valid date
      var tempDate = new Date(idNumber.substring(0, 2), idNumber.substring(2, 4) - 1, idNumber.substring(4, 6));

      var id_date = tempDate.getDate();
      var id_month = tempDate.getMonth();

      if (!((tempDate.getFullYear().toString().substring(2, 4) == idNumber.substring(0, 2)) && (id_month == idNumber.substring(2, 4) - 1) && (id_date == idNumber.substring(4, 6)))) {
        text = '<p>ID number does not appear to be authentic - date part not valid</p>';
        correct = false;
      }

      // apply Luhn formula for check-digits
      var tempTotal = 0;
      var checkSum = 0;
      var multiplier = 1;
      for (var i = 0; i < 13; ++i) {
        tempTotal = parseInt(idNumber.charAt(i)) * multiplier;
        if (tempTotal > 9) {
          tempTotal = parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1));
        }
        checkSum = checkSum + tempTotal;
        multiplier = (multiplier % 2 == 0) ? 1 : 2;
      }
      if ((checkSum % 10) != 0) {
        text ='<p>ID number does not appear to be authentic - check digit is not valid</p>';
        correct = false;
      };
      if (!correct){
        return {'error': 'enter valid Number'}
      } else {
        return null
      }
    };
  }
}
