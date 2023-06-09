export interface ReservationDetail {
    id: string;
    reservationId: string | null;
    roomId: string;
    checkedInAt: Date;
    checkedOutAt: Date | null;
    customerId: string;
    deposit: number;
    totalAdults: number;
    totalChildren: number;
    roomPricePerDay: number;
}
