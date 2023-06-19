export interface ReservationDetail {
    id: string;
    reservevationId: string | null;
    roomId: string;
    checkInAt: Date;
    checkOutAt: Date | null;
    customerId: string;
    deposits: number;
    totalAdults: number;
    totalChildren: number;
    roomPricePerDay: number;
}
