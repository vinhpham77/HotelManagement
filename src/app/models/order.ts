import { OrderDetail } from "./order-detail";

export interface Order {
    id: string;
    reservationDetailId: string;
    details: OrderDetail[];
}