import { Component } from '@angular/core';

@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.scss']
})
export class BookRoomComponent {

  showAddReservationVisible(){}
  xemketqua(){}
  onDateTabFirstFrom(event:any){}
  onDateTabFirstTo(event:any){}
  showEditResertationVisible(){}
  showReceiveRoomVisible(){}

  selectTab:number=1;
  selectedDateFirstTab:number=1;
  selectedRoom:number=0;
  valuenull:string='';
  getroomType(valuenull:any){}
  listRoomTypes:string[]=[];
  searchQuery:string='';
  arrayfix:string[]=[];
  getDate:number=1;
  getMonth:number=1;
  listCheckReseDetail:string[]=[];
  customerName:string='';
  isEditResertationVisible:boolean=true;
  isNormalVisible:boolean=true;
  isReceiveRoomVisible:boolean=true;
  isAddReservationVisible:boolean=true;
  myDate:Date=new Date();
  onDate(event:any){};
  checkStatusReservation(a:any){} ;
  dateThird:Date=new Date()
  
}
