export interface ReservationDetail {
    id: string;
<<<<<<< HEAD:src/app/models/reservation-detail.ts
    reservevationId: string | null;
=======
    reservationId: string;
>>>>>>> b8a78653d44a7db6a2921fbe27e583b779901c44:src/app/models/ReservationDetail.ts
    roomId: string;
    checkedInAt: Date;
    checkedOutAt: Date | null;
    customerId: string;
    deposit: number;
    totalAdults: number;
    totalChildren: number;
    roomPricePerDay: number;
}
