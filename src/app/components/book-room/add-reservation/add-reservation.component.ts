import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss']
})
export class AddReservationComponent {
  selectedGender:string='';
  //ham kiem tra hotenP//
  @ViewChild('startDatePicker') startDatePicker: any;
  @ViewChild('endDatePicker') endDatePicker: any;
  startDate!:Date;
  ngAfterViewInit(): void {
 
    const currentDate = new Date();
    const nextDate = new Date();
    nextDate.setDate(currentDate.getDate() + 1);

    if (this.startDatePicker?._datepickerInput) {
      this.startDatePicker._datepickerInput.value = currentDate;
    }
  
    if (this.endDatePicker?._datepickerInput) {
      this.endDatePicker._datepickerInput.value = nextDate;
    }
  }
  
 // form choice phòng
 isChoicePhongHidden = false;

 hideChoicePhong() {
   this.isChoicePhongHidden = false;
   console.log(this.isChoicePhongHidden)
 }
 openChoicePhong(){
   if(this.isChoicePhongHidden == false){
   this.isChoicePhongHidden = true;
   console.log(this.isChoicePhongHidden)
   }
 }
 //form choicephong
 // add
 isAddPerson=false;
openAddPerson(){
 if(this.isAddPerson==false)
   this.isAddPerson=true;
   console.log(this.isAddPerson)
 }
 // add
  //ham kt sdtA
  isPhoneNumberA: boolean = false;

  validatePhoneNumberAdd(event: any): void {
   const input = event.target.value;
    const pattern = /^\d{10}$/;
    this.isPhoneNumberA = !pattern.test(input);
  }
  //ham kt sdtA

//ham kt CCCDA
isIdNoA: boolean = false;

validateIdNoAdd(event: any): void {
const input = event.target.value;
const pattern = /^[a-zA-Z0-9]+$/;
this.isIdNoA = !pattern.test(input);
}
//ham kt CCCD

///kiem tra tien coc
isDepositInput: boolean = false;

validateDepositInput(event: any): void {
const input = event.target.value;
const pattern = /^[a-zA-Z0-9\s]+$/
this.isDepositInput = !pattern.test(input);
}
// kt ngay nhan <=ngay tra

isDateRange: boolean = false;

checkDateRange(): void { 
const startDate = (this.startDatePicker.nativeElement.value);
const endDate = (this.endDatePicker.nativeElement.value);

console.log(startDate,endDate)
this.isDateRange = endDate>startDate?false:true;
}



//kt ngay nhan ><= ngay tra

}

