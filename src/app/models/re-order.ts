import { ReservationDetail } from "./ReservationDetail";
import { Order } from "./order";

export interface ReOrder {
    id: string;
    detail: ReservationDetail;
    order: Order;
}
