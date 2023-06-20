import { Customer } from "./Customer";
import { ReservationDetail } from "./ReservationDetail";

export interface MergeCD {   
    Id :string;
    ReservationDetail: ReservationDetail ;
    Customer: Customer 
}
