import { Customer } from "./Customer";
import { ReservationDetail } from "./ReservationDetail";
import { Reservation } from "./reservation";

export interface BookRoomDTO {  
    id:string;   
    reservation: Reservation ; 
    customer: Customer;
    reservationDetail:ReservationDetail[];
}
