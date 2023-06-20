import { Customer } from "./Customer";
import { ReservationDetail } from "./ReservationDetail";
import { Reservation } from "./reservation";

export interface BookRoomDTO {  
    Id:string;   
    Reservation: Reservation ; 
    Customer: Customer;
    ReservationDetail:ReservationDetail[];
}
