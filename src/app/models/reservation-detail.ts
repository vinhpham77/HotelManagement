export interface ReservationDetail {
    id: string;
    reservevationId: string;
    roomId: string;
    checkinAt: Date;
    checkinOut: Date;
    customerId: string;
    deposits: number;
    totalAdults: number;
    totalChildren: number;
    roomPricePerDay: number;
}
