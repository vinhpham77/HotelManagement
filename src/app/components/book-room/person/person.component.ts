import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent {
  @Input() showComponentEdit: any;
  public date: Date = new Date();
  showComponenEdit(){
    this.showComponentEdit=true;

  }
  countleft(date: Date) {
    if(date < this.date) return '110px';
    let t = ((date.getTime() - this.date.getTime()) / (1000 * 60 * 60 * 24)) * 110 + 110 + 110 / 2;
    return t + "px";
  }
  // countWidth(reservedAt: Date, reservedOut: Date) {
  //   if(reservedAt < this.date) reservedAt = this.date;
  //   if(reservedOut >= this.dateEnd) reservedOut = this.dateEnd;
  //   let t = (Math.floor((reservedOut.getTime() - reservedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1) * 110 - 55;
  //   return t + "px";
  // }
}
