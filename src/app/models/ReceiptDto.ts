import { ReservationDetail } from './ReservationDetail';
import { Personnel } from './Personnel';
import { Customer } from './Customer';
import { Room } from './Room';

export interface ReceiptDto {
  id: string;
  createdAt: Date;
  reservationDetailId: string;
  reservationDetail: ReservationDetail;
  personnelId: string;
  personnel: Personnel;
  customer: Customer;
  room: Room;
  orderPrice: number;
  totalPrice: number;
}
