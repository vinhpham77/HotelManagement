export interface ReservationDetail {
    id: string;
    reservevationId: string | null;
    roomId: string;
    checkedInAt: Date;
    checkedOutAt: Date | null;
    customerId: string;
    deposit: number;
    totalAdults: number;
    totalChildren: number;
    roomPricePerDay: number;
}
