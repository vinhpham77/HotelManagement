import { Component } from '@angular/core';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent {
  isFullNameP: boolean=false;
  validateFullNamePerson(event: any): void {
    const input = event.target.value;
    const pattern = /^[a-zA-Z\s]*$/;
    this.isFullNameP = !pattern.test(input);
  }
  //ham kt hotenP//
  isNamep: boolean=false;
   validateNamePerson(event: any): void {
     const input = event.target.value;
     const pattern = /^[a-zA-Z\s]*$/;
     this. isNamep = !pattern.test(input);
   }
   //ham kt tenP//

   //ham kiem tra tenP//
  
   isFNamep: boolean=false;
   validateFnamePerson(event: any): void {
     const input = event.target.value;
     const pattern = /^[a-zA-Z\s]*$/;
     this. isFNamep = !pattern.test(input);
   }
   //ham kt tenP//
   //ham kt sdt
   isPhoneNumberP: boolean = false;

   validatePhoneNumberPerson(event: any): void {
    const input = event.target.value;
     const pattern = /^\d{10}$/;
     this.isPhoneNumberP = !pattern.test(input);
   }
   //ham kt sdt
   // ham kt CCCD
isIdNoP: boolean = false;

validateIdNoPerson(event: any): void {
  const input = event.target.value;
  const pattern = /^[a-zA-Z0-9]+$/;
  this.isIdNoP = !pattern.test(input);
}
//ham kt CCCD
// kt quoc gia//
isCountryP: boolean = false;

  validateCountryPerson(event: any): void {
    const input = event.target.value;
    const pattern = /^[a-zA-Z]+$/;
    this.isCountryP = !pattern.test(input);
  }
//kt quoc gia
}
