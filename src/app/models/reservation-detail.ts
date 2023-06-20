export interface ReservationDetail {
    id: string;
    reservationId: string | null;
    roomId: string;
    checkInAt: Date;
    checkOutAt: Date | null;
    customerId: string;
    deposits: number;
    totalAdults: number;
    totalChildren: number;
    roomPricePerDay: number;
}