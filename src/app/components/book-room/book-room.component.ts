import { Component, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';



@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.scss']
})


export class BookRoomComponent {
 
@ViewChild('myInputFrom') myInputFromDatePicker: any;
today!:string
  onDateTabFirstTo(event:any){}
  selectedRoom:number=0;
 
  isEditResertationVisible:boolean=true;
  isNormalVisible:boolean=true;
  isReceiveRoomVisible:boolean=true;
  isAddReservationVisible:boolean=true;
  myDate:Date=new Date();
  onDate(event:any){};
  checkStatusReservation(a:any){} ;
  dateThird:Date=new Date();
  remove(room:any){}
  rooms:any;
  openBottomSheet() {
    // this._bottomSheet.open(BottomSheetOverviewExampleSheetComponent);
  }
  selectedDateFirstTab:Date=new Date();
  
// hienj 6 ngày

onDateTabFirstFrom(event: any) {
  this.selectedDateFirstTab = event.value;
}
getNextSixDays(startDate: Date): Date[] {
  const nextSixDays: Date[] = [];
  for (let i = 0; i < 6; i++) {
    const nextDay = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    nextSixDays.push(nextDay);
  }
  return nextSixDays;
}
  constructor( ){
    this.today = this.getTodayDateString();

    console.log(this.today)
    
  }
  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];
  }

  //xử lí tang giam ngay
  getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  decreaseDate() {
    const currentDate = new Date(this.today);
    currentDate.setDate(currentDate.getDate() - 1);
    this.today = currentDate.toISOString().split('T')[0];
  }

  increaseDate() {
    const currentDate = new Date(this.today);
    currentDate.setDate(currentDate.getDate() + 1);
    this.today = currentDate.toISOString().split('T')[0];
  }

///show component
showComponentAddReservation:boolean=false; 
componentAddReservation(){
  this.showComponentAddReservation=!this.showComponentAddReservation;
  console.log(this.showComponentAddReservation)
}
showComponentAddPerson:boolean=false;
openAddPerson(){
  this.showComponentAddPerson=!this.showComponentAddPerson 
}

showComponentEditReservation:boolean=false;


  
   
}

