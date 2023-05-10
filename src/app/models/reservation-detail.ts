export interface ReservationDetail {
    id: string;
    reservevationId: string;
    roomId: string;
    checkInAt: Date;
    checkOutAt: Date;
    customerId: string;
    deposits: number;
    totalAdults: number;
    totalChildren: number;
    roomPricePerDay: number;
}
